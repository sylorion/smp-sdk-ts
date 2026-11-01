import { parse } from 'graphql';
import { invoiceQueries } from '../../src/api/graphql/accounting/queries';
import { Invoice } from '../../src/domains/accounting/InvoiceController';

/** C115 — montant dû par lien de paiement, contrat mu-billing `invoicePaymentDue`. */
describe('factures — montant dû par lien de paiement', () => {
  test('document GraphQL valide, champs du contrat mu-billing', () => {
    expect(() => parse(invoiceQueries.INVOICE_PAYMENT_DUE)).not.toThrow();
    expect(invoiceQueries.INVOICE_PAYMENT_DUE).toContain('invoicePaymentDue(invoiceId: $invoiceId, cardCountry: $cardCountry)');
    for (const f of ['carriesPlatformFees', 'carriesCommission', 'invoiceTotalCents', 'priceHTCents', 'vatCents', 'platformFeeCents', 'stripeFeeCents', 'amountDueCents', 'currency']) {
      expect(invoiceQueries.INVOICE_PAYMENT_DUE).toContain(f);
    }
  });

  test('getPaymentDue : variables transmises, réponse dépaquetée, null si la facture est inconnue', async () => {
    const client: any = { query: jest.fn() };
    const invoice = new Invoice(client);
    const due = { invoiceId: 'inv-1', currency: 'EUR', carriesPlatformFees: true, carriesCommission: true, invoiceTotalCents: 84000, priceHTCents: 70000, vatCents: 14000, platformFeeCents: 5600, stripeFeeCents: 1369, amountDueCents: 90969 };
    client.query.mockResolvedValue({ invoicePaymentDue: due });
    await expect(invoice.getPaymentDue('inv-1', 'US')).resolves.toEqual(due);
    expect(client.query).toHaveBeenCalledWith(invoiceQueries.INVOICE_PAYMENT_DUE, { invoiceId: 'inv-1', cardCountry: 'US' });
    client.query.mockResolvedValue({ invoicePaymentDue: null });
    await expect(invoice.getPaymentDue('inv-2')).resolves.toBeNull();
    expect(client.query).toHaveBeenLastCalledWith(invoiceQueries.INVOICE_PAYMENT_DUE, { invoiceId: 'inv-2', cardCountry: null });
  });
});
