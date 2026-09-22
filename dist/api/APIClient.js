import axios from 'axios';
import { GraphQLClient } from 'graphql-request';
import { ErrorHandler } from '../utils/ErrorHandler.js';
import { logger } from '../utils/Logger.js';
/**
 * Interface unifiée pour interagir avec les API REST et GraphQL.
 */
export class APIClient {
    constructor(config) {
        this.requestCount = 0;
        this.requestWindowStart = Date.now();
        this.dataSent = 0;
        this.dataReceived = 0;
        this.dataWindowStart = Date.now();
        this.config = config;
        this.restClient = axios.create({
            baseURL: config.apiUrl,
            httpsAgent: config.requestAgent,
        });
        const graphqlOptions = {};
        if (config.customFetch)
            graphqlOptions.fetch = config.customFetch;
        this.graphqlClient = new GraphQLClient(config.graphqlUrl, graphqlOptions);
    }
    /**
     * updateHeaderAppSecret
    */
    updateHeaderAppSecret(secret) {
        this.graphqlClient = this.graphqlClient.setHeader("x-services-app-token", `${secret}`);
        return this.graphqlClient;
    }
    updateHeaderAppID(secret) {
        this.graphqlClient = this.graphqlClient.setHeader("x-services-app-id", `${secret}`);
        return this.graphqlClient;
    }
    updateHeaderAppAccessToken(secret) {
        this.graphqlClient = this.graphqlClient.setHeader("x-services-app-access", `${secret}`);
        return this.graphqlClient;
    }
    resetHeaderAppSecret() {
        this.graphqlClient = this.graphqlClient.setHeader("x-services-app-token", "");
    }
    resetHeaderAppID() {
        this.graphqlClient = this.graphqlClient.setHeader("x-services-app-id", "");
    }
    resetHeaderAppAccessToken() {
        this.graphqlClient = this.graphqlClient.setHeader("x-services-app-access", "");
    }
    resetHeadersForApplication() {
        this.resetHeaderAppAccessToken();
        this.resetHeaderAppID();
        this.resetHeaderAppSecret();
    }
    /**
    * updateHeaderAppAuthN
    */
    updateHeaderUserAccessToken(accesToken) {
        this.graphqlClient = this.graphqlClient.setHeader("Authorization", `Bearer ${accesToken}`);
        return this.graphqlClient;
    }
    /**
     * Contexte du client final (BFF / server-side) : IP publique et User-Agent du navigateur d'origine,
     * transmis à la gateway (`x-forwarded-for`, `user-agent`) pour la détection de nouvel appareil
     * et les alertes de sécurité. Sans cela, un appel serveur est vu comme « réseau interne / navigateur inconnu ».
     */
    setEndUserContext(context) {
        if (context.ip)
            this.graphqlClient = this.graphqlClient.setHeader("x-forwarded-for", context.ip);
        if (context.userAgent)
            this.graphqlClient = this.graphqlClient.setHeader("user-agent", context.userAgent);
        return this.graphqlClient;
    }
    /**
     * Client dérivé portant des en-têtes supplémentaires SANS modifier l'instance partagée
     * (sûr pour des requêtes serveur concurrentes). Utilisé pour l'assertion d'identité
     * utilisateur signée (`x-smp-user-id` / `x-smp-user-signature`) ou un jeton utilisateur ponctuel.
     */
    withHeaders(headers) {
        const scoped = Object.create(APIClient.prototype);
        Object.assign(scoped, this);
        const graphqlOptions = { headers: { ...this.currentHeaders(), ...headers } };
        if (this.config.customFetch)
            graphqlOptions.fetch = this.config.customFetch;
        scoped.graphqlClient = new GraphQLClient(this.config.graphqlUrl, graphqlOptions);
        return scoped;
    }
    /** Assertion d'identité signée côté serveur (HMAC partagé avec les microservices). */
    withUserAssertion(userID, signature) {
        return this.withHeaders({ 'x-smp-user-id': userID, 'x-smp-user-signature': signature });
    }
    /** Jeton utilisateur ponctuel, sans toucher au client partagé. */
    withUserAccessToken(accessToken) {
        return this.withHeaders({ Authorization: `Bearer ${accessToken}` });
    }
    currentHeaders() {
        const raw = this.graphqlClient?.requestConfig?.headers;
        if (!raw)
            return {};
        if (typeof Headers !== 'undefined' && raw instanceof Headers) {
            const out = {};
            raw.forEach((v, k) => { out[k] = v; });
            return out;
        }
        return { ...raw };
    }
    resetHeadersForUser() {
        this.graphqlClient = this.graphqlClient.setHeader("Authorization", "");
    }
    async mutate(mutation, variables) {
        try {
            this.checkRateLimit();
            const body = JSON.stringify({ mutation, variables });
            this.trackDataSent(body.length);
            const response = await this.graphqlClient.request(mutation, variables);
            const respJson = JSON.stringify(response);
            this.trackDataReceived(respJson.length);
            return response;
        }
        catch (error) {
            logger.error("Erreur GraphQL", error);
            const ce = error;
            throw ce;
        }
    }
    async query(query, variables) {
        try {
            this.checkRateLimit(); // Check rate limit before making the request
            const body = JSON.stringify({ query, variables });
            this.trackDataSent(body.length);
            const response = await this.graphqlClient.request(query, variables);
            const respJson = JSON.stringify(response);
            this.trackDataReceived(respJson.length);
            return response;
        }
        catch (error) {
            // ErrorHandler.handleError(error, "GRAPHQL_ERROR");
            const ce = error;
            // if (ce.response) {
            //   console.log("Client Error Request ####################: ", Error(ce.response.errors?.map((e) => e.message).join(", ")));
            // } 
            throw ce;
        }
    }
    async post(url = this.config.apiUrl, data, config) {
        try {
            this.checkRateLimit(); // Check rate limit before making the request
            const body = JSON.stringify(data);
            this.trackDataSent(body.length);
            const response = await this.restClient.post(url, data, config);
            const respJson = JSON.stringify(response.data);
            // Le corps de la réponse n'est plus journalisé : il contenait tokens,
            // factures, devis et données personnelles, en clair dans la console du
            // navigateur de l'utilisateur final. Seule sa taille est conservée, qui est
            // ce dont `trackDataReceived` a besoin.
            logger.debug('POST', url, `${respJson.length} octets reçus`);
            this.trackDataReceived(respJson.length);
            return response.data;
        }
        catch (error) {
            ErrorHandler.handleError(error, "POST_ERROR");
            throw error;
        }
    }
    async get(url = this.config.apiUrl, config) {
        try {
            this.checkRateLimit(); // Check rate limit before making the request
            const response = await this.restClient.get(url, config);
            const respJson = JSON.stringify(response.data);
            // Idem : taille seulement, jamais le contenu.
            logger.debug('GET', url, `${respJson.length} octets reçus`);
            this.trackDataReceived(respJson.length);
            return response.data;
        }
        catch (error) {
            ErrorHandler.handleError(error, 'NETWORK_ERROR');
            throw error;
        }
    }
    // Méthode pour vérifier la limite de débit avant d'effectuer une requête
    checkRateLimit() {
        const now = Date.now();
        if (this.config.rateLimits && now - this.requestWindowStart > this.config.rateLimits.windowMs) {
            this.requestCount = 0;
            this.requestWindowStart = now;
        }
        if (this.config.rateLimits && this.requestCount >= this.config.rateLimits.maxRequests) {
            throw new Error(this.config.rateLimits.message || 'Rate limit exceeded');
        }
        this.requestCount += 1;
        return true;
    }
    // Méthode pour suivre la quantité de données envoyées
    trackDataSent(dataSize) {
        const now = Date.now();
        if (this.config.dataLimits && now - this.dataWindowStart > this.config.dataLimits.windowMs) {
            this.dataSent = 0;
            this.dataWindowStart = now;
        }
        if (this.config.dataLimits && this.dataSent + dataSize > this.config.dataLimits.maxDataSent) {
            this.dataSent += dataSize;
            throw new Error('Data sent limit exceeded');
        }
        this.dataSent += dataSize;
        return true;
    }
    // Méthode pour suivre la quantité de données reçues
    trackDataReceived(dataSize) {
        const now = Date.now();
        if (this.config.dataLimits && now - this.dataWindowStart > this.config.dataLimits.windowMs) {
            this.dataReceived = 0;
            this.dataWindowStart = now;
        }
        if (this.config.dataLimits && this.dataReceived + dataSize > this.config.dataLimits.maxDataReceived) {
            throw new Error('Data received limit exceeded');
        }
        this.dataReceived += dataSize;
        return true;
    }
}
