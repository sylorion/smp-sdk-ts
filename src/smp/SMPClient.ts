
import { APIClient } from "../api/APIClient.js"; 
import { AuthTokenManager } from "../auth/AuthTokenManager.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { logger } from '../utils/Logger.js';
import { i18n, SupportedLang } from '../i18n/index.js'; 
import { SMPConfig } from "../config/SMPConfig.js";
import { ConfigManager } from "../config/ConfigManager.js";
import { Persistence, PersistenceKind } from "../config/Persistence.js";

export class SMPClient {
  public httpApiClient: APIClient; 
  public authTokenManager: AuthTokenManager;
  // public notificationManager: AuthTokenManager;

  private configManager: ConfigManager;
  private config: SMPConfig;
  constructor(appId: string, appSecret: string, apiUrl:string, persistence: PersistenceKind = Persistence.MemoryKind, lang: SupportedLang = "en_US") {
    console.log("Build SMP Client............ ");
    this.config = ConfigManager.loadDefaultConfig();
    console.log("Received AppID............ ", appId);
    console.log("Received AppSecret............ ", appSecret);
    console.log("Received API URL............ ", apiUrl);
    this.config.appId = appId;

    console.log("AppID Affected............+++++++++++++++++ ");
    this.config.appSecret = appSecret;
    this.config.apiUrl = apiUrl;
    this.config.defaultLanguage = lang;
    this.config.persistence    = persistence;
    
    this.configManager    = new ConfigManager(this.config);
    console.log("End configuration Manager............ ", this.configManager);

    this.httpApiClient    = new APIClient(this.configManager, apiUrl, apiUrl);
    this.authTokenManager = new AuthTokenManager(this.configManager, this.httpApiClient);
    logger.info(i18n.t('smp_client_init'));
  }

  async authenticateApp(): Promise<void> {
    try {
      this.authTokenManager.authenticateApp(this.config.appId, this.config.appSecret);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async authenticateUser(username: string, password: string): Promise<void> {
    try {
      this.authTokenManager.authenticateUser(username, password);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  printState(){
    console.log("SMPClient State:");
    console.log("  AppId: ", this.config.appId);
    console.log("  AppSecret: ", this.config.appSecret);
    console.log("  AuthToken: ", this.authTokenManager);
    console.log("  Persistence: ", this.config.persistence);
    console.log("  Default Language: ", this.config.defaultLanguage);

  }
  
}

