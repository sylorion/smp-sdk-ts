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
export type TokenUsageKind = 'agent_call' | 'service_payment' | 'service_revenue' | 'daily_allowance' | 'purchase' | 'refund' | 'adjustment';
export interface TokenUsageEntry {
    tokenUsageId: string;
    walletId: string;
    kind: TokenUsageKind | string;
    agentKey?: string | null;
    action?: string | null;
    /** Signé : négatif = débit, positif = crédit. */
    amount: number;
    baseCost: number;
    llmCost: number;
    llmInputTokens: number;
    llmOutputTokens: number;
    llmModel?: string | null;
    referenceType?: string | null;
    referenceId?: string | null;
    createdAt: string;
    /** JSON stringifié. */
    metadata?: string | null;
}
export interface TokenUsageByAgent {
    agentKey: string;
    calls: number;
    tokens: number;
    llmInputTokens: number;
    llmOutputTokens: number;
}
export interface TokenUsageSummary {
    walletId?: string | null;
    userId?: string | null;
    organizationId?: string | null;
    dailyAllowance: number;
    dailyRemaining: number;
    dailyUsedToday: number;
    tokensDaily: number;
    tokensFree: number;
    tokensPaid: number;
    tokensRevenue: number;
    totalAvailable: number;
    consumedToday: number;
    consumedLast30Days: number;
    nextDailyRefreshAt: string;
    byAgentToday: TokenUsageByAgent[];
    byAgentLast30Days: TokenUsageByAgent[];
    recent: TokenUsageEntry[];
}
/** Payeur : wallet explicite, sinon wallet d'organisation, sinon wallet personnel. */
export interface TokenWalletRef {
    walletId?: string;
    userId?: string;
    organizationId?: string;
}
export interface ConsumeTokensInput extends TokenWalletRef {
    /** Utilisateur à l'origine de l'appel (journalisé même si l'organisation paie). */
    actorUserId?: string;
    /** form | form_assistant | pm | pm_message | contract | generative | service_agent … */
    agentKey: string;
    action?: string;
    /** Forfait explicite (sinon barème mu-wallet par agent). */
    baseCost?: number;
    llmInputTokens?: number;
    llmOutputTokens?: number;
    llmModel?: string;
    /** Unique par appel : un rejeu ne débite pas deux fois. */
    idempotencyKey: string;
    referenceType?: string;
    referenceId?: string;
    /** JSON stringifié. */
    metadata?: string;
}
export interface ConsumeTokensResult {
    tokenUsageId: string;
    walletId: string;
    cost: number;
    baseCost: number;
    llmCost: number;
    alreadyRecorded: boolean;
    totalAvailable: number;
    dailyRemaining: number;
}
export interface PayServiceWithTokensInput extends TokenWalletRef {
    actorUserId?: string;
    sellerOrganizationId: string;
    /** Prix du service en jetons, hors commission (8 % arrondis au supérieur, ajoutés à l'acheteur). */
    tokenPrice: number;
    serviceId: string;
    serviceName?: string;
    orderId?: string;
    transactionId?: string;
    /** Ex. `order:<orderId>` — un rejeu renvoie `alreadyPaid: true`. */
    idempotencyKey: string;
    metadata?: string;
}
export interface PayServiceWithTokensResult {
    tokenUsageId: string;
    buyerWalletId: string;
    sellerWalletId: string;
    tokenPrice: number;
    commission: number;
    total: number;
    alreadyPaid: boolean;
}
export interface TokenCostEstimate {
    agentKey: string;
    baseCost: number;
    llmCost: number;
    total: number;
    llmTokensPerPlatformToken: number;
}
export interface TokenUsageSummaryResponse {
    tokenUsageSummary: TokenUsageSummary;
}
export interface TokenUsageHistoryResponse {
    tokenUsageHistory: TokenUsageEntry[];
}
export interface TokenCostEstimateResponse {
    tokenCostEstimate: TokenCostEstimate;
}
export interface ConsumeTokensResponse {
    consumeTokens: ConsumeTokensResult;
}
export interface PayServiceWithTokensResponse {
    payServiceWithTokens: PayServiceWithTokensResult;
}
