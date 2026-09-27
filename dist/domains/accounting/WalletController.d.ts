import { APIClient } from '../../api/APIClient.js';
import type { Wallet as WalletEntity, CreateWalletInput, DepositInput, WithdrawInput, ConvertToTokensInput, ConvertTokensToMoneyInput, PayWithWalletInput, AddRevenueInput, BankWithdrawInput, TransferInput, SetPrimaryCurrencyInput, AdjustmentInput, ConversionDetailsInput, ConversionDetails, TransferResponse, StripeConnectStatusEntity, TokenWalletRef, TokenUsageSummary, TokenUsageEntry, TokenCostEstimate, ConsumeTokensInput, ConsumeTokensResult, PayServiceWithTokensInput, PayServiceWithTokensResult } from '../../types/accounting/index.js';
/**
 * The `Wallet` class manages wallet-related operations within the application.
 * Provides methods to create, retrieve, and manage wallet operations like deposits, withdrawals, transfers, etc.
 */
export declare class Wallet {
    private client;
    constructor(client: APIClient);
    private assertIntegerMinorUnits;
    /**
     * Creates a new wallet
     */
    create(data: CreateWalletInput): Promise<WalletEntity>;
    /**
     * Deposits money into a wallet
     */
    deposit(data: DepositInput): Promise<WalletEntity>;
    /**
     * Withdraws money from a wallet
     */
    withdraw(data: WithdrawInput): Promise<WalletEntity>;
    /**
     * Converts money to tokens
     */
    convertToTokens(data: ConvertToTokensInput): Promise<WalletEntity>;
    /**
     * Converts tokens to money
     */
    convertTokensToMoney(data: ConvertTokensToMoneyInput): Promise<WalletEntity>;
    /**
     * Pays for a service using wallet funds
     */
    payWithWallet(data: PayWithWalletInput): Promise<WalletEntity>;
    /**
     * Adds revenue to a wallet
     */
    addRevenue(data: AddRevenueInput): Promise<WalletEntity>;
    /**
     * Withdraws money to a bank account
     */
    bankWithdraw(data: BankWithdrawInput): Promise<WalletEntity>;
    /**
     * Transfers money between wallets
     */
    transfer(data: TransferInput): Promise<TransferResponse>;
    /**
     * Sets the primary currency of a wallet
     */
    setPrimaryCurrency(data: SetPrimaryCurrencyInput): Promise<WalletEntity>;
    /**
     * Makes an adjustment to a wallet balance
     */
    adjustment(data: AdjustmentInput): Promise<WalletEntity>;
    /**
     * Retrieves a wallet by its ID
     */
    getById(walletId: string): Promise<WalletEntity>;
    /**
     * Retrieves wallets by user ID and organization ID
     */
    listByUserAndOrganization(userId: string, organizationId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves wallets by user ID only
     */
    listByUserId(userId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves wallets by organization ID only
     */
    listByOrganizationId(organizationId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves personal wallets of a user (organizationId = null)
     */
    listUserWallets(userId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves organization wallets (organizationId is set)
     */
    listOrganizationWallets(organizationId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves all wallets (admin only)
     */
    list(): Promise<WalletEntity[]>;
    /**
     * Gets conversion details for tokens to money conversion
     */
    getConversionDetails(data: ConversionDetailsInput): Promise<ConversionDetails>;
    /**
     * Retrieves the Stripe Connect status of an organization
     */
    getStripeConnectStatus(organizationID: string, forceRefresh?: boolean): Promise<StripeConnectStatusEntity>;
    /**
     * Retrieves ledger history for a wallet (includes transfers, withdrawals, deposits, fees, etc.)
     */
    getLedgerHistory(walletId: string, options?: {
        accountType?: string;
        limit?: number;
    }): Promise<any[]>;
    /**
     * Helper method to create a wallet with initial balances
     */
    createWithBalances(userId: string, mainCurrency: string, initialBalances?: Record<string, number>, initialTokens?: Record<string, number>, options?: {
        organizationId?: string;
        description?: string;
        metadata?: string;
    }): Promise<WalletEntity>;
    /**
     * Helper method to deposit with automatic token conversion
     */
    depositWithTokenConversion(walletId: string, amount: number, currency: string, convertToTokens?: boolean, options?: {
        paymentSessionId?: string;
        metadata?: string;
    }): Promise<WalletEntity>;
    /**
     * Helper method to pay for a service with tokens
     */
    payWithTokens(walletId: string, amount: number, currency: string, serviceId: string, serviceName: string, options?: {
        reference?: string;
        metadata?: string;
    }): Promise<WalletEntity>;
    /**
     * Helper method to transfer between wallets with metadata
     */
    transferBetweenWallets(sourceWalletId: string, destinationWalletId: string, amount: number, currency: string, metadata?: string): Promise<TransferResponse>;
    /**
     * Creates a Stripe Connect account for an organization
     */
    createStripeConnectAccount(organizationID: string): Promise<any>;
    /**
     * Generates a Stripe onboarding link
     */
    generateStripeOnboardingLink(params: {
        organizationID: string;
        returnUrl: string;
        refreshUrl: string;
    }): Promise<{
        url: string;
        expiresAt: string;
    }>;
    /**
     * Creates a Stripe account session (for embedded onboarding)
     */
    createStripeAccountSession(organizationID: string): Promise<{
        clientSecret: string;
    }>;
    private assertTokenPayer;
    /** Allocation du jour, soldes par type de jeton, consommation par agent, dernières consommations. */
    getTokenUsageSummary(ref: TokenWalletRef): Promise<TokenUsageSummary>;
    /** Historique des consommations / crédits de jetons (défaut 50, max 200). */
    getTokenUsageHistory(ref: TokenWalletRef, options?: {
        limit?: number;
        kinds?: string[];
    }): Promise<TokenUsageEntry[]>;
    /** Coût estimé d'un appel d'agent (forfait + part LLM), sans débit. */
    estimateTokenCost(agentKey: string, llm?: {
        inputTokens?: number;
        outputTokens?: number;
    }): Promise<TokenCostEstimate>;
    /**
     * Débite le coût d'un appel d'agent. Idempotent sur `idempotencyKey`.
     * Solde insuffisant → erreur GraphQL `TOKENS_INSUFFICIENT` (extensions.originalError : required, available).
     */
    consumeTokens(data: ConsumeTokensInput): Promise<ConsumeTokensResult>;
    /**
     * Paie un service dont le prix est en jetons : débit acheteur (prix + commission), crédit vendeur (revenus).
     * Idempotent sur `idempotencyKey` (ex. `order:<orderId>`) ; mu-wallet émet `payment.succeeded` (TOKENS).
     */
    payServiceWithTokens(data: PayServiceWithTokensInput): Promise<PayServiceWithTokensResult>;
}
