import { SupportedLang, defaultLanguage } from '../i18n/languages.js';

export type SMPConfig = {
  apiUrl: string;
  graphqlUrl: string;
  defaultLanguage: SupportedLang;
};

/**
 * Gère la configuration de la SDK.
 */
export class ConfigManager {
  static defaultConfig: SMPConfig; 
  private config: SMPConfig; 

  /**
   * Charge la configuration avec des valeurs par défaut ou personnalisées.
   * @param customConfig - Configuration personnalisée.
   */
  static loadConfig(customConfig?: Partial<SMPConfig>): SMPConfig {
    const defaultConfig: SMPConfig = {
      apiUrl: 'https://api.smp.cm',
      graphqlUrl: 'https://api.smp.cm/graphql',
      defaultLanguage: defaultLanguage,
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

  constructor(url: string = ConfigManager.defaultConfig.apiUrl, 
    gqlUrl: string = ConfigManager.defaultConfig.graphqlUrl, 
    lang: SupportedLang = ConfigManager.defaultConfig.defaultLanguage) {
    this.config = {
      apiUrl: url,
      graphqlUrl: gqlUrl,
      defaultLanguage: lang,
    };
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
    return this.config;
  }

}
