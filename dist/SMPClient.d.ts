import { APIClient } from './api/APIClient.js';
import { AuthTokenManager } from './auth/AuthTokenManager.js';
import { SMPClientOptions } from './config/SMPConfig.js';
import { AxiosRequestConfig } from "axios";
import { GraphQLClient } from 'graphql-request';
import { AuthDomain, CatalogDomain, AccountingDomain, OrganizationDomain, UserDomain, BookingDomain, CommunicationDomain, ReviewDomain } from './domains/index.js';
import { LogIn } from './types/auth/index.js';
export declare class SMPClient {
    httpApiClient: APIClient;
    authTokenManager: AuthTokenManager;
    auth: AuthDomain;
    catalog: CatalogDomain;
    accounting: AccountingDomain;
    organization: OrganizationDomain;
    user: UserDomain;
    booking: BookingDomain;
    communication: CommunicationDomain;
    review: ReviewDomain;
    private loggedUser?;
    private loggedApp?;
    private wsClient?;
    private configManager;
    constructor(options: SMPClientOptions);
    authenticateApp(): Promise<void>;
    /** Propage l'IP et le User-Agent de l'utilisateur final (appels effectués côté serveur pour son compte). */
    setEndUserContext(context: {
        ip?: string | null;
        userAgent?: string | null;
    }): this;
    authenticateUser(username: string, password: string): Promise<LogIn | undefined>;
    getAppAccessToken(): Promise<string>;
    getUserAccessToken(): Promise<string | null>;
    getAppRefreshToken(): Promise<string | null>;
    getUserRefreshToken(): Promise<string | null>;
    logoutApp(): Promise<void>;
    logoutUser(): Promise<void>;
    private initWebSocket;
    updateHeaderUserAccessToken(accesToken: string): GraphQLClient;
    resetHeadersForUser(): void;
    query<T>(query: string, variables?: any): Promise<T>;
    post<T>(url: string | undefined, data: any, config?: AxiosRequestConfig): Promise<T>;
    get<T>(url?: string, config?: AxiosRequestConfig): Promise<T>;
    checkRateLimit(): boolean;
    trackDataSent(dataSize: number): boolean;
    trackDataReceived(dataSize: number): boolean;
    /**
     * État du client, à des fins de débogage.
     *
     * Ne divulgue plus `appSecret` ni le gestionnaire de tokens : cette méthode
     * les imprimait en clair dans la console du navigateur. Passe par le logger,
     * donc silencieuse en production.
     */
    printState(): void;
    clean(): void;
}
