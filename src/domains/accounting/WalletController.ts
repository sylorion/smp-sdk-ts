import { APIClient } from '../../api/APIClient.js';
import { walletQueries } from '../../api/graphql/accounting/queries.js';
import { walletMutations } from '../../api/graphql/accounting/mutations.js';
import type {
  Wallet as WalletEntity,
  CreateWalletInput,
  DepositInput,
  WithdrawInput,
  ConvertToTokensInput,
  ConvertTokensToMoneyInput,
  PayWithWalletInput,
  AddRevenueInput,
  BankWithdrawInput,
  TransferInput,
  SetPrimaryCurrencyInput,
  AdjustmentInput,
  ConversionDetailsInput,
  ConversionDetails,
  TransferResponse,
  CreateWalletResponse,
  DepositResponse,
  WithdrawResponse,
  ConvertToTokensResponse,
  ConvertTokensToMoneyResponse,
  PayWithWalletResponse,
  AddRevenueResponse,
  BankWithdrawResponse,
  TransferResponse as TransferMutationResponse,
  SetPrimaryCurrencyResponse,
  AdjustmentResponse,
  GetConversionDetailsResponse,
  GetWalletResponse,
  GetWalletsResponse,
  StripeConnectStatusEntity,
  GetStripeConnectStatusResponse
} from '../../types/accounting/index.js';


/**
 * The `Wallet` class manages wallet-related operations within the application.
 * Provides methods to create, retrieve, and manage wallet operations like deposits, withdrawals, transfers, etc.
 */
export class Wallet {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  private assertIntegerMinorUnits(params: { amount: number; currency: string; operation: string }) {
    const { amount, currency, operation } = params
    if (Number.isInteger(amount)) return
    throw new Error(
      `[Wallet.${operation}] amount must be an integer in minor units (cents). Received ${amount} (${currency})`
    )
  }

  /**
   * Creates a new wallet
   */
  async create(data: CreateWalletInput): Promise<WalletEntity> {
    const query = walletMutations.CREATE_WALLET;
    const response = await this.client.mutate<CreateWalletResponse>(query, { data });
    return response.createWallet;
  }

