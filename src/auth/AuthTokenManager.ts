
import { ConfigManager } from "../config/ConfigManager.js"; 
import { AuthTokenStorage } from "./AuthTokenStorage.js";
import { TokenStorage, TokenStorageKind } from "./TokenStorageType.js"; 
import { APIClient } from "../api/APIClient.js";
import { MUTATION_AUTH_APP, MUTATION_AUTH_LOGOUT_APP, MUTATION_AUTH_LOGOUT_USER, MUTATION_AUTH_USER, 
  MUTATION_REFRESH_APP_TOKEN, MUTATION_REFRESH_USER_TOKEN } from "../api/graphql/mutations/authMutations.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

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

  constructor(configManager: ConfigManager, apiClient: APIClient) { 
    this.apiClient = apiClient;
    this.configManager = configManager;
    const config = configManager.getConfig();
    this.appTokenStorage = new AuthTokenStorage(AuthTokenStorage.AppKind, configManager.getStorage());
    this.userTokenStorage = new AuthTokenStorage(AuthTokenStorage.UserKind, configManager.getStorage());
    this.apiClient.updateHeaderAppID(config.appId);
    this.apiClient.updateHeaderAppSecret(config.appSecret);
  }

  public async authenticateApp(appId: string, appSecret: string): Promise<void> {
    const config = this.configManager.getConfig();
    try {
      const appLogin = { appId: appId, appSecret: appSecret };
      const response = await this.apiClient.query<TokenDataResponse>(MUTATION_AUTH_APP, appLogin);

      const { accessToken, refreshToken, expiresIn } = response;
      this.userTokenStorage.saveRefreshToken(refreshToken!);
      this.userTokenStorage.saveAccessToken(accessToken);

      const expiresInMilli  = expiresIn * 1000;
      const refreshDuration = config.appAccessDuration < expiresInMilli ? config.appAccessDuration : expiresInMilli;

      this.userTokenExpiresAt = Date.now() + expiresInMilli;
      this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.UserKind);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  public async authenticateUser(username: string, password: string): Promise<void> {
    const config = this.configManager.getConfig();
    try {
      const response = await this.apiClient.query<LoginResponse>(MUTATION_AUTH_USER, { username, password });
      const { accessToken, refreshToken, accessValidityDuration } = response.user;
      this.userTokenStorage.saveRefreshToken(refreshToken);
      this.userTokenStorage.saveAccessToken(accessToken);

      const expiresInMilli  = accessValidityDuration * 1000;
      const refreshDuration = config.userAccessDuration < expiresInMilli ? config.userAccessDuration : expiresInMilli;

      this.userTokenExpiresAt = Date.now() + expiresInMilli;
      this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.UserKind);
    } catch (error) {
      ErrorHandler.handleError(error, "USER_AUTH_FAILED");
    }
  }

  public getAppAccessToken(): string | null {
    return this.appTokenStorage.getAccessToken()
  }

  public getuserAccessToken(): string | null {
    return this.userTokenStorage.getAccessToken()
  }

  public getAppRefreshToken(): string | null {
    return this.appTokenStorage.getAccessToken()
  }

  public getuserRefreshToken(): string | null {
    return this.userTokenStorage.getAccessToken()
  }

  /**
  *
  */
  private async refreshUserToken(): Promise<void> {
    const config = this.configManager.getConfig();
    const refreshToken = this.userTokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No user refresh token available');
    }

    const response = await this.apiClient.query<TokenDataResponse>(MUTATION_REFRESH_USER_TOKEN, {refreshToken});
    const { accessToken, expiresIn } = response;
    const expiresInMilli  = expiresIn * 1000;
    const refreshDuration = config.userAccessDuration < expiresInMilli ? config.userAccessDuration : expiresInMilli;

    this.userTokenStorage.saveAccessToken(accessToken);
    this.apiClient.updateHeaderAppAccessToken(accessToken);

    this.userTokenExpiresAt = Date.now() + expiresInMilli;
    this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.UserKind);
  }

  /**
   * 
   */
  private async refreshAppToken(): Promise<void> {
    const config = this.configManager.getConfig();
    const refreshToken = this.userTokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No app refresh token available');
    }

    const response = await this.apiClient.query<TokenDataResponse>(MUTATION_REFRESH_APP_TOKEN, {refreshToken});
    const { accessToken, expiresIn } = response;
    const expiresInMilli  = expiresIn * 1000;
    const refreshDuration = config.userAccessDuration < expiresInMilli ? config.userAccessDuration : expiresInMilli;

    this.userTokenStorage.saveAccessToken(accessToken);
    // Register the new access to the future queries
    this.apiClient.updateHeaderUserAccessToken(accessToken);
    this.userTokenExpiresAt = Date.now() + expiresInMilli;
    this.scheduleTokenRefresh(refreshDuration, AuthTokenStorage.UserKind);
  }

  /**
   * scheduleAppTokenRefresh
   */
  private scheduleTokenRefresh(refreshDuration: number, type: TokenStorageKind): void {
    const config          = this.configManager.getConfig();
    const tokenExpiresAt  = type === AuthTokenStorage.AppKind ? this.appTokenExpiresAt : this.userTokenExpiresAt;
    const refreshInterval = type === AuthTokenStorage.AppKind ? this.appRefreshInterval : this.userRefreshInterval
    if (!tokenExpiresAt) {
      return;
    }

    const now = Date.now();
    const timeUntilExpiration = tokenExpiresAt - now ;

    if (refreshInterval) {
      clearTimeout(refreshInterval);
    }

    // Rafraîchir le token juste avant son expiration
    const timeOutInterval = setTimeout(() => {
      if (type === AuthTokenStorage.AppKind) {
        this.refreshAppToken();
      } else {
        this.refreshUserToken();
      }
    }, timeUntilExpiration - refreshDuration);
  }

    // Déconnexion de l'utilisateur
  public async logoutUser(userID: number): Promise<void> {
    const query = MUTATION_AUTH_LOGOUT_USER;

    await this.apiClient.query(query, { userID });

    this.userTokenStorage.clearTokens();
    this.clearScheduledRefresh(AuthTokenStorage.UserKind);
    this.apiClient.resetHeadersForUser() 
    this.userTokenExpiresAt = undefined;
  }
    // Déconnexion de l'utilisateur
  public async logoutApp(appID: number): Promise<void> {
    const query = MUTATION_AUTH_LOGOUT_APP;

    await this.apiClient.query(query, { appID });

    this.appTokenStorage.clearTokens();
    this.clearScheduledRefresh(AuthTokenStorage.AppKind);
    this.apiClient.resetHeadersForApplication();
    this.appTokenExpiresAt = undefined;
  }

  // Clean planed tasj
  private clearScheduledRefresh(storageType: TokenStorageKind = AuthTokenStorage.UserKind): void {
    if(storageType === AuthTokenStorage.AppKind) {
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

