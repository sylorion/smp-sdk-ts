import axios, { AxiosRequestConfig, AxiosInstance } from 'axios';
import { GraphQLClient, ClientError } from 'graphql-request'; 
import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { logger } from '../utils/Logger.js';

/**
 * Interface unifiée pour interagir avec les API REST et GraphQL.
 */
export class APIClient {
  private restClient: AxiosInstance;
  private graphqlClient: GraphQLClient;
  private config: ConfigManager; 
  private requestCount: number = 0;
  private requestWindowStart: number = Date.now(); 
  private dataSent: number = 0;
  private dataReceived: number = 0;
  private dataWindowStart: number = Date.now();
  constructor(config: ConfigManager) {
    this.config = config; 
    this.restClient = axios.create({
      baseURL: config.apiUrl,
    }); 
    this.graphqlClient = new GraphQLClient(config.graphqlUrl);
  }

  /**
   * updateHeaderAppSecret  
  */
  public updateHeaderAppSecret(secret: string): GraphQLClient {
    this.graphqlClient = this.graphqlClient.setHeader("x-smp-app-token",  `Token ${secret}`);
    return this.graphqlClient;
  }

  public updateHeaderAppID(secret: string): GraphQLClient {
    this.graphqlClient = this.graphqlClient.setHeader("x-smp-app-id", `Token ${secret}`);
    return this.graphqlClient;
  }

  public updateHeaderAppAccessToken(secret: string): GraphQLClient {
    this.graphqlClient = this.graphqlClient.setHeader("x-smp-app-access", `Token ${secret}`);
    return this.graphqlClient;
  }

    public resetHeaderAppSecret(): void {
    this.graphqlClient = this.graphqlClient.setHeader("x-smp-app-token", "");
  }

  public resetHeaderAppID(): void {
    this.graphqlClient = this.graphqlClient.setHeader("x-smp-app-id", "");
  }

  public resetHeaderAppAccessToken(): void {
    this.graphqlClient = this.graphqlClient.setHeader("x-smp-app-access", "");
  }

  public resetHeadersForApplication(): void {
    this.resetHeaderAppAccessToken();
    this.resetHeaderAppID();
    this.resetHeaderAppSecret();
  }

  /**
  * updateHeaderAppAuthN
  */
  public updateHeaderUserAccessToken(accesToken: string): GraphQLClient {
    this.graphqlClient = this.graphqlClient.setHeader("Authorization", `Bearer ${accesToken}`);
    return this.graphqlClient;
  }


  public resetHeadersForUser(): void {
    this.graphqlClient = this.graphqlClient.setHeader("Authorization", "");
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    try {
      this.checkRateLimit(); // Check rate limit before making the request
      const body = JSON.stringify({ query, variables });
      this.trackDataSent(body.length);

      logger.info("CALL TO APIClient.QUERY Method");
      const response = await this.graphqlClient.request<T>(query, variables);
      const respJson = JSON.stringify(response);
      logger.info(`ClientResponse:@@@@@@@@@@@-----%%%%%%%% ${respJson}`);

      this.trackDataReceived(respJson.length);

      return response;
    } catch (error: any) {
      // ErrorHandler.handleError(error, "GRAPHQL_ERROR");
      const ce: ClientError = error;
      // if (ce.response) {
      //   console.log("Client Error Request ####################: ", Error(ce.response.errors?.map((e) => e.message).join(", ")));
      // } 
      throw ce;
    }
  }

  async post<T>(url: string = this.config.apiUrl, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      this.checkRateLimit(); // Check rate limit before making the request
      const body = JSON.stringify(data);
      this.trackDataSent(body.length);
      const response = await this.restClient.post<T>(url, data, config);
      const respJson = JSON.stringify(response.data);
      logger.info(`ClientResponse:@@@@@@@@@@@-----%%%%%%%% ${respJson}`);
      this.trackDataReceived(respJson.length);
      return response.data;
    } catch (error) {
      ErrorHandler.handleError(error, "POST_ERROR");
      throw error;
    }
  }

  async get<T>(url: string = this.config.apiUrl, config?: AxiosRequestConfig): Promise<T> {
    try {
      this.checkRateLimit(); // Check rate limit before making the request
      const response = await this.restClient.get<T>(url, config);
      const respJson = JSON.stringify(response.data);
      logger.info(`ClientResponse:@@@@@@@@@@@-----%%%%%%%% ${respJson}`);
      this.trackDataReceived(respJson.length);
      return response.data;
    } catch (error) {
      ErrorHandler.handleError(error, 'NETWORK_ERROR');
      throw error;
    }
  }

  // Méthode pour vérifier la limite de débit avant d'effectuer une requête
  public checkRateLimit(): boolean {
    const now = Date.now();
    if (this.config.rateLimits && now - this.requestWindowStart > this.config.rateLimits!.windowMs) {
      this.requestCount = 0;
      this.requestWindowStart = now;
    }

    if (this.config.rateLimits && this.requestCount >= this.config.rateLimits!.maxRequests) {
      throw new Error(this.config.rateLimits!.message || 'Rate limit exceeded');
    }

    this.requestCount += 1;
    return true;
  }

  // Méthode pour suivre la quantité de données envoyées
  public trackDataSent(dataSize: number): boolean {
    const now = Date.now();

    if (this.config.dataLimits && now - this.dataWindowStart > this.config.dataLimits!.windowMs) {
      this.dataSent = 0;
      this.dataWindowStart = now;
    }

    if (this.config.dataLimits && this.dataSent + dataSize > this.config.dataLimits!.maxDataSent) {
      this.dataSent += dataSize;
      throw new Error('Data sent limit exceeded');
    }

    this.dataSent += dataSize;
    return true;
  }

  // Méthode pour suivre la quantité de données reçues
  public trackDataReceived(dataSize: number): boolean {
    const now = Date.now();

    if (this.config.dataLimits && now - this.dataWindowStart > this.config.dataLimits!.windowMs) {
      this.dataReceived = 0;
      this.dataWindowStart = now;
    }

    if (this.config.dataLimits && this.dataReceived + dataSize > this.config.dataLimits!.maxDataReceived) {
      throw new Error('Data received limit exceeded');
    }

    this.dataReceived += dataSize;
    return true;
  }

}