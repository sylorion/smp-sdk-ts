import type { Agent } from 'http';
import { SupportedLang } from '../i18n/languages.js';
import { PersistenceKind, PersistenceType } from './Persistence.js';
import { DataLimitOptions, RateLimitOptions, SMPClientOptions, SMPToken } from './SMPConfig.js';
import { UserLoggedIn } from '../types/auth/index.js';
/**
 * Gère la configuration de la SDK.
 */
export declare class ConfigManager {
    appId: string;
    appSecret: string;
    apiUrl: string;
    graphqlUrl: string;
    defaultLanguage: SupportedLang;
    persistence: PersistenceKind;
    rateLimits?: RateLimitOptions;
    dataLimits?: DataLimitOptions;
    storage?: PersistenceType;
    requestWindowStart: number;
    dataWindowStart: number;
    wsEnabled: boolean;
    appToken?: SMPToken;
    userToken?: SMPToken;
    loggedUser?: UserLoggedIn;
    wsClient?: WebSocket;
    customFetch?: typeof fetch;
    requestAgent?: Agent;
    requestCount: number;
    dataSent: number;
    dataReceived: number;
    appAccessDuration: number;
    userAccessDuration: number;
    minUserAccessDuration: number;
    minAppAccessDuration: number;
    constructor(options: SMPClientOptions);
    /**
     * setLoggedUser
      */
    setUser(user: UserLoggedIn): void;
    /**
     * setUserTokens
      */
    setUserTokens(userTokens: SMPToken): void;
    /**
     * setAppTokens
      */
    setAppTokens(appTokens: SMPToken): void;
    getLoggedUser(): UserLoggedIn | undefined;
    /**
     * getStorage
     */
    getStorage(): PersistenceType | undefined;
    getUrl(): string;
}
