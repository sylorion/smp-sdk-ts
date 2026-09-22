import { secureTransferMutations } from '../../api/graphql/accounting/mutations.js';
// ── Controller ─────────────────────────────────────────────────
/**
 * Secure wallet-to-wallet transfer controller.
 * Implements a 2-phase OTP-verified transfer flow:
 * 1. initiate() — validates, calculates fees, sends OTP
 * 2. confirm() — validates OTP, executes atomic transfer + ledger
 */
export class SecureTransfer {
    constructor(client) {
        this.client = client;
    }
    /**
     * Phase 1: Initiate a secure transfer.
     * Resolves the SVC-... public address, validates wallets, and sends an OTP code by email.
     */
    async initiate(data) {
        const mutation = secureTransferMutations.INITIATE_SECURE_TRANSFER;
        const response = await this.client.mutate(mutation, { data });
        return response.initiateSecureTransfer;
    }
    /**
     * Phase 2: Confirm with OTP code.
     * Executes the atomic balance change, creates ledger entries, and sends notifications.
     */
    async confirm(data) {
        const mutation = secureTransferMutations.CONFIRM_SECURE_TRANSFER;
        const response = await this.client.mutate(mutation, { data });
        return response.confirmSecureTransfer;
    }
}
