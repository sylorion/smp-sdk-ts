// smp-sdk-ts/src/domains/accounting/Transactioncontroller.ts
import { transactionQueries } from '../../api/graphql/accounting/queries.js';
/**
 * Transactions (mu-billing).
 *
 * mu-billing n'expose que `transaction(input: TransactionIdInput!)` et `transactions`
 * (plus les listes par acheteur / vendeur, portées par `smpPayment`). Les anciennes
 * méthodes `list(pagination, sort, filter)`, `getByIds`, `getByUniqRef`, `getBySlug`
 * et `getBySlugs` visaient des champs inexistants et ont été retirées.
 */
export class Transaction {
    constructor(client) {
        this.client = client;
    }
    /**
     * Récupère une transaction par son identifiant.
     * @returns la transaction, ou `null` si elle n'existe pas.
     */
    async getById(transactionId) {
        const response = await this.client.query(transactionQueries.GET_TRANSACTION_BY_ID, {
            input: { transactionId },
        });
        return response?.transaction ?? null;
    }
}
