import { APIClient } from './api/APIClient.js';
import { AuthTokenManager } from './auth/AuthTokenManager.js';
import { ErrorHandler } from './utils/ErrorHandler.js';
import { logger } from './utils/Logger.js';
import { i18n } from './i18n/index.js';
import { SMPClientOptions } from './config/SMPConfig.js';
import { ConfigManager } from './config/ConfigManager.js';
import { Persistence, PersistenceKind } from './config/Persistence.js';
import { AxiosRequestConfig } from "axios";
import { GraphQLClient, ClientError } from 'graphql-request';
import { AuthDomain, CatalogDomain, AccountingDomain, OrganizationDomain, UserDomain, BookingDomain, CommunicationDomain } from './domains/index.js';
import { LogIn, AppLogIn } from './types/auth/index.js';

export class SMPClient {
  public httpApiClient: APIClient;
  public authTokenManager: AuthTokenManager;

  // Nouveaux domaines (Architecture V2)
  public auth: AuthDomain;
  public catalog: CatalogDomain;
  public accounting: AccountingDomain;
  public organization: OrganizationDomain;
  public user: UserDomain;
  public booking: BookingDomain;
  public communication: CommunicationDomain;

  private loggedUser?: LogIn;
  private loggedApp?: AppLogIn;
  private wsClient?: WebSocket;
  private configManager: ConfigManager;

  constructor(options: SMPClientOptions) {
    this.configManager = new ConfigManager(options)
    this.httpApiClient = new APIClient(this.configManager);

    // Initialisation des Domaines
    this.auth = new AuthDomain(this.httpApiClient);
    this.catalog = new CatalogDomain(this.httpApiClient);
    this.accounting = new AccountingDomain(this.httpApiClient);
    this.organization = new OrganizationDomain(this.httpApiClient);
    this.user = new UserDomain(this.httpApiClient);
    this.booking = new BookingDomain(this.httpApiClient);
    this.communication = new CommunicationDomain(this.httpApiClient);


    this.authTokenManager = new AuthTokenManager(this.configManager, this.httpApiClient);
    this.httpApiClient.updateHeaderAppID(this.configManager.appId);
    this.httpApiClient.updateHeaderAppSecret(this.configManager.appSecret);
    this.httpApiClient.updateHeaderAppAccessToken("");
    if (this.configManager.wsEnabled) {
      this.initWebSocket();
    }
    logger.info(i18n.t('smp_client_init'));
  }

  async authenticateApp(): Promise<void> {
    try {
      const access = await this.getAppAccessToken();
      if (access) {
        logger.info("App already authenticated");
        return;
      }
      const app = await this.authTokenManager.authenticateApp(this.configManager.appId, this.configManager.appSecret);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async authenticateUser(username: string, password: string) {
    try {
      const access = await this.getUserAccessToken();
      if (access) {
        logger.info("User already authenticated");
        return this.loggedUser;
      }
      const login = await this.authTokenManager.authenticateUser(username, password);
      logger.info("Login succeed");
      if (login) {
        this.loggedUser = login;
        this.configManager.loggedUser = login.user;
      }
    }
    catch (error) {
      ErrorHandler.handleError(error, "USER_AUTH_FAILED");
    }
    return this.loggedUser;
  }

  async getAppAccessToken() {
    try {
      return await this.authTokenManager.getAppAccessToken();
    } catch (error) {
      return "";
    }
  }

  async getUserAccessToken() {
    try {
      return await this.authTokenManager.getUserAccessToken();
    } catch (error) {
      return null
    }
  }

  async getAppRefreshToken() {
    try {
      return await this.authTokenManager.getAppRefreshToken();
    } catch (error) {
      ErrorHandler.handleError(error, "APP_RETRIEVED_REFRESH_TOKEN_FAILED");
    }
  }

  async getUserRefreshToken() {
    try {
      return await this.authTokenManager.getUserRefreshToken();
    } catch (error) {
      ErrorHandler.handleError(error, "USER_RETRIEVED_REFRESH_TOKEN_FAILED");
    }
  }

  async logoutApp() {
    try {
      if (!this.loggedApp?.app?.applicationID) {
        throw new Error("Application ID non trouvé dans les données récupérées !");
      }
      return await this.authTokenManager.logoutApp(this.loggedApp.app.applicationID);
    } catch (error) {
      ErrorHandler.handleError(error, "USER_RETRIEVED_REFRESH_TOKEN_FAILED");
    }
  }


  async logoutUser() {
    try {
      const refreshToken = await this.getUserRefreshToken();
      const userId = this.loggedUser?.user?.userID || this.configManager.loggedUser?.userID;

      if (!userId) {
        logger.warn("No user ID found in loggedUser data, clearing local tokens only");
        this.authTokenManager['userTokenStorage'].clearTokens();
        this.loggedUser = undefined;
        return;
      }

      if (!refreshToken) {
        throw new Error("No refresh token found !");
      }

      await this.authTokenManager.logoutUser(userId, refreshToken);
      this.loggedUser = undefined;
      logger.info("Déconnexion réussie");
    } catch (error) {
      ErrorHandler.handleError(error, "USER_LOGOUT_FAILED");
      throw error;
    }
  }

  // Méthode pour initier une connexion WebSocket pour les notifications
  private initWebSocket() {
    this.wsClient = new WebSocket(`wss://${this.configManager.apiUrl}/subscriptions`);

    this.wsClient.onopen = () => {
      console.log('WebSocket connection established.');
      this.wsClient?.send(JSON.stringify({
        query: `
          subscription {
            notificationReceived {
              message
              timestamp
            }
          }
        `
      }));
    };

    this.wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.httpApiClient.trackDataReceived(event.data.length);
      console.log('Notification received:', data);
    };

    this.wsClient.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.wsClient.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }

  public updateHeaderUserAccessToken(accesToken: string): GraphQLClient {
    return this.httpApiClient.updateHeaderUserAccessToken(accesToken);
  }


  public resetHeadersForUser(): void {
    this.httpApiClient.resetHeadersForUser();
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    return await this.httpApiClient.query<T>(query, variables);
  }

  async post<T>(url: string = this.configManager.apiUrl, data: any, config?: AxiosRequestConfig): Promise<T> {
    return await this.httpApiClient.post<T>(url, data, config);
  }

  async get<T>(url: string = this.configManager.apiUrl, config?: AxiosRequestConfig): Promise<T> {
    return await this.httpApiClient.get<T>(url, config);
  }

  // Méthode pour vérifier la limite de débit avant d'effectuer une requête
  public checkRateLimit(): boolean {
    return this.httpApiClient.checkRateLimit();
  }

  // Méthode pour suivre la quantité de données envoyées
  public trackDataSent(dataSize: number): boolean {
    return this.httpApiClient.trackDataSent(dataSize);
  }

  // Méthode pour suivre la quantité de données reçues
  public trackDataReceived(dataSize: number): boolean {
    return this.httpApiClient.trackDataReceived(dataSize);
  }

  printState() {
    console.log("SMPClient State:");
    console.log("  AppId: ", this.configManager.appId);
    console.log("  AppSecret: ", this.configManager.appSecret);
    console.log("  AuthToken: ", this.authTokenManager);
    console.log("  Persistence: ", this.configManager.persistence);
    console.log("  Default Language: ", this.configManager.defaultLanguage);
  }

  clean() {

  }
}

