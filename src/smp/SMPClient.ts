
import { APIClient } from "../api/APIClient.js"; 
import { AuthTokenManager } from "../auth/AuthTokenManager.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { logger } from '../utils/Logger.js';
import { i18n, SupportedLang } from '../i18n/index.js'; 
import { SMPClientOptions, SMPConfig } from "../config/SMPConfig.js";
import { ConfigManager } from "../config/ConfigManager.js";
import { Persistence, PersistenceKind } from "../config/Persistence.js";

export class SMPClient {
  public httpApiClient: APIClient; 
  public authTokenManager: AuthTokenManager;
  // public notificationManager: AuthTokenManager;
  private wsClient?: WebSocket;
  private configManager: ConfigManager; 

  constructor(options: SMPClientOptions) {

    this.configManager = new ConfigManager(options)

    this.httpApiClient    = new APIClient(this.configManager);
    this.authTokenManager = new AuthTokenManager(this.configManager, this.httpApiClient);

    if (this.configManager.wsEnabled) {
      this.initWebSocket();
    }

    logger.info(i18n.t('smp_client_init'));
  }

  async authenticateApp(): Promise<void> {
    try {
      this.authTokenManager.authenticateApp(this.configManager.appId, this.configManager.appSecret);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }

  async authenticateUser(username: string, password: string): Promise<void> {
    try {
      await this.authTokenManager.authenticateUser(username, password);
    } catch (error) {
      ErrorHandler.handleError(error, "APP_AUTH_FAILED");
    }
  }


  // Méthode pour initier une connexion WebSocket pour les notifications
  private initWebSocket() {
    this.wsClient = new WebSocket(`wss://${this.configManager.apiUrl}/subscriptions`);
    
    this.wsClient.onopen = () => {
      console.log('WebSocket connection established.');
      this.wsClient?.send(JSON.stringify({
        query: `
          subscription {
            notificationReceived {
              message
              timestamp
            }
          }
        `
      }));
    };

    this.wsClient.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.httpApiClient.trackDataReceived(event.data.length);
      console.log('Notification received:', data);
    };

    this.wsClient.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.wsClient.onclose = () => {
      console.log('WebSocket connection closed.');
    };
  }

  printState(){
    console.log("SMPClient State:");
    console.log("  AppId: ", this.configManager.appId);
    console.log("  AppSecret: ", this.configManager.appSecret);
    console.log("  AuthToken: ", this.authTokenManager);
    console.log("  Persistence: ", this.configManager.persistence);
    console.log("  Default Language: ", this.configManager.defaultLanguage);

  }
  
}

