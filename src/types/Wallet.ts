export enum WalletStatus {
  ACTIVE = 'ACTIVE',
  LOCKED = 'LOCKED',
  SUSPICIOUS = 'SUSPICIOUS',
  INACTIVE = 'INACTIVE'
}

export interface Wallet {
  walletId: string;
  userId?: string; // Optionnel pour les wallets d'organisation
  organizationId?: string;
  balances: string; // JSON string
  tokens: string; // JSON string
  mainCurrency: string;
  version: number;
  isActive: number;
  isLocked: number;
  isSuspicious: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface CreateWalletInput {
  userId?: string; // Optionnel pour les wallets d'organisation
  organizationId?: string;
  mainCurrency: string;
  description?: string;
  balance?: number;
  initialBalances?: string; // JSON string
  initialTokens?: string; // JSON string
  metadata?: string;
}

export interface DepositInput {
  walletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  convertToTokens?: boolean;
  paymentSessionId?: string;
  metadata?: string;
}

export interface WithdrawInput {
  walletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  metadata?: string;
}

export interface ConvertToTokensInput {
  walletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  reason?: string;
}

export interface ConvertTokensToMoneyInput {
  walletId: string;
  tokenAmount: number;
  currency: string;
  reason?: string;
  tokenType?: string;
}

export interface PayWithWalletInput {
  walletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  serviceId: string;
  serviceName: string;
  useTokens?: boolean;
  reference?: string;
  metadata?: string;
}

export interface AddRevenueInput {
  walletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  serviceId: string;
  serviceName: string;
  clientId: string;
  reference?: string;
  platformFee?: string;
  metadata?: string;
}

export interface BankWithdrawInput {
  walletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  destinationIban: string;
  accountHolderName: string;
  reference?: string;
}

export interface TransferInput {
  sourceWalletId: string;
  destinationWalletId: string;
  /**
   * Monetary amount in minor units (e.g. cents for EUR/USD/GBP).
   * For XAF, this is the smallest currency unit (no decimals).
   */
  amount: number;
  currency: string;
  metadata?: string;
}

export interface SetPrimaryCurrencyInput {
  walletId: string;
  mainCurrency?: string;
  deletedAt?: string;
  metadata?: string;
}

export interface AdjustmentInput {
  walletId: string;
  adjustmentAmount: number;
  currency: string;
  metadata?: string;
}

export interface ConversionDetailsInput {
  tokenAmount: number;
  currency: string;
}

export interface ConversionDetails {
  tokenAmount: number;
  moneyAmount: number;
  fee: number;
  netAmount: number;
  feePercentage: number;
  currency: string;
  success: boolean;
  errorMessage?: string;
}

export interface TransferResponse {
  sourceWallet: Wallet;
  destinationWallet: Wallet;
}

// Response types for mutations
export interface CreateWalletResponse {
  createWallet: Wallet;
}

export interface DepositResponse {
  deposit: Wallet;
}

export interface WithdrawResponse {
  withdraw: Wallet;
}

export interface ConvertToTokensResponse {
  convertToTokens: Wallet;
}

export interface ConvertTokensToMoneyResponse {
  convertTokensToMoney: Wallet;
}

export interface PayWithWalletResponse {
  payWithWallet: Wallet;
}

export interface AddRevenueResponse {
  addRevenue: Wallet;
}

export interface BankWithdrawResponse {
  bankWithdraw: Wallet;
}

export interface TransferResponse {
  transfer: TransferResponse;
}

export interface SetPrimaryCurrencyResponse {
  setPrimaryCurrency: Wallet;
}

export interface AdjustmentResponse {
  adjustment: Wallet;
}

export interface GetConversionDetailsResponse {
  getConversionDetails: ConversionDetails;
}

// Response types for queries
export interface GetWalletResponse {
  wallet: Wallet;
}

export interface GetWalletsResponse {
  wallets: Wallet[];
}

export interface GetConversionDetailsResponse {
  getConversionDetails: ConversionDetails;
} 