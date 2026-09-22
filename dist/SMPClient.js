import { APIClient } from './api/APIClient.js';
import { AuthTokenManager } from './auth/AuthTokenManager.js';
import { ErrorHandler } from './utils/ErrorHandler.js';
import { logger } from './utils/Logger.js';
import { i18n } from './i18n/index.js';
import { ConfigManager } from './config/ConfigManager.js';
import { AuthDomain, CatalogDomain, AccountingDomain, OrganizationDomain, UserDomain, BookingDomain, CommunicationDomain, ReviewDomain } from './domains/index.js';
export class SMPClient {
    constructor(options) {
        this.configManager = new ConfigManager(options);
        this.httpApiClient = new APIClient(this.configManager);
        // Initialisation des Domaines
        this.auth = new AuthDomain(this.httpApiClient);
        this.catalog = new CatalogDomain(this.httpApiClient);
        this.accounting = new AccountingDomain(this.httpApiClient);
        this.organization = new OrganizationDomain(this.httpApiClient);
        this.user = new UserDomain(this.httpApiClient);
        this.booking = new BookingDomain(this.httpApiClient);
        this.communication = new CommunicationDomain(this.httpApiClient);
        this.review = new ReviewDomain(this.httpApiClient);
        this.authTokenManager = new AuthTokenManager(this.configManager, this.httpApiClient);
        this.httpApiClient.updateHeaderAppID(this.configManager.appId);
        this.httpApiClient.updateHeaderAppSecret(this.configManager.appSecret);
        this.httpApiClient.updateHeaderAppAccessToken("");
        if (this.configManager.wsEnabled) {
            this.initWebSocket();
        }
        logger.info(i18n.t('smp_client_init'));
    }
    async authenticateApp() {
        try {
            const access = await this.getAppAccessToken();
            if (access) {
                return;
            }
            const app = await this.authTokenManager.authenticateApp(this.configManager.appId, this.configManager.appSecret);
        }
        catch (error) {
            ErrorHandler.handleError(error, "APP_AUTH_FAILED");
        }
    }
    /** Propage l'IP et le User-Agent de l'utilisateur final (appels effectués côté serveur pour son compte). */
    setEndUserContext(context) {
        this.httpApiClient.setEndUserContext(context);
        return this;
    }
    async authenticateUser(username, password) {
        try {
            const access = await this.getUserAccessToken();
            if (access) {
                logger.info("User already authenticated");
                return this.loggedUser;
            }
            const login = await this.authTokenManager.authenticateUser(username, password);
            logger.info("Login succeed");
            if (login) {
                this.loggedUser = login;
                this.configManager.loggedUser = login.user;
            }
        }
        catch (error) {
            ErrorHandler.handleError(error, "USER_AUTH_FAILED");
        }
        return this.loggedUser;
    }
    async getAppAccessToken() {
        try {
            return await this.authTokenManager.getAppAccessToken();
        }
        catch (error) {
            return "";
        }
    }
    async getUserAccessToken() {
        try {
            return await this.authTokenManager.getUserAccessToken();
        }
        catch (error) {
            return null;
        }
    }
    async getAppRefreshToken() {
        try {
            return await this.authTokenManager.getAppRefreshToken();
        }
        catch (error) {
            ErrorHandler.handleError(error, "APP_RETRIEVED_REFRESH_TOKEN_FAILED");
        }
    }
    async getUserRefreshToken() {
        try {
            return await this.authTokenManager.getUserRefreshToken();
        }
        catch (error) {
            ErrorHandler.handleError(error, "USER_RETRIEVED_REFRESH_TOKEN_FAILED");
        }
    }
    async logoutApp() {
        try {
            if (!this.loggedApp?.app?.applicationID) {
                throw new Error("Application ID non trouvé dans les données récupérées !");
            }
            return await this.authTokenManager.logoutApp(this.loggedApp.app.applicationID);
        }
        catch (error) {
            ErrorHandler.handleError(error, "USER_RETRIEVED_REFRESH_TOKEN_FAILED");
        }
    }
    async logoutUser() {
        try {
            const refreshToken = await this.getUserRefreshToken();
            const userId = this.loggedUser?.user?.userID || this.configManager.loggedUser?.userID;
            if (!userId) {
                logger.warn("No user ID found in loggedUser data, clearing local tokens only");
                this.authTokenManager['userTokenStorage'].clearTokens();
                this.loggedUser = undefined;
                return;
            }
            if (!refreshToken) {
                throw new Error("No refresh token found !");
            }
            await this.authTokenManager.logoutUser(userId, refreshToken);
            this.loggedUser = undefined;
            logger.info("Déconnexion réussie");
        }
        catch (error) {
            ErrorHandler.handleError(error, "USER_LOGOUT_FAILED");
            throw error;
        }
    }
    // Méthode pour initier une connexion WebSocket pour les notifications
    initWebSocket() {
        this.wsClient = new WebSocket(`wss://${this.configManager.apiUrl}/subscriptions`);
        this.wsClient.onopen = () => {
            logger.debug('WebSocket connecté.');
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
            // Le contenu de la notification n'est pas journalisé : il peut porter des
            // données métier. Seule sa taille l'est, en mode débogage.
            logger.debug('Notification reçue', `${String(event.data).length} octets`);
        };
        this.wsClient.onerror = (error) => {
            logger.error('Erreur WebSocket', error);
        };
        this.wsClient.onclose = () => {
            logger.debug('WebSocket fermé.');
        };
    }
    updateHeaderUserAccessToken(accesToken) {
        return this.httpApiClient.updateHeaderUserAccessToken(accesToken);
    }
    resetHeadersForUser() {
        this.httpApiClient.resetHeadersForUser();
    }
    async query(query, variables) {
        return await this.httpApiClient.query(query, variables);
    }
    async post(url = this.configManager.apiUrl, data, config) {
        return await this.httpApiClient.post(url, data, config);
    }
    async get(url = this.configManager.apiUrl, config) {
        return await this.httpApiClient.get(url, config);
    }
    // Méthode pour vérifier la limite de débit avant d'effectuer une requête
    checkRateLimit() {
        return this.httpApiClient.checkRateLimit();
    }
    // Méthode pour suivre la quantité de données envoyées
    trackDataSent(dataSize) {
        return this.httpApiClient.trackDataSent(dataSize);
    }
    // Méthode pour suivre la quantité de données reçues
    trackDataReceived(dataSize) {
        return this.httpApiClient.trackDataReceived(dataSize);
    }
    /**
     * État du client, à des fins de débogage.
     *
     * Ne divulgue plus `appSecret` ni le gestionnaire de tokens : cette méthode
     * les imprimait en clair dans la console du navigateur. Passe par le logger,
     * donc silencieuse en production.
     */
    printState() {
        logger.debug('SMPClient', {
            appId: this.configManager.appId,
            appSecretDefini: Boolean(this.configManager.appSecret),
            sessionUtilisateur: Boolean(this.authTokenManager?.getUserRefreshToken()),
            persistence: this.configManager.persistence,
            defaultLanguage: this.configManager.defaultLanguage,
        });
    }
    clean() {
    }
}