  /**
   * Deposits money into a wallet
   */
  async deposit(data: DepositInput): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'deposit' })
    const query = walletMutations.DEPOSIT;
    const response = await this.client.mutate<DepositResponse>(query, { data });
    return response.deposit;
  }

  /**
   * Withdraws money from a wallet
   */
  async withdraw(data: WithdrawInput): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'withdraw' })
    const query = walletMutations.WITHDRAW;
    const response = await this.client.mutate<WithdrawResponse>(query, { data });
    return response.withdraw;
  }

  /**
   * Converts money to tokens
   */
  async convertToTokens(data: ConvertToTokensInput): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'convertToTokens' })
    const query = walletMutations.CONVERT_TO_TOKENS;
    const response = await this.client.mutate<ConvertToTokensResponse>(query, { data });
    return response.convertToTokens;
  }

  /**
   * Converts tokens to money
   */
  async convertTokensToMoney(data: ConvertTokensToMoneyInput): Promise<WalletEntity> {
    const query = walletMutations.CONVERT_TOKENS_TO_MONEY;
    const response = await this.client.mutate<ConvertTokensToMoneyResponse>(query, { data });
    return response.convertTokensToMoney;
  }

  /**
   * Pays for a service using wallet funds
   */
  async payWithWallet(data: PayWithWalletInput): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'payWithWallet' })
    const query = walletMutations.PAY_WITH_WALLET;
    const response = await this.client.mutate<PayWithWalletResponse>(query, { data });
    return response.payWithWallet;
  }

  /**
   * Adds revenue to a wallet
   */
  async addRevenue(data: AddRevenueInput): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'addRevenue' })
    const query = walletMutations.ADD_REVENUE;
    const response = await this.client.mutate<AddRevenueResponse>(query, { data });
    return response.addRevenue;
  }

  /**
   * Withdraws money to a bank account
   */
  async bankWithdraw(data: BankWithdrawInput): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'bankWithdraw' })
    const query = walletMutations.BANK_WITHDRAW;
    const response = await this.client.mutate<BankWithdrawResponse>(query, { data });
    return response.bankWithdraw;
  }

  /**
   * Transfers money between wallets
   */
  async transfer(data: TransferInput): Promise<TransferResponse> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'transfer' })
    const query = walletMutations.TRANSFER;
    const response = await this.client.mutate<TransferMutationResponse>(query, { data });
    return response as unknown as TransferResponse;
  }

  /**
   * Sets the primary currency of a wallet
   */
  async setPrimaryCurrency(data: SetPrimaryCurrencyInput): Promise<WalletEntity> {
    const query = walletMutations.SET_PRIMARY_CURRENCY;
    const response = await this.client.mutate<SetPrimaryCurrencyResponse>(query, { data });
    return response.setPrimaryCurrency;
  }

  /**
   * Makes an adjustment to a wallet balance
   */
  async adjustment(data: AdjustmentInput): Promise<WalletEntity> {
    const query = walletMutations.ADJUSTMENT;
    const response = await this.client.mutate<AdjustmentResponse>(query, { data });
    return response.adjustment;
  }

  /**
   * Retrieves a wallet by its ID
   */
  async getById(walletId: string): Promise<WalletEntity> {
    const query = walletQueries.GET_WALLET_BY_ID;
    const response = await this.client.query<GetWalletResponse>(query, { id: walletId });
    return response.wallet;
  }

  /**
   * Retrieves wallets by user ID and organization ID
   */
  async listByUserAndOrganization(userId: string, organizationId: string): Promise<WalletEntity[]> {
    const query = walletQueries.GET_WALLETS;
    const response = await this.client.query<GetWalletsResponse>(query, { userId, organizationId });
    return response.wallets;
  }

  /**
   * Retrieves wallets by user ID only
   */
  async listByUser(userId: string): Promise<WalletEntity[]> {
    const query = walletQueries.GET_WALLETS_BY_USER;
    const response = await this.client.query<GetWalletsResponse>(query, { userId });
    return response.wallets;
  }

  /**
   * Retrieves wallets by organization ID only
   */
  async listByOrganization(organizationId: string): Promise<WalletEntity[]> {
    const query = walletQueries.GET_WALLETS_BY_ORGANIZATION;
    const response = await this.client.query<GetWalletsResponse>(query, { organizationId });
    return response.wallets;
  }

  /**
   * Retrieves personal wallets of a user (organizationId = null)
   */
  async listUserWallets(userId: string): Promise<WalletEntity[]> {
    const query = walletQueries.GET_USER_WALLETS;
    const response = await this.client.query<any>(query, { userId });
    return response.userWallets || [];
  }

  /**
   * Retrieves organization wallets (organizationId is set)
   */
  async listOrganizationWallets(organizationId: string): Promise<WalletEntity[]> {
    const query = walletQueries.GET_ORGANIZATION_WALLETS;
    const response = await this.client.query<any>(query, { organizationId });
    return response.organizationWallets || [];
  }

  /**
   * Retrieves all wallets (admin only)
   */
  async list(): Promise<WalletEntity[]> {
    const query = walletQueries.GET_ALL_WALLETS;
    const response = await this.client.query<any>(query, {});
    return response.allWallets || [];
  }

  /**
   * Gets conversion details for tokens to money conversion
   */
  async getConversionDetails(data: ConversionDetailsInput): Promise<ConversionDetails> {
    const query = walletQueries.GET_CONVERSION_DETAILS;
    const response = await this.client.query<GetConversionDetailsResponse>(query, { data });
    return response.getConversionDetails;
  }

  /**
   * Retrieves the Stripe Connect status of an organization
   */
  async getStripeConnectStatus(organizationID: string, forceRefresh?: boolean): Promise<StripeConnectStatusEntity> {
    const query = walletQueries.GET_STRIPE_CONNECT_STATUS;
    const variables = { organizationID, forceRefresh };
    const response = await this.client.query<GetStripeConnectStatusResponse>(query, variables);
    return response.stripeConnectStatus;
  }


  /**
   * Helper method to create a wallet with initial balances
   */
  async createWithBalances(
    userId: string,
    mainCurrency: string,
    initialBalances: Record<string, number> = {},
    initialTokens: Record<string, number> = {},
    options?: {
      organizationId?: string;
      description?: string;
      metadata?: string;
    }
  ): Promise<WalletEntity> {
    const data: CreateWalletInput = {
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
  async depositWithTokenConversion(
    walletId: string,
    amount: number,
    currency: string,
    convertToTokens: boolean = false,
    options?: {
      paymentSessionId?: string;
      metadata?: string;
    }
  ): Promise<WalletEntity> {
    this.assertIntegerMinorUnits({ amount, currency, operation: 'depositWithTokenConversion' })
    const data: DepositInput = {
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
  async payWithTokens(
    walletId: string,
    amount: number,
    currency: string,
    serviceId: string,
    serviceName: string,
    options?: {
      reference?: string;
      metadata?: string;
    }
  ): Promise<WalletEntity> {
    const data: PayWithWalletInput = {
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
  async transferBetweenWallets(
    sourceWalletId: string,
    destinationWalletId: string,
    amount: number,
    currency: string,
    metadata?: string
  ): Promise<TransferResponse> {
    const data: TransferInput = {
      sourceWalletId,
      destinationWalletId,
      amount,
      currency,
      metadata
    };
    return this.transfer(data);
  }
} 