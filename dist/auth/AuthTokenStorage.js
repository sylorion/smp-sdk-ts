export class AuthTokenStorage {
    constructor(tokenStorageType, persistence, stringPrefixKey = "smp") {
        this.accessTokenKey = 'smp_access_token';
        this.refreshTokenKey = 'smp_refresh_token';
        this.accessTokenKey = `${stringPrefixKey}_${tokenStorageType}_access_token`;
        this.refreshTokenKey = `${stringPrefixKey}_${tokenStorageType}_refresh_token`;
        this.persistence = persistence;
    }
    saveAccessToken(token) {
        this.persistence.set(this.accessTokenKey, token);
    }
    saveRefreshToken(token) {
        this.persistence.set(this.refreshTokenKey, token);
    }
    getAccessToken() {
        return this.persistence.get(this.accessTokenKey);
    }
    getRefreshToken() {
        return this.persistence.get(this.refreshTokenKey);
    }
    clearTokens() {
        this.persistence.remove(this.accessTokenKey);
        this.persistence.remove(this.refreshTokenKey);
    }
}
AuthTokenStorage.AppKind = 'app';
AuthTokenStorage.UserKind = 'user';
