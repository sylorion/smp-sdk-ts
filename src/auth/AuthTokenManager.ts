
import { ConfigManager } from '../config/ConfigManager.js';
import { AuthTokenStorage } from './AuthTokenStorage.js';
import { TokenStorage, TokenStorageKind } from './TokenStorageType.js';
import { APIClient } from '../api/APIClient.js';
import {
  MUTATION_AUTH_APP, MUTATION_AUTH_LOGOUT_APP, MUTATION_AUTH_LOGOUT_USER, MUTATION_AUTH_USER,
  MUTATION_REFRESH_APP_TOKEN, MUTATION_REFRESH_USER_TOKEN
} from '../api/graphql/user/mutations.js';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { logger } from '../utils/Logger.js';
import { AppLogIn, AppLoginResponse, LogIn, LoginResponse } from '../types/auth/index.js';

interface TokenDataResponse {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export class AuthTokenManager {
  private appTokenStorage: TokenStorage;
  private userTokenStorage: TokenStorage;
  private configManager: ConfigManager;
  private apiClient: APIClient;
  // private userTokenRefreshExpiresAt?: number; // TODO use it to invalidate user refresh token
  // private appTokenRefreshExpiresAt?: number; // TODO use it to invalidate app refresh token 
  private userTokenExpiresAt?: number;
  private appTokenExpiresAt?: number;
  private appRefreshInterval?: NodeJS.Timeout;
  private userRefreshInterval?: NodeJS.Timeout;
  private userRefreshPromise?: Promise<void>;

  constructor(configManager: ConfigManager, apiClient: APIClient) {
    this.apiClient = apiClient;
    this.configManager = configManager;
    this.appTokenStorage = new AuthTokenStorage(AuthTokenStorage.AppKind, configManager.storage!);
    this.userTokenStorage = new AuthTokenStorage(AuthTokenStorage.UserKind, configManager.storage!);
    this.apiClient.updateHeaderAppID(this.configManager.appId);
    this.apiClient.updateHeaderAppSecret(this.configManager.appSecret);
  }

  private isUserTokenExpired(): boolean {
    if (!this.userTokenExpiresAt) {
      return true;
    }
    const now = Date.now();
    return now >= this.userTokenExpiresAt;
  }

  private isAppTokenExpired(): boolean {
    if (!this.appTokenExpiresAt) {
      return true;
    }
    const now = Date.now();
    return now >= this.appTokenExpiresAt;
  }

  public async authenticateApp(appId: string, appSecret: string): Promise<AppLogIn> {
    try {
      const appLogin = { appID: appId, appKey: appSecret };
      const response = await this.apiClient.query<AppLoginResponse>(MUTATION_AUTH_APP, { appLoginInput: appLogin });

      const accessToken = response.authenticateApp.accessToken;
      const refreshToken = response.authenticateApp.refreshToken;
      const expiresInMilli = 1000 * response.authenticateApp.accessValidityDuration;
      this.appTokenStorage.saveRefreshToken(refreshToken);
      this.appTokenStorage.saveAccessToken(accessToken);
      // Register the new access to the future queries
      this.apiClient.updateHeaderAppAccessToken(accessToken);

      const refreshDuration = this.configManager.appAccessDuration < expiresInMilli ?
        this.configManager.appAccessDuration : expiresInMilli;

      this.appTokenExpiresAt = Date.now() + expiresInMilli;
      this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.AppKind);
      return response.authenticateApp;
    } catch (error) {
      throw ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  public async authenticateUser(username: string, password: string): Promise<LogIn> {
    try {
      const response = await this.apiClient.query<LoginResponse>(MUTATION_AUTH_USER, { loginInput: { email: username, password } });
      // const { accessToken, refreshToken, accessValidityDuration } = response.user;
      const accessToken = response.login.accessToken;
      const refreshToken = response.login.refreshToken;
      const expiresInMilli = 1000 * response.login.accessValidityDuration;
      console.log(`[AuthTokenManager] Saving user tokens...`);
      this.userTokenStorage.saveRefreshToken(refreshToken);
      this.userTokenStorage.saveAccessToken(accessToken);
      // Register the new access to the future queries
      this.apiClient.updateHeaderUserAccessToken(accessToken);

      const refreshDuration = this.configManager.userAccessDuration < expiresInMilli ?
        this.configManager.userAccessDuration : expiresInMilli;

      this.userTokenExpiresAt = Date.now() + expiresInMilli;
      console.log(`[AuthTokenManager] Scheduling user token refresh in ${refreshDuration}ms`);
      this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.UserKind);
      return response.login
    } catch (error) {
      throw ErrorHandler.handleError(error, "USER_AUTH_FAILED");
    }
  }

  public getAppRefreshToken(): string | null {
    return this.appTokenStorage.getRefreshToken()
  }

  public getUserRefreshToken(): string | null {
    return this.userTokenStorage.getRefreshToken()
  }

  // Récupérer le token d'accès actuel ou rafraîchir s'il a expiré
  public async getUserAccessToken(): Promise<string> {
    const currentToken = this.userTokenStorage.getAccessToken() || '';
    if (this.isUserTokenExpired() || !currentToken) {
      const refreshToken = this.userTokenStorage.getRefreshToken();
      if (!refreshToken) return '';
      logger.info('User Access token expired, refreshing...');
      return await this.refreshUserAccessToken();
    }
    return currentToken;
  }

  public async getAppAccessToken(): Promise<string> {
    const currentToken = this.appTokenStorage.getAccessToken() || '';
    if (this.isAppTokenExpired() || !currentToken) {
      const refreshToken = this.appTokenStorage.getRefreshToken();
      if (!refreshToken) return '';
      logger.info('App Access token expired, refreshing...');
      return await this.refreshAppAccessToken();
    }
    return currentToken;
  }

