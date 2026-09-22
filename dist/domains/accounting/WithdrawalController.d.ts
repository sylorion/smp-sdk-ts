import { APIClient } from '../../api/APIClient.js';
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
    metadataJson?: string;
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
/**
 * Withdrawal controller for the Maker-Checker withdrawal pipeline.
 * Manages the full lifecycle: create → submit → approve/reject → complete.
 */
export declare class Withdrawal {
    private client;
    constructor(client: APIClient);
    private assertIntegerMinorUnits;
    /**
     * Creates a withdrawal request. The wallet balance is immediately held (HOLD ledger entry).
     * Status: initiated.
     */
    create(data: CreateWithdrawalInput): Promise<WithdrawalRequest>;
    /**
     * Submits a withdrawal for admin approval.
     * Transition: initiated → pending_approval.
     */
    submitForApproval(withdrawalRequestId: string, actorId: string): Promise<WithdrawalRequest>;
    /**
     * Approves or rejects a withdrawal (Checker action).
     * On rejection, HOLD is rolled back and wallet re-credited.
     */
    review(data: ReviewWithdrawalInput): Promise<WithdrawalRequest>;
    /**
     * Retrieves a single withdrawal request by ID, including its audit trail events.
     */
    getById(withdrawalRequestId: string): Promise<WithdrawalRequest>;
    /**
     * Lists withdrawal requests with optional filters.
     */
    list(filters?: ListWithdrawalsInput): Promise<WithdrawalRequest[]>;
    /**
     * Helper: Lists withdrawals for a specific wallet.
     */
    listByWallet(walletId: string, status?: string): Promise<WithdrawalRequest[]>;
    /**
     * Helper: Lists withdrawals for a specific organization.
     */
    listByOrganization(organizationId: string, status?: string): Promise<WithdrawalRequest[]>;
}
