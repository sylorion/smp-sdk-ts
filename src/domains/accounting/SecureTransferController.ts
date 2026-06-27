import { APIClient } from '../../api/APIClient.js';
import { secureTransferMutations } from '../../api/graphql/accounting/mutations.js';

// ── Types ──────────────────────────────────────────────────────
export interface InitiateSecureTransferInput {
  sourceWalletId: string;
  destinationAddress: string; // SVC-XXXX-XXXX-XXXX
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

// ── Controller ─────────────────────────────────────────────────

/**
 * Secure wallet-to-wallet transfer controller.
 * Implements a 2-phase OTP-verified transfer flow:
 * 1. initiate() — validates, calculates fees, sends OTP
 * 2. confirm() — validates OTP, executes atomic transfer + ledger
 */
export class SecureTransfer {
  constructor(private client: APIClient) {}

  /**
   * Phase 1: Initiate a secure transfer.
   * Resolves the SVC-... public address, validates wallets, and sends an OTP code by email.
   */
  async initiate(data: InitiateSecureTransferInput): Promise<InitiateTransferResponse> {
    const mutation = secureTransferMutations.INITIATE_SECURE_TRANSFER;
    const response = await this.client.mutate<{ initiateSecureTransfer: InitiateTransferResponse }>(
      mutation,
      { data },
    );
    return response.initiateSecureTransfer;
  }

  /**
   * Phase 2: Confirm with OTP code.
   * Executes the atomic balance change, creates ledger entries, and sends notifications.
   */
  async confirm(data: ConfirmSecureTransferInput): Promise<ConfirmTransferResponse> {
    const mutation = secureTransferMutations.CONFIRM_SECURE_TRANSFER;
    const response = await this.client.mutate<{ confirmSecureTransfer: ConfirmTransferResponse }>(
      mutation,
      { data },
    );
    return response.confirmSecureTransfer;
  }
}
