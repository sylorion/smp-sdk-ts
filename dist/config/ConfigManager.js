import { defaultLanguage } from '../i18n/languages.js';
import { Persistence } from './Persistence.js';
/**
 * Gère la configuration de la SDK.
 */
export class ConfigManager {
    constructor(options) {
        this.appId = "";
        this.appSecret = "";
        this.apiUrl = "";
        this.graphqlUrl = "https://dev-catalog.sh1.hidora.net/";
        this.defaultLanguage = defaultLanguage;
        this.persistence = Persistence.LocalStorageKind;
        this.requestWindowStart = Date.now();
        this.dataWindowStart = Date.now();
        this.wsEnabled = false;
        this.requestCount = 0;
        this.dataSent = 0;
        this.dataReceived = 0;
        this.appAccessDuration = 0; // configurable duration for app token refresh
        this.userAccessDuration = 0; // configurable duration for user token refresh
        this.minUserAccessDuration = 0; // enforced by backend
        this.minAppAccessDuration = 0; // enforced by backend
        this.appId = options.appId;
        this.appSecret = options.appSecret;
        this.appAccessDuration = options.appAccessDuration;
        this.userAccessDuration = options.userAccessDuration;
        this.minUserAccessDuration = options.minUserAccessDuration;
        this.minAppAccessDuration = options.minAppAccessDuration;
        this.apiUrl = options.apiUrl;
        this.graphqlUrl = options.graphqlUrl;
        this.defaultLanguage = options.defaultLanguage ?? defaultLanguage;
        this.persistence = options.persistence;
        this.storage = options.storage;
        this.rateLimits = options.rateLimits || { maxRequests: 1000, windowMs: 60000 };
        this.dataLimits = options.dataLimits || { maxDataSent: 1024 * 1024, maxDataReceived: 1024 * 1024, windowMs: 60000 };
        this.wsEnabled = options.wsEnabled || false;
        this.customFetch = options.customFetch;
        this.requestAgent = options.requestAgent;
        const now = new Date();
        this.loggedUser = {
            userID: 0,
            uniqRef: '',
            slug: '',
            username: '',
            email: '',
            plan: '',
            profileID: 0,
            lastLogin: now,
            loginDuration: 0,
            state: '',
            createdAt: now,
            updatedAt: now,
            twoFactorEnabled: false,
        };
        this.appToken = {
            accessToken: '',
            refreshToken: '',
            expiresIn: 0,
        };
        this.appToken = {
            accessToken: '',
            refreshToken: '',
            expiresIn: 0,
        };
    }
    /**
     * setLoggedUser
      */
    setUser(user) {
        this.loggedUser = user;
    }
    /**
     * setUserTokens
      */
    setUserTokens(userTokens) {
        this.userToken = userTokens;
    }
    /**
     * setAppTokens
      */
    setAppTokens(appTokens) {
        this.appToken = appTokens;
    }
    getLoggedUser() {
        return this.loggedUser;
    }
    /**
     * getStorage
     */
    getStorage() {
        return this.storage;
    }
    getUrl() {
        return this.apiUrl;
    }
}
