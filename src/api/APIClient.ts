import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance, RawAxiosRequestHeaders } from 'axios';
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
  constructor(config: ConfigManager, gqUrl:string, restUrl: string) {
    this.config = config; 
    this.restClient = axios.create({
      baseURL: restUrl,
    }); 
    this.graphqlClient = new GraphQLClient(gqUrl);
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
      
      logger.info("CALL TO APIClient.QUERY Method");
      const response = await this.graphqlClient.request<T>(query, variables);
      logger.info(`ClientResponse:@@@@@@@@@@@-----%%%%%%%% ${JSON.stringify(response) }`);
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

  async post<T>(url: string = this.config.getConfig().apiUrl, data: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.restClient.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      ErrorHandler.handleError(error, "POST_ERROR");
      throw error;
    }
  }

  async get<T>(url: string = this.config.getConfig().apiUrl, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.restClient.get<T>(url, config);
      return response.data;
    } catch (error) {
      ErrorHandler.handleError(error, 'NETWORK_ERROR');
      throw error;
    }
  }

}