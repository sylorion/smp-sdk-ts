import { APIClient } from '../api/APIClient.js';
import type { Wallet as WalletEntity, CreateWalletInput, DepositInput, WithdrawInput, ConvertToTokensInput, ConvertTokensToMoneyInput, PayWithWalletInput, AddRevenueInput, BankWithdrawInput, TransferInput, SetPrimaryCurrencyInput, AdjustmentInput, ConversionDetailsInput, ConversionDetails, TransferResponse, StripeConnectStatus as StripeConnectStatusEntity, StripeOnboardingLink as StripeOnboardingLinkEntity, StripeAccountSession as StripeAccountSessionEntity } from '../types/Wallet.js';
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
    getByUserAndOrganization(userId: string, organizationId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves wallets by user ID only
     */
    getByUser(userId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves wallets by organization ID only
     */
    getByOrganization(organizationId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves personal wallets of a user (organizationId = null)
     */
    getUserWallets(userId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves organization wallets (organizationId is set)
     */
    getOrganizationWallets(organizationId: string): Promise<WalletEntity[]>;
    /**
     * Retrieves all wallets (admin only)
     */
    getAll(): Promise<WalletEntity[]>;
    /**
     * Gets conversion details for tokens to money conversion
     */
    getConversionDetails(data: ConversionDetailsInput): Promise<ConversionDetails>;
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
     * Retrieves Stripe Connect status for an organization
     */
    getStripeConnectStatus(organizationID: string, forceRefresh?: boolean): Promise<StripeConnectStatusEntity>;
    /**
     * Creates a Stripe Connect account for an organization
     */
    createStripeConnectAccount(organizationID: string): Promise<StripeConnectStatusEntity>;
    /**
     * Generates a Stripe onboarding link for an organization
     */
    generateStripeOnboardingLink(organizationID: string, returnUrl: string, refreshUrl: string): Promise<StripeOnboardingLinkEntity>;
    /**
     * Creates a Stripe account session for embedded components
     */
    createStripeAccountSession(organizationID: string): Promise<StripeAccountSessionEntity>;
}