  private async refreshUserAccessToken(): Promise<string> {
    if (this.userRefreshPromise) {
      await this.userRefreshPromise;
      return this.userTokenStorage.getAccessToken() || '';
    }

    this.userRefreshPromise = (async () => {
      try {
        console.log(`[AuthTokenManager] refreshUserAccessToken triggered`);
        const refreshToken = this.userTokenStorage.getRefreshToken();
        if (!refreshToken) {
          console.error(`[AuthTokenManager] CRITICAL: Refresh token is MISSING from storage!`);
          throw new Error('No user refresh token available');
        } else {
          logger.info(`Refresh Token USED ${Date.now().toLocaleString()}: [HIDDEN]\n\n`);
        }

        const response = await this.apiClient.query<{ refreshUserToken: TokenDataResponse }>(MUTATION_REFRESH_USER_TOKEN, { refreshToken });

        const accessToken = response.refreshUserToken.accessToken;
        const expiresIn = response.refreshUserToken.expiresIn;
        const expiresInMilli = expiresIn * 1000;
        const refreshDuration = this.configManager.userAccessDuration < expiresInMilli ?
          this.configManager.userAccessDuration : expiresInMilli;

        this.userTokenStorage.saveAccessToken(accessToken);
        this.apiClient.updateHeaderUserAccessToken(accessToken);
        logger.info(`Refresh User token, new token: [HIDDEN]`);
        this.userTokenExpiresAt = Date.now() + expiresInMilli;
        this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.UserKind);
      } finally {
        this.userRefreshPromise = undefined;
      }
    })();

    await this.userRefreshPromise;
    return this.userTokenStorage.getAccessToken() || '';
  }

  /**
   * 
   */
  private async refreshAppAccessToken(): Promise<string> {
    const refreshToken = this.appTokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No app refresh token available');
    }

    const response = await this.apiClient.query<TokenDataResponse>(MUTATION_REFRESH_APP_TOKEN, { refreshToken });
    const { accessToken, expiresIn } = response;
    const expiresInMilli = expiresIn * 1000;
    const refreshDuration = this.configManager.appAccessDuration < expiresInMilli ?
      this.configManager.appAccessDuration : expiresInMilli;

    this.appTokenStorage.saveAccessToken(accessToken);
    // Register the new access to the future queries
    this.apiClient.updateHeaderAppAccessToken(accessToken);
    this.appTokenExpiresAt = Date.now() + expiresInMilli;
    this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.AppKind);
    return accessToken;
  }

  /**
   * scheduleAppTokenRefresh
   */
  private scheduleTokenRefresh(refreshDuration: number, type: TokenStorageKind): void {
    const tokenExpiresAt = type === AuthTokenStorage.AppKind ? this.appTokenExpiresAt : this.userTokenExpiresAt;
    const refreshInterval = type === AuthTokenStorage.AppKind ? this.appRefreshInterval : this.userRefreshInterval
    if (!tokenExpiresAt) {
      return;
    }

    const now = Date.now();
    const timeUntilExpiration = tokenExpiresAt - now;

    if (refreshInterval) {
      clearTimeout(refreshInterval);
    }

    // Rafraîchir le token avant son expiration (en soustrayant le paramètre refreshDuration configuré)
    const triggerTime = Math.max(0, timeUntilExpiration - refreshDuration);

    const timeout = setTimeout(() => {
      if (type === AuthTokenStorage.AppKind) {
        this.refreshAppAccessToken().catch(e => logger.error("Failed to refresh app token", e));
      } else {
        this.refreshUserAccessToken().catch(e => logger.error("Failed to refresh user token", e));
      }
    }, triggerTime);

    if (type === AuthTokenStorage.AppKind) {
      this.appRefreshInterval = timeout;
    } else {
      this.userRefreshInterval = timeout;
    }
  }

  // Déconnexion de l'utilisateur
  // Déconnexion de l'utilisateur
  async logoutUser(userID: number, refreshToken: string) {
    try {
      const query = MUTATION_AUTH_LOGOUT_USER;
      const variables = {
        input: { userID, refreshToken },
      };

      console.log("LOGOUT USER - Start of logout ");
      await this.apiClient.query(query, variables);

      // Suppression des tokens
      this.userTokenStorage.clearTokens();
      this.clearScheduledRefresh(AuthTokenStorage.UserKind);

      this.apiClient.resetHeadersForUser();
      this.userTokenExpiresAt = undefined;

      console.log("logout successful");
    } catch (error) {
      console.error("Error during logout", error);
      throw new Error("logout failed, please try again");
    }
  }

  // Déconnexion de l'app
  public async logoutApp(appID: string): Promise<void> {
    const query = MUTATION_AUTH_LOGOUT_APP;

    await this.apiClient.query(query, { appID });

    this.appTokenStorage.clearTokens();
    this.clearScheduledRefresh(AuthTokenStorage.AppKind);
    this.apiClient.resetHeadersForApplication();
    this.appTokenExpiresAt = undefined;
  }

  // Clean planed tasj
  private clearScheduledRefresh(storageType: TokenStorageKind = AuthTokenStorage.UserKind): void {
    if (storageType === AuthTokenStorage.AppKind) {
      if (this.appRefreshInterval) {
        clearTimeout(this.appRefreshInterval);
        this.appRefreshInterval = undefined;
      }
    } else {
      if (this.userRefreshInterval) {
        clearTimeout(this.userRefreshInterval);
        this.userRefreshInterval = undefined;
      }
    }
  }
}

