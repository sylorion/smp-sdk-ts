
import { HttpClient } from "../utils/HttpClient";
import { AuthTokenManager } from "./AuthTokenManager";
import { ErrorHandler } from "../utils/ErrorHandler";
import { MUTATION_AUTH_APP, MUTATION_AUTH_USER, MUTATION_REFRESH_APP_TOKEN, MUTATION_REFRESH_USER_TOKEN } from "../api/graphql/mutations/authMutations";
import { UserTokenResponse  } from "../types";
import { AppTokenResponse } from "../types";

export class AuthClient {
  private httpClient: HttpClient;
  private userAuthManager: AuthTokenManager;
  private appAuthManager: AuthTokenManager;

  constructor(private appId: string, private appSecret: string) {
    this.httpClient = new HttpClient();
    this.userAuthManager = new AuthTokenManager(AuthTokenManager.defaultTokenExpiry);
    this.appAuthManager = new AuthTokenManager(AuthTokenManager.defaultTokenExpiry * 24);
  }

  async authenticateApp(): Promise<void> {
    try {
      const appLogin = { appId: this.appId, appSecret: this.appSecret } ;
      const response = await this.httpClient.graphql<AppTokenResponse>(MUTATION_AUTH_APP, appLogin);

      this.appAuthManager.setToken(response.token);
      this.appAuthManager.setRefreshToken(response.refreshToken);
      this.scheduleAppTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async authenticateUser(username: string, password: string): Promise<void> {
    try {
      const response = await this.httpClient.graphql<UserTokenResponse>(MUTATION_AUTH_USER, { username, password });
      this.userAuthManager.setToken(response.token);
      this.userAuthManager.setRefreshToken(response.refreshToken);
      this.scheduleUserTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "USER_AUTH_FAILED");
    }
  }

  async refreshAppToken(): Promise<void> {
    try {
      const response = await this.httpClient.graphql<{ token: string }>(MUTATION_REFRESH_APP_TOKEN, {});
      this.appAuthManager.setToken(response.token); 
      this.scheduleAppTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "APP_TOKEN_REFRESH_FAILED");
      this.appAuthManager.clearTokens();
    }
  }

  async refreshUserToken(): Promise<void> {
    try {
      const refreshToken = this.userAuthManager.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");
      
      const response = await this.httpClient.graphql<{ token: string }>(MUTATION_REFRESH_USER_TOKEN, { refreshToken });
      this.userAuthManager.setToken(response.token);
      this.scheduleUserTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "USER_TOKEN_REFRESH_FAILED");
      this.userAuthManager.clearTokens();
    }
  }

  private scheduleAppTokenRefresh() {
    const expirationTime = 3600 * 1000; // e.g., 1 hour
    setTimeout(() => this.refreshAppToken(), expirationTime - 60000); // Refresh 1 minute before expiration
  }

  private scheduleUserTokenRefresh() {
    setTimeout(() => this.refreshUserToken(), this.userAuthManager.getTokenExpiry() - 60000); // Refresh 1 minute before expiration
  }
  
}

