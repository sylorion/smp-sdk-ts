import { PersistenceType } from '../config/Persistence.js';
import { TokenStorage, TokenStorageKind } from './TokenStorageType.js';
export declare class AuthTokenStorage implements TokenStorage {
    private accessTokenKey;
    private refreshTokenKey;
    private persistence;
    static AppKind: TokenStorageKind;
    static UserKind: TokenStorageKind;
    constructor(tokenStorageType: TokenStorageKind, persistence: PersistenceType, stringPrefixKey?: string);
    saveAccessToken(token: string): void;
    saveRefreshToken(token: string): void;
    getAccessToken(): string | null;
    getRefreshToken(): string | null;
    clearTokens(): void;
}
