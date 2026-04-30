// Wallet types for the accounting domain

export interface Wallet {
  walletId: string;
  userId: string;
  organizationId?: string;
  mainCurrency: string;
  balances: Record<string, number>;
  tokens: Record<string, number>;
  description?: string;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateWalletInput {
  userId: string;
  mainCurrency: string;
  organizationId?: string;
  description?: string;
  initialBalances?: string;
  initialTokens?: string;
  metadata?: string;
}

export interface DepositInput {
  walletId: string;
  amount: number;
  currency: string;
  convertToTokens?: boolean;
  paymentSessionId?: string;
  metadata?: string;
}

export interface WithdrawInput {
  walletId: string;
  amount: number;
  currency: string;
  metadata?: string;
}

export interface ConvertToTokensInput {
  walletId: string;
  amount: number;
  currency: string;
}

export interface ConvertTokensToMoneyInput {
  walletId: string;
  tokenAmount: number;
  currency: string;
}

export interface PayWithWalletInput {
  walletId: string;
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
  amount: number;
  currency: string;
  metadata?: string;
}

export interface BankWithdrawInput {
  walletId: string;
  amount: number;
  currency: string;
  reference?: string;
}

export interface TransferInput {
  sourceWalletId: string;
  destinationWalletId: string;
  amount: number;
  currency: string;
  metadata?: string;
}

export interface SetPrimaryCurrencyInput {
  walletId: string;
  currency: string;
}

export interface AdjustmentInput {
  walletId: string;
  amount: number;
  currency: string;
  reason: string;
}

export interface ConversionDetailsInput {
  amount: number;
  currency: string;
}

export interface ConversionDetails {
  tokenAmount: number;
  rate: number;
  fee: number;
}

export interface TransferResponse {
  transfer?: Wallet;
  sourceWallet?: Wallet;
  destinationWallet?: Wallet;
}

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

export interface SetPrimaryCurrencyResponse {
  setPrimaryCurrency: Wallet;
}

export interface AdjustmentResponse {
  adjustment: Wallet;
}

export interface GetConversionDetailsResponse {
  getConversionDetails: ConversionDetails;
}

export interface GetWalletResponse {
  wallet: Wallet;
}

export interface GetWalletsResponse {
  wallets: Wallet[];
}

export interface StripeConnectStatusEntity {
  stripeAccountId: string;
  onboardingCompleted: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
  requirements: any;
  connectedAt: string;
  lastStatusCheck: string;
  blockingRequirements: string[];
  eventuallyRequirements: string[];
  disabledReason: string | null;
}

export interface GetStripeConnectStatusResponse {
  stripeConnectStatus: StripeConnectStatusEntity;
}
