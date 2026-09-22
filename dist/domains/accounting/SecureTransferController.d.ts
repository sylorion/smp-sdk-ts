import { APIClient } from '../../api/APIClient.js';
export interface InitiateSecureTransferInput {
    sourceWalletId: string;
    destinationAddress: string;
    amount: number;
    currency: string;
    initiatedBy: string;
    note?: string;
}
export interface ConfirmSecureTransferInput {
    transferId: string;
    otpCode: string;
    actorId: string;
}
export interface InitiateTransferResponse {
    transferId: string;
    status: string;
    otpSentTo: string;
    expiresAt: string;
    feeAmount: number;
    netAmount: number;
}
export interface ConfirmTransferResponse {
    transferId: string;
    status: string;
    sourceWallet: any;
    destinationWallet: any;
    amount: number;
    feeAmount: number;
    currency: string;
    ledgerTransactionId: string;
}
/**
 * Secure wallet-to-wallet transfer controller.
 * Implements a 2-phase OTP-verified transfer flow:
 * 1. initiate() — validates, calculates fees, sends OTP
 * 2. confirm() — validates OTP, executes atomic transfer + ledger
 */
export declare class SecureTransfer {
    private client;
    constructor(client: APIClient);
    /**
     * Phase 1: Initiate a secure transfer.
     * Resolves the SVC-... public address, validates wallets, and sends an OTP code by email.
     */
    initiate(data: InitiateSecureTransferInput): Promise<InitiateTransferResponse>;
    /**
     * Phase 2: Confirm with OTP code.
     * Executes the atomic balance change, creates ledger entries, and sends notifications.
     */
    confirm(data: ConfirmSecureTransferInput): Promise<ConfirmTransferResponse>;
}
