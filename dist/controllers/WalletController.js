import { walletQueries } from '../api/graphql/queries/wallet/walletQueries.js';
import { walletMutations } from '../api/graphql/mutations/wallet/walletMutations.js';
/**
 * The `Wallet` class manages wallet-related operations within the application.
 * Provides methods to create, retrieve, and manage wallet operations like deposits, withdrawals, transfers, etc.
 */
export class Wallet {
    constructor(client) {
        this.client = client;
    }
    assertIntegerMinorUnits(params) {
        const { amount, currency, operation } = params;
        if (Number.isInteger(amount))
            return;
        throw new Error(`[Wallet.${operation}] amount must be an integer in minor units (cents). Received ${amount} (${currency})`);
    }
    /**
     * Creates a new wallet
     */
    async create(data) {
        const query = walletMutations.CREATE_WALLET;
        const response = await this.client.mutate(query, { data });
        return response.createWallet;
    }
    /**
     * Deposits money into a wallet
     */
    async deposit(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'deposit' });
        const query = walletMutations.DEPOSIT;
        const response = await this.client.mutate(query, { data });
        return response.deposit;
    }
    /**
     * Withdraws money from a wallet
     */
    async withdraw(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'withdraw' });
        const query = walletMutations.WITHDRAW;
        const response = await this.client.mutate(query, { data });
        return response.withdraw;
    }
    /**
     * Converts money to tokens
     */
    async convertToTokens(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'convertToTokens' });
        const query = walletMutations.CONVERT_TO_TOKENS;
        const response = await this.client.mutate(query, { data });
        return response.convertToTokens;
    }
    /**
     * Converts tokens to money
     */
    async convertTokensToMoney(data) {
        const query = walletMutations.CONVERT_TOKENS_TO_MONEY;
        const response = await this.client.mutate(query, { data });
        return response.convertTokensToMoney;
    }
    /**
     * Pays for a service using wallet funds
     */
    async payWithWallet(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'payWithWallet' });
        const query = walletMutations.PAY_WITH_WALLET;
        const response = await this.client.mutate(query, { data });
        return response.payWithWallet;
    }
    /**
     * Adds revenue to a wallet
     */
    async addRevenue(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'addRevenue' });
        const query = walletMutations.ADD_REVENUE;
        const response = await this.client.mutate(query, { data });
        return response.addRevenue;
    }
    /**
     * Withdraws money to a bank account
     */
    async bankWithdraw(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'bankWithdraw' });
        const query = walletMutations.BANK_WITHDRAW;
        const response = await this.client.mutate(query, { data });
        return response.bankWithdraw;
    }
    /**
     * Transfers money between wallets
     */
    async transfer(data) {
        this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'transfer' });
        const query = walletMutations.TRANSFER;
        const response = await this.client.mutate(query, { data });
        return response.transfer;
    }
    /**
     * Sets the primary currency of a wallet
     */
    async setPrimaryCurrency(data) {
        const query = walletMutations.SET_PRIMARY_CURRENCY;
        const response = await this.client.mutate(query, { data });
        return response.setPrimaryCurrency;
    }
    /**
     * Makes an adjustment to a wallet balance
     */
    async adjustment(data) {
        const query = walletMutations.ADJUSTMENT;
        const response = await this.client.mutate(query, { data });
        return response.adjustment;
    }
    /**
     * Retrieves a wallet by its ID
     */
    async getById(walletId) {
        const query = walletQueries.GET_WALLET_BY_ID;
        const response = await this.client.query(query, { id: walletId });
        return response.wallet;
    }
    /**
     * Retrieves wallets by user ID and organization ID
     */
    async getByUserAndOrganization(userId, organizationId) {
        const query = walletQueries.GET_WALLETS;
        const response = await this.client.query(query, { userId, organizationId });
        return response.wallets;
    }
    /**
     * Retrieves wallets by user ID only
     */
    async getByUser(userId) {
        const query = walletQueries.GET_WALLETS_BY_USER;
        const response = await this.client.query(query, { userId });
        return response.wallets;
    }
    /**
     * Retrieves wallets by organization ID only
     */
    async getByOrganization(organizationId) {
        const query = walletQueries.GET_WALLETS_BY_ORGANIZATION;
        const response = await this.client.query(query, { organizationId });
        return response.wallets;
    }
    /**
     * Retrieves personal wallets of a user (organizationId = null)
     */
    async getUserWallets(userId) {
        const query = walletQueries.GET_USER_WALLETS;
        const response = await this.client.query(query, { userId });
        return response.userWallets || [];
    }
    /**
     * Retrieves organization wallets (organizationId is set)
     */
    async getOrganizationWallets(organizationId) {
        const query = walletQueries.GET_ORGANIZATION_WALLETS;
        const response = await this.client.query(query, { organizationId });
        return response.organizationWallets || [];
    }
    /**
     * Retrieves all wallets (admin only)
     */
    async getAll() {
        const query = walletQueries.GET_ALL_WALLETS;
        const response = await this.client.query(query, {});
        return response.allWallets || [];
    }
    /**
     * Gets conversion details for tokens to money conversion
     */
    async getConversionDetails(data) {
        const query = walletQueries.GET_CONVERSION_DETAILS;
        const response = await this.client.query(query, { data });
        return response.getConversionDetails;
    }
    /**
     * Helper method to create a wallet with initial balances
     */
    async createWithBalances(userId, mainCurrency, initialBalances = {}, initialTokens = {}, options) {
        const data = {
            userId,
            mainCurrency,
            organizationId: options?.organizationId,
            description: options?.description,
            initialBalances: Object.keys(initialBalances).length > 0 ? JSON.stringify(initialBalances) : undefined,
            initialTokens: Object.keys(initialTokens).length > 0 ? JSON.stringify(initialTokens) : undefined,
            metadata: options?.metadata
        };
        return this.create(data);
    }
    /**
     * Helper method to deposit with automatic token conversion
     */
    async depositWithTokenConversion(walletId, amount, currency, convertToTokens = false, options) {
        this.assertIntegerMinorUnits({ amount, currency, operation: 'depositWithTokenConversion' });
        const data = {
            walletId,
            amount,
            currency,
            convertToTokens,
            paymentSessionId: options?.paymentSessionId,
            metadata: options?.metadata
        };
        return this.deposit(data);
    }
    /**
     * Helper method to pay for a service with tokens
     */
    async payWithTokens(walletId, amount, currency, serviceId, serviceName, options) {
        const data = {
            walletId,
            amount,
            currency,
            serviceId,
            serviceName,
            useTokens: true,
            reference: options?.reference,
            metadata: options?.metadata
        };
        return this.payWithWallet(data);
    }
    /**
     * Helper method to transfer between wallets with metadata
     */
    async transferBetweenWallets(sourceWalletId, destinationWalletId, amount, currency, metadata) {
        const data = {
            sourceWalletId,
            destinationWalletId,
            amount,
            currency,
            metadata
        };
        return this.transfer(data);
    }
    /**
     * Retrieves Stripe Connect status for an organization
     */
    async getStripeConnectStatus(organizationID, forceRefresh) {
        const query = walletQueries.GET_STRIPE_CONNECT_STATUS;
        const response = await this.client.query(query, { organizationID, forceRefresh });
        return response.stripeConnectStatus;
    }
    /**
     * Creates a Stripe Connect account for an organization
     */
    async createStripeConnectAccount(organizationID) {
        const query = walletMutations.CREATE_STRIPE_CONNECT_ACCOUNT;
        const response = await this.client.mutate(query, { organizationID });
        return response.createStripeConnectAccount;
    }
    /**
     * Generates a Stripe onboarding link for an organization
     */
    async generateStripeOnboardingLink(organizationID, returnUrl, refreshUrl) {
        const query = walletMutations.GENERATE_STRIPE_ONBOARDING_LINK;
        const response = await this.client.mutate(query, {
            organizationID,
            returnUrl,
            refreshUrl
        });
        return response.generateStripeOnboardingLink;
    }
    /**
     * Creates a Stripe account session for embedded components
     */
    async createStripeAccountSession(organizationID) {
        const query = walletMutations.CREATE_STRIPE_ACCOUNT_SESSION;
        const response = await this.client.mutate(query, { organizationID });
        return response.createStripeAccountSession;
    }
}
