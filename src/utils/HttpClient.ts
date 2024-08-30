
import axios, { AxiosResponse, AxiosRequestConfig, AxiosInstance, RawAxiosRequestHeaders } from 'axios';

import { ConfigManager } from "../config/ConfigManager.js";
import { AuthTokenManager } from "../auth/AuthTokenManager.js";
import { ErrorHandler } from "./ErrorHandler.js";
import { AppTokenResponse } from "../types/index.js";

export class HttpClient {
  private client: AxiosInstance;

  constructor(private graphqlUrl: string = ConfigManager.loadConfig().graphqlUrl) {
    this.client = axios.create({
      baseURL: graphqlUrl,
    });

    // this.client.interceptors.request.use((config) => {
    //   const userToken = AuthTokenManager.getAppATManager().getToken() ; 
    //   const appToken = AuthTokenManager.getAppATManager().getRefreshToken() ;
    //   if (appToken) {
    //     config.headers["XSmpAppAuth"] = `Token ${appToken}`;
    //   } else {
    //     console.log("You need to have a token application") ;
    //   }
    //   if (userToken) {
    //     config.headers["Authorization"] = `Bearer ${userToken}`;
    //   }
    //   return config;
    // });
  }

  async graphql<T>(query: string, variables?: any): Promise<T> {
    try {
      const response = await this.client.post<{ data: T; errors?: any[] }>(
        this.graphqlUrl,
        { query, variables }
      );
      if (response.data.errors) {
        throw new Error(response.data.errors.map((e) => e.message).join(", "));
      }
      return response.data.data;
    } catch (error) {
      ErrorHandler.handleError(error, "GRAPHQL_ERROR");
      throw error;
    }
  }

}

