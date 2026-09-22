import { ConfigManager } from '../config/ConfigManager.js';
import { APIClient } from '../api/APIClient.js';
import { AppLogIn, LogIn } from '../types/auth/index.js';
export declare class AuthTokenManager {
    private appTokenStorage;
    private userTokenStorage;
    private configManager;
    private apiClient;
    private userTokenExpiresAt?;
    private appTokenExpiresAt?;
    private appRefreshInterval?;
    private userRefreshInterval?;
    private userRefreshPromise?;
    constructor(configManager: ConfigManager, apiClient: APIClient);
    private isUserTokenExpired;
    private isAppTokenExpired;
    authenticateApp(appId: string, appSecret: string): Promise<AppLogIn>;
    authenticateUser(username: string, password: string): Promise<LogIn>;
    getAppRefreshToken(): string | null;
    getUserRefreshToken(): string | null;
    getUserAccessToken(): Promise<string>;
    getAppAccessToken(): Promise<string>;
    private refreshUserAccessToken;
    /**
     *
     */
    private refreshAppAccessToken;
    /**
     * scheduleAppTokenRefresh
     */
    private scheduleTokenRefresh;
    logoutUser(userID: number, refreshToken: string): Promise<void>;
    logoutApp(appID: string): Promise<void>;
    private clearScheduledRefresh;
}
