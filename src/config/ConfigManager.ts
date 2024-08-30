export type SMPConfig = {
  apiUrl: string;
  graphqlUrl: string;
  defaultLanguage: string;
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
      apiUrl: 'https://api.example.com',
      graphqlUrl: 'https://dev-gateway.sh1.hidora.net/graphql',
      defaultLanguage: 'en',
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

  constructor(url: string, gqlUrl: string, lang: string) {
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
