
import { SupportedLang, defaultLanguage } from '../i18n/languages.js';
import { Persistence, PersistenceKind, PersistenceType } from './Persistence.js';
import { DataLimitOptions, RateLimitOptions, SMPClientOptions, SMPToken } from './SMPConfig.js';

/**
 * Gère la configuration de la SDK.
 */
export class ConfigManager {
  appId                 : string = "";
  appSecret             : string = "";
  apiUrl                : string = "";
  graphqlUrl            : string = "";
  defaultLanguage       : SupportedLang = "fr_FR";
  rateLimits?: RateLimitOptions;
  dataLimits?: DataLimitOptions; // Limites de quantité de données échangées
  requestCount: number = 0;
  requestWindowStart: number = Date.now();
  wsEnabled: boolean = false;
  wsClient?: WebSocket;
  dataSent: number = 0;
  dataReceived: number = 0;
  dataWindowStart: number = Date.now();
  appAccessDuration     : number = 0; // configurable duration for app token refresh
  userAccessDuration    : number = 0; // configurable duration for user token refresh
  minUserAccessDuration : number = 0; // enforced by backend
  minAppAccessDuration  : number = 0; // enforced by backend
  persistence           : PersistenceKind = Persistence.MemoryKind;
  storage?              : PersistenceType;
  appToken?: SMPToken ;
  userToken?: SMPToken ;
  loggedUser?: UserLogin ;

  constructor(options:SMPClientOptions) {
    this.appId = options.appId;
    this.appSecret = options.appSecret;
    this.appAccessDuration = options.appAccessDuration;
    this.userAccessDuration = options.userAccessDuration;
    this.minUserAccessDuration = options.minUserAccessDuration;
    this.minAppAccessDuration = options.minAppAccessDuration;
    this.apiUrl = options.apiUrl;
    this.graphqlUrl = options.graphqlUrl;
    this.defaultLanguage = options.defaultLanguage;
    this.persistence = options.persistence;
    this.storage = options.storage; 
    this.rateLimits = options.rateLimits || { maxRequests: 1000, windowMs: 60000 };
    this.dataLimits = options.dataLimits || { maxDataSent: 1024 * 1024, maxDataReceived: 1024 * 1024, windowMs: 60000 };
    this.wsEnabled = options.wsEnabled || false;
    const now = new Date();
    this.loggedUser = {
      accessToken: '',
      refreshToken: '',
      accessValidityDuration: this.userAccessDuration,
      details: {
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
      },
    };  
    this.appToken = {
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
    }
    this.appToken = {
      accessToken: '',
      refreshToken: '',
      expiresIn: 0,
    };
  }

  /**
   * setLoggedUser
    */
  public setUser(user: UserLogin) {
    this.loggedUser = user;
  }

  public getLoggedUser(): UserLogin | undefined {
    return this.loggedUser;
  }

  /**
   * getStorage
   */
  public getStorage() {
    return this.storage;
  }

  public getUrl(){
    return this.apiUrl;
  }
}
