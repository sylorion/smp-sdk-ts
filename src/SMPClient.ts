
import { APIClient } from "./api/APIClient.js"; 
import { AuthTokenManager } from "./auth/AuthTokenManager.js";
import { ErrorHandler } from "./utils/ErrorHandler.js";
import { logger } from './utils/Logger.js';
import { i18n } from './i18n/index.js'; 
import { SMPClientOptions } from "./config/SMPConfig.js";
import { ConfigManager } from "./config/ConfigManager.js";
import { Persistence, PersistenceKind } from "./config/Persistence.js";
import { AxiosRequestConfig } from "axios";
import { GraphQLClient, ClientError } from 'graphql-request'; 
export class SMPClient {
  public httpApiClient: APIClient; 
  public authTokenManager: AuthTokenManager;
  // public notificationManager: AuthTokenManager;
  private internalDB: Persistence;
  private wsClient?: WebSocket;
  private configManager: ConfigManager; 

  constructor(options: SMPClientOptions) {
    this.internalDB = new Persistence(Persistence.MemoryKind);
    this.configManager = new ConfigManager(options)

    this.httpApiClient    = new APIClient(this.configManager);
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
      this.internalDB.set("smp_app_0", app);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async authenticateUser(username: string, password: string): Promise<void> {
    try {
      const access = await this.getUserAccessToken();
      if (access) {
        logger.info("User already authenticated");
        return;
      }
      const login = await this.authTokenManager.authenticateUser(username, password);
      console.log("Login succeed");
      console.log(JSON.stringify(login));
      this.internalDB.set("smp_user_0", login);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async getAppAccessToken(){
    try {
      return await this.authTokenManager.getAppAccessToken();
    } catch (error) {
      return "";
    }
  }

  async getUserAccessToken(){
    try {
      return await this.authTokenManager.getUserAccessToken();
    } catch (error) {
      return null
    }
  }

  async getAppRefreshToken(){
    try {
      return await this.authTokenManager.getAppRefreshToken();
    } catch (error) {
      ErrorHandler.handleError(error, "APP_RETRIEVED_REFRESH_TOKEN_FAILED");
    }
  }

  async getUserRefreshToken(){
    try {
      return await this.authTokenManager.getUserRefreshToken();
    } catch (error) {
      ErrorHandler.handleError(error, "USER_RETRIEVED_REFRESH_TOKEN_FAILED");
    }
  }

  async logoutApp(){
    try {
      const app = this.internalDB.get("smp_app_0");
      return await this.authTokenManager.logoutApp(app.appId);
    } catch (error) {
      ErrorHandler.handleError(error, "USER_RETRIEVED_REFRESH_TOKEN_FAILED");
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

  printState(){
    console.log("SMPClient State:");
    console.log("  AppId: ", this.configManager.appId);
    console.log("  AppSecret: ", this.configManager.appSecret);
    console.log("  AuthToken: ", this.authTokenManager);
    console.log("  Persistence: ", this.configManager.persistence);
    console.log("  Default Language: ", this.configManager.defaultLanguage);
  }
  
  clean(){
    
  }
}

