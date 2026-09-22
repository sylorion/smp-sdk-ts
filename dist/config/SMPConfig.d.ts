import type { Agent } from "http";
import { SupportedLang } from '../i18n/languages.js';
import { PersistenceKind, PersistenceType } from './Persistence.js';
export interface RateLimitOptions {
    maxRequests: number;
    windowMs: number;
    message?: string;
}
export interface DataLimitOptions {
    maxDataSent: number;
    maxDataReceived: number;
    windowMs: number;
}
export interface SMPToken {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export type SMPClientOptions = {
    appId: string;
    appSecret: string;
    apiUrl: string;
    graphqlUrl: string;
    defaultLanguage: SupportedLang;
    appAccessDuration: number;
    userAccessDuration: number;
    minUserAccessDuration: number;
    minAppAccessDuration: number;
    persistence: PersistenceKind;
    storage: PersistenceType;
    rateLimits?: RateLimitOptions;
    dataLimits?: DataLimitOptions;
    wsEnabled?: boolean;
    customFetch?: typeof fetch;
    requestAgent?: Agent;
};
/**
* @deprecated
* @internal
* @hidden
*/
export type SMPConfig = SMPClientOptions;
