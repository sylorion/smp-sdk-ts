import { transactionQueries } from '../../src/api/graphql/accounting/queries';
import { paymentMutations } from '../../src/api/graphql/accounting/mutations';
import { Transaction } from '../../src/domains/accounting/Transactioncontroller';
import { SMPPayment } from '../../src/domains/accounting/PaymentController';
import { mockClient, rootArgs, rootField, selected, varTypes } from './helpers';

/**
 * Transactions (mu-billing) : `transaction(input: TransactionIdInput!)`.
 * Avant correction, le SDK interrogeait `transactionByID(transactionID: …)` (champ inexistant)
 * et lisait `response.data.transaction` — `data` n'existe pas dans la réponse de graphql-request.
 */
describe('accounting.transaction', () => {
  test('GET_TRANSACTION_BY_ID vise transaction(input: $input) et sélectionne les champs réels de Transaction', () => {
    const doc = transactionQueries.GET_TRANSACTION_BY_ID;
    expect(rootField(doc)).toBe('transaction');
    expect(rootArgs(doc)).toEqual({ input: '$input' });
    expect(varTypes(doc)).toEqual({ input: 'TransactionIdInput!' });
    const fields = selected(doc);
    expect(fields).toEqual(expect.arrayContaining(['transactionId', 'serviceId', 'buyerUserId', 'sellerOrganizationId', 'currency', 'totalAmount', 'status']));
    expect(fields).not.toEqual(expect.arrayContaining(['transactionID']));
    expect(fields).not.toContain('uniqRef');
  });

  test('getById : envoie { input: { transactionId } } et renvoie la transaction (réponse non enveloppée)', async () => {
    const client = mockClient();
    const ctl = new Transaction(client);
    client.query.mockResolvedValue({ transaction: { transactionId: 't1', status: 'paid' } });
    await expect(ctl.getById('t1')).resolves.toEqual({ transactionId: 't1', status: 'paid' });
    expect(client.query).toHaveBeenCalledWith(transactionQueries.GET_TRANSACTION_BY_ID, { input: { transactionId: 't1' } });
  });

  test('getById : transaction introuvable → null (plus de TypeError sur response.data)', async () => {
    const client = mockClient();
    client.query.mockResolvedValue({ transaction: null });
    await expect(new Transaction(client).getById('absent')).resolves.toBeNull();
  });

  test('les méthodes sans équivalent backend ont été retirées', () => {
    const ctl = new Transaction(mockClient()) as any;
    for (const m of ['list', 'getByIds', 'getByUniqRef', 'getBySlug', 'getBySlugs']) expect(ctl[m]).toBeUndefined();
  });

  test('smpPayment.getTransactionById partage le document corrigé', async () => {
    const client = mockClient();
    client.query.mockResolvedValue({ transaction: { transactionId: 't2' } });
    await expect(new SMPPayment(client).getTransactionById('t2')).resolves.toEqual({ transactionId: 't2' });
    expect(client.query).toHaveBeenCalledWith(transactionQueries.GET_TRANSACTION_BY_ID, { input: { transactionId: 't2' } });
  });

  test('smpPayment : updateLine / listTransactions retirés, deleteLine conservé (utilisé) mais signalé', () => {
    const pay = new SMPPayment(mockClient()) as any;
    expect(pay.updateLine).toBeUndefined();
    expect(pay.listTransactions).toBeUndefined();
    expect(typeof pay.deleteLine).toBe('function');
    expect((paymentMutations as any).UPDATE_LINE).toBeUndefined();
    expect((paymentMutations as any).UPDATE_ORDER).toBeUndefined();
  });
});
