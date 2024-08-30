
export class AuthTokenManager {
  private token: string | null = null;
  private refreshToken: string | null = null; 
  private static atAppManager: AuthTokenManager = new AuthTokenManager(5000);
  private static atUserManager: AuthTokenManager = new AuthTokenManager(5000);
  public static defaultTokenExpiry: number = 3600 * 1000; // e.g., 1 hour ;
  private tokenExpiry: number  = AuthTokenManager.defaultTokenExpiry // e.g., 1 hour ;


  constructor(tokenExpiry: number) {
    this.tokenExpiry = tokenExpiry;
  }

  public getTokenExpiry() : number {
    return this.tokenExpiry;
  }

  public static getAppATManager(): AuthTokenManager {
    return this.atAppManager;
  }

  public static getUserATManager(): AuthTokenManager {
    return this.atUserManager;
  }

  public setToken(token: string) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  public setRefreshToken(token: string) {
    this.refreshToken = token;
  }

  public getRefreshToken(): string | null {
    return this.refreshToken;
  }

  public clearTokens() {
    this.token = null; 
    this.refreshToken = null; 
  }
}

