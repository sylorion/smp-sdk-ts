import { APIClient } from '../../api/APIClient.js';
import type { TransactionResponse } from '../../types/accounting/index.js';
/**
 * Transactions (mu-billing).
 *
 * mu-billing n'expose que `transaction(input: TransactionIdInput!)` et `transactions`
 * (plus les listes par acheteur / vendeur, portées par `smpPayment`). Les anciennes
 * méthodes `list(pagination, sort, filter)`, `getByIds`, `getByUniqRef`, `getBySlug`
 * et `getBySlugs` visaient des champs inexistants et ont été retirées.
 */
export declare class Transaction {
    private client;
    constructor(client: APIClient);
    /**
     * Récupère une transaction par son identifiant.
     * @returns la transaction, ou `null` si elle n'existe pas.
     */
    getById(transactionId: string): Promise<TransactionResponse | null>;
}
