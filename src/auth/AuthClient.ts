
import { SMPAPIClient } from "./../";
import { AuthTokenManager } from "./AuthTokenManager.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { MUTATION_AUTH_APP, MUTATION_AUTH_USER, MUTATION_REFRESH_APP_TOKEN, MUTATION_REFRESH_USER_TOKEN } from "../api/graphql/mutations/authMutations";
import { UserTokenResponse  } from "../types";
import { AppTokenResponse } from "../types";

export class SMPAuthClient {
  private httpClient: SMPAPIClient;
  private appId: string;
  private appSecret: string;

  constructor(appId: string, appSecret: string, httpClient: SMPAPIClient = new SMPAPIClient()) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.httpClient = httpClient;
  }

  async authenticateApp(): Promise<void> {
    try {
      const appLogin = { appId: this.appId, appSecret: this.appSecret };
      const response = await this.httpClient.query<AppTokenResponse>(MUTATION_AUTH_APP, appLogin);

      AuthTokenManager.getAppATManager().setToken(response.token);
      AuthTokenManager.getAppATManager().setRefreshToken(response.refreshToken);
      this.scheduleAppTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async authenticateUser(username: string, password: string): Promise<void> {
    try {
      const response = await this.httpClient.query<UserTokenResponse>(MUTATION_AUTH_USER, { username, password });
      AuthTokenManager.getUserATManager().setToken(response.token);
      AuthTokenManager.getUserATManager().setRefreshToken(response.refreshToken);
      this.scheduleUserTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "USER_AUTH_FAILED");
    }
  }

  async refreshAppToken(): Promise<void> {
    try {
      const response = await this.httpClient.query<{ token: string }>(MUTATION_REFRESH_APP_TOKEN, {});
      AuthTokenManager.getAppATManager().setToken(response.token);
      this.scheduleAppTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "APP_TOKEN_REFRESH_FAILED");
      AuthTokenManager.getAppATManager().clearTokens();
    }
  }

  async refreshUserToken(): Promise<void> {
    try {
      const refreshToken = AuthTokenManager.getUserATManager().getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await this.httpClient.query<{ token: string }>(MUTATION_REFRESH_USER_TOKEN, { refreshToken });
      AuthTokenManager.getUserATManager().setToken(response.token);
      this.scheduleUserTokenRefresh();
    } catch (error) {
      ErrorHandler.handleError(error, "USER_TOKEN_REFRESH_FAILED");
      AuthTokenManager.getUserATManager().clearTokens();
    }
  }

  private scheduleAppTokenRefresh() {
    const expirationTime = 3600 * 1000; // e.g., 1 hour
    setTimeout(() => this.refreshAppToken(), expirationTime - 60000); // Refresh 1 minute before expiration
  }

  private scheduleUserTokenRefresh() {
    setTimeout(() => this.refreshUserToken(), AuthTokenManager.getUserATManager().getTokenExpiry() - 60000); // Refresh 1 minute before expiration
  }

}