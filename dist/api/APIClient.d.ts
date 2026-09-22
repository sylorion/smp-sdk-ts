import { AxiosRequestConfig } from 'axios';
import { GraphQLClient } from 'graphql-request';
import { ConfigManager } from '../config/ConfigManager.js';
/**
 * Interface unifiée pour interagir avec les API REST et GraphQL.
 */
export declare class APIClient {
    private restClient;
    private graphqlClient;
    private config;
    private requestCount;
    private requestWindowStart;
    private dataSent;
    private dataReceived;
    private dataWindowStart;
    constructor(config: ConfigManager);
    /**
     * updateHeaderAppSecret
    */
    updateHeaderAppSecret(secret: string): GraphQLClient;
    updateHeaderAppID(secret: string): GraphQLClient;
    updateHeaderAppAccessToken(secret: string): GraphQLClient;
    resetHeaderAppSecret(): void;
    resetHeaderAppID(): void;
    resetHeaderAppAccessToken(): void;
    resetHeadersForApplication(): void;
    /**
    * updateHeaderAppAuthN
    */
    updateHeaderUserAccessToken(accesToken: string): GraphQLClient;
    /**
     * Contexte du client final (BFF / server-side) : IP publique et User-Agent du navigateur d'origine,
     * transmis à la gateway (`x-forwarded-for`, `user-agent`) pour la détection de nouvel appareil
     * et les alertes de sécurité. Sans cela, un appel serveur est vu comme « réseau interne / navigateur inconnu ».
     */
    setEndUserContext(context: {
        ip?: string | null;
        userAgent?: string | null;
    }): GraphQLClient;
    /**
     * Client dérivé portant des en-têtes supplémentaires SANS modifier l'instance partagée
     * (sûr pour des requêtes serveur concurrentes). Utilisé pour l'assertion d'identité
     * utilisateur signée (`x-smp-user-id` / `x-smp-user-signature`) ou un jeton utilisateur ponctuel.
     */
    withHeaders(headers: Record<string, string>): APIClient;
    /** Assertion d'identité signée côté serveur (HMAC partagé avec les microservices). */
    withUserAssertion(userID: string, signature: string): APIClient;
    /** Jeton utilisateur ponctuel, sans toucher au client partagé. */
    withUserAccessToken(accessToken: string): APIClient;
    private currentHeaders;
    resetHeadersForUser(): void;
    mutate<T>(mutation: string, variables?: any): Promise<T>;
    query<T>(query: string, variables?: any): Promise<T>;
    post<T>(url: string | undefined, data: any, config?: AxiosRequestConfig): Promise<T>;
    get<T>(url?: string, config?: AxiosRequestConfig): Promise<T>;
    checkRateLimit(): boolean;
    trackDataSent(dataSize: number): boolean;
    trackDataReceived(dataSize: number): boolean;
}
