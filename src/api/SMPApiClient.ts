import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import { GraphQLClient, Variables, ClientError } from 'graphql-request';
import { AuthTokenManager } from '../auth/AuthTokenManager.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorHandler } from "../utils/ErrorHandler.js";

/**
 * Interface unifiée pour interagir avec les API REST et GraphQL.
 */
export class SMPAPIClient {
  private restClient: AxiosInstance;
  private graphqlClient: GraphQLClient; 
  private config: ConfigManager ;
  private userATM: AuthTokenManager ;
  private appATM: AuthTokenManager ;

  constructor(private apiUrl: string = ConfigManager.loadConfig().apiUrl, gqlUrl: string = ConfigManager.loadConfig().graphqlUrl) {
    this.config = new ConfigManager(apiUrl, gqlUrl, 'en');
    this.userATM = AuthTokenManager.getUserATManager();
    this.appATM = AuthTokenManager.getAppATManager(); 
    this.restClient = axios.create({
      baseURL: ConfigManager.loadConfig().apiUrl,
    });
    this.userATM = AuthTokenManager.getUserATManager();
    this.appATM = AuthTokenManager.getAppATManager();
    this.graphqlClient = new GraphQLClient(ConfigManager.loadConfig().graphqlUrl, {
      headers: {
        Authorization: `Bearer ${this.userATM.getToken()}`,
        XsmpAppAuth: `Token ${this.appATM.getToken()}`
      },
    });
  }

  async query<T>(query: string, variables?: any): Promise<T> {
    try { 
      const response = await this.graphqlClient.request<T>(query, variables); 
      return response;
    } catch (error: any) { 
      // ErrorHandler.handleError(error, "GRAPHQL_ERROR");
      const ce: ClientError = error;
      if(ce.response){
        console.log("Client Error Request ####################: ", Error(ce.response.errors?.map((e) => e.message).join(", ")));
      }  
      console.log("Client Error Message:@@@@@@@@@@@-----%%%%%%%% ", ce.message);
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
