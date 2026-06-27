import { APIClient } from '../../api/APIClient.js';
import { withdrawalMutations } from '../../api/graphql/accounting/mutations.js';
import { withdrawalQueries } from '../../api/graphql/accounting/queries.js';

// ── Types ──────────────────────────────────────────────────────
export interface BeneficiaryInfo {
  accountHolder: string;
  iban: string;
  bic?: string;
  bankName?: string;
  reference?: string;
}

export interface CreateWithdrawalInput {
  walletId: string;
  userId?: string;
  organizationId?: string;
  amount: number;
  currency: string;
  paymentMethodId?: string;
  destinationIbanHash?: string;
  submittedBy: string;
  beneficiaryInfo?: BeneficiaryInfo;
  /** Email de contact de l'organisation — résolu côté frontend, transmis via RabbitMQ pour notifications */
  organizationContactEmail?: string;
  /** Nom de l'organisation — pour l'affichage dans les emails */
  organizationName?: string;
}

export interface ReviewWithdrawalInput {
  withdrawalRequestId: string;
  actorId: string;
  action: 'approve' | 'reject';
  rejectionReason?: string;
  note?: string;
  organizationContactEmail?: string;
  organizationName?: string;
}

export interface WithdrawalEvent {
  withdrawalEventId: string;
  eventType: string;
  actorId: string;
  actorRole?: string;
  previousStatus?: string;
  newStatus: string;
  note?: string;
  metadataJson?: string; // JSON stringified - contains beneficiaryInfo
  createdAt: string;
}

export interface WithdrawalRequest {
  withdrawalRequestId: string;
  walletId: string;
  userId?: string;
  organizationId?: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  status: string;
  paymentMethodId?: string;
  destinationIbanHash?: string;
  submittedBy: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  externalPayoutId?: string;
  externalPayoutStatus?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
  events?: WithdrawalEvent[];
}

export interface ListWithdrawalsInput {
  walletId?: string;
  organizationId?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

// ── Controller ─────────────────────────────────────────────────

/**
 * Withdrawal controller for the Maker-Checker withdrawal pipeline.
 * Manages the full lifecycle: create → submit → approve/reject → complete.
 */
export class Withdrawal {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  private assertIntegerMinorUnits(params: { amount: number; currency: string; operation: string }) {
    const { amount, currency, operation } = params;
    if (Number.isInteger(amount)) return;
    throw new Error(
      `[Withdrawal.${operation}] amount must be an integer in minor units (cents). Received ${amount} (${currency})`
    );
  }

  /**
   * Creates a withdrawal request. The wallet balance is immediately held (HOLD ledger entry).
   * Status: initiated.
   */
  async create(data: CreateWithdrawalInput): Promise<WithdrawalRequest> {
    this.assertIntegerMinorUnits({ amount: data.amount, currency: data.currency, operation: 'create' });
    const mutation = withdrawalMutations.CREATE_WITHDRAWAL;
    const response = await this.client.mutate<{ createWithdrawal: WithdrawalRequest }>(mutation, { data });
    return response.createWithdrawal;
  }

  /**
   * Submits a withdrawal for admin approval.
   * Transition: initiated → pending_approval.
   */
  async submitForApproval(withdrawalRequestId: string, actorId: string): Promise<WithdrawalRequest> {
    const mutation = withdrawalMutations.SUBMIT_FOR_APPROVAL;
    const response = await this.client.mutate<{ submitWithdrawalForApproval: WithdrawalRequest }>(
      mutation,
      { withdrawalRequestId, actorId },
    );
    return response.submitWithdrawalForApproval;
  }

  /**
   * Approves or rejects a withdrawal (Checker action).
   * On rejection, HOLD is rolled back and wallet re-credited.
   */
  async review(data: ReviewWithdrawalInput): Promise<WithdrawalRequest> {
    const mutation = withdrawalMutations.REVIEW_WITHDRAWAL;
    const response = await this.client.mutate<{ reviewWithdrawal: WithdrawalRequest }>(mutation, { data });
    return response.reviewWithdrawal;
  }

  /**
   * Retrieves a single withdrawal request by ID, including its audit trail events.
   */
  async getById(withdrawalRequestId: string): Promise<WithdrawalRequest> {
    const query = withdrawalQueries.GET_WITHDRAWAL;
    const response = await this.client.query<{ withdrawalRequest: WithdrawalRequest }>(
      query,
      { withdrawalRequestId },
    );
    return response.withdrawalRequest;
  }

  /**
   * Lists withdrawal requests with optional filters.
   */
  async list(filters: ListWithdrawalsInput = {}): Promise<WithdrawalRequest[]> {
    const query = withdrawalQueries.LIST_WITHDRAWALS;
    const response = await this.client.query<{ withdrawalRequests: WithdrawalRequest[] }>(query, filters);
    return response.withdrawalRequests;
  }

  /**
   * Helper: Lists withdrawals for a specific wallet.
   */
  async listByWallet(walletId: string, status?: string): Promise<WithdrawalRequest[]> {
    return this.list({ walletId, status });
  }

  /**
   * Helper: Lists withdrawals for a specific organization.
   */
  async listByOrganization(organizationId: string, status?: string): Promise<WithdrawalRequest[]> {
    return this.list({ organizationId, status });
  }
}
