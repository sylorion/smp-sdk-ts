import { SupportedLang, defaultLanguage } from '../i18n/languages.js';
import { Persistence, PersistenceKind } from './Persistence.js';
import { SMPConfig } from './SMPConfig.js';

/**
 * Gère la configuration de la SDK.
 */
export class ConfigManager {
  static defaultConfig: SMPConfig = ConfigManager.loadDefaultConfig(); 
  private config: SMPConfig; 
  private loggedUser: UserLogin 
  constructor(config:SMPConfig) {
        console.log("SMP Config............ ");

        const now = new Date();
        console.log("SMP Config............ ", now);
    this.loggedUser = {
    accessToken: '',
    refreshToken: '',
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
    accessValidityDuration: 0
  } ;
  console.log("SMP Config Logged............ ", this.loggedUser);
    this.config = config;

  }

  /**
   * Charge la configuration avec des valeurs par défaut ou personnalisées.
   * @param customConfig - Configuration personnalisée.
   */
  static loadDefaultConfig(customConfig?: Partial<SMPConfig>): SMPConfig {
    const defaultConfig: SMPConfig = {
      appId: 'f2655ffda8594852',
      appSecret: 'TA7Vin/JY0YIp9sGpiy6d7ade351Ub+Ia3Pj1acdMb7AxKL/t1vVCcXt6NSaEiTfYbCes1b4Qs8l54buR17oQdsP9p0lpx0ojKaSdjzER9ftagPpr/5byPZhyxsQNU/V9dzoIx4eVV2sSiuFq4XFNL48v6wZz3znX4IlLenGji8=',
      apiUrl: 'https://dev.api.services.ceo',
      graphqlUrl: 'https://dev.api.services.ceo/graphql',
      defaultLanguage: defaultLanguage,
      appAccessDuration: 3600, // 1 heure
      userAccessDuration: 3600, // 1 heure
      minUserAccessDuration: 3600, // 1 heure
      minAppAccessDuration: 3600, // 1 heure
      persistence: Persistence.LocalStorageKind,
      storage: new Persistence(),
    };
    
    ConfigManager.defaultConfig = { ...defaultConfig, ...customConfig };
    return ConfigManager.defaultConfig ;
  }

  /**
   * Retourne la configuration par default actuelle.
   */
  static getDefaultConfig(): SMPConfig {
    return ConfigManager.defaultConfig;
  }

  /**
   * setLoggedUser
    */
  public setUser(user: UserLogin) {
    this.loggedUser = user;
  }

  public getLoggedUser(): UserLogin {
    return this.loggedUser;
  }

  /**
   * updateConfig
   * customConfig?:  Partial<SMPConfig>
   */
  public updateConfig(customConfig?: Partial<SMPConfig>) {
    this.config = { ...this.config, ...customConfig };
  }

  /**
   * updateConfig
   * customConfig?:  Partial<SMPConfig>
   */
  public getConfig() {
    if (this.loggedUser) {
      console.log(this.loggedUser);
    }
    return this.config;
  }

  /**
   * getStorage
   */
  public getStorage() {
    return this.config.storage;
  }

  public getUrl(){
    return this.config.apiUrl;
  }
}
