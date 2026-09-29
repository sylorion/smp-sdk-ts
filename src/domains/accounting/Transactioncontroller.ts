// smp-sdk-ts/src/domains/accounting/Transactioncontroller.ts

import { APIClient } from '../../api/APIClient.js';
import { transactionQueries } from '../../api/graphql/accounting/queries.js';
import type { TransactionResponse } from '../../types/accounting/index.js';

/**
 * Transactions (mu-billing).
 *
 * mu-billing n'expose que `transaction(input: TransactionIdInput!)` et `transactions`
 * (plus les listes par acheteur / vendeur, portées par `smpPayment`). Les anciennes
 * méthodes `list(pagination, sort, filter)`, `getByIds`, `getByUniqRef`, `getBySlug`
 * et `getBySlugs` visaient des champs inexistants et ont été retirées.
 */
export class Transaction {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Récupère une transaction par son identifiant.
   * @returns la transaction, ou `null` si elle n'existe pas.
   */
  async getById(transactionId: string): Promise<TransactionResponse | null> {
    const response = await this.client.query(transactionQueries.GET_TRANSACTION_BY_ID, {
      input: { transactionId },
    }) as { transaction: TransactionResponse | null };
    return response?.transaction ?? null;
  }
}
