import { parse } from 'graphql';
import { invoiceQueries } from '../../src/api/graphql/accounting/queries';
import { invoiceMutations } from '../../src/api/graphql/accounting/mutations';
import { Invoice } from '../../src/domains/accounting/InvoiceController';

/** Export comptable — contrat mu-billing `InvoiceExportResolver` (service interne). */
describe('factures — export comptable', () => {
  test('documents GraphQL valides, champs du contrat mu-billing', () => {
    expect(() => parse(invoiceQueries.INVOICE_EXPORT_PREVIEW)).not.toThrow();
    expect(() => parse(invoiceMutations.EXPORT_INVOICES)).not.toThrow();
    expect(invoiceQueries.INVOICE_EXPORT_PREVIEW).toContain('invoiceExportPreview(input: $input)');
    for (const f of ['exportId', 'fileName', 'invoiceCount', 'pdfCount', 'missingPdfs', 'downloadUrl', 'expiresAt']) {
      expect(invoiceMutations.EXPORT_INVOICES).toContain(f);
    }
  });

  test('aperçu puis export : l’input est transmis tel quel, la réponse dépaquetée', async () => {
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    const invoice = new Invoice(client);
    const input = { organizationID: 'org-1', from: '2026-09-01', to: '2026-09-30', side: 'sales' as const };
    client.query.mockResolvedValue({ invoiceExportPreview: { invoiceCount: 3, salesCount: 3, purchasesCount: 0, maxInvoices: 500 } });
    await expect(invoice.getExportPreview(input)).resolves.toEqual({ invoiceCount: 3, salesCount: 3, purchasesCount: 0, maxInvoices: 500 });
    expect(client.query).toHaveBeenCalledWith(invoiceQueries.INVOICE_EXPORT_PREVIEW, { input });
    client.mutate.mockResolvedValue({ exportInvoices: { exportId: 'e1', pdfCount: 3 } });
    await expect(invoice.exportInvoices({ ...input, requestedByUserID: 'u1' })).resolves.toEqual({ exportId: 'e1', pdfCount: 3 });
    expect(client.mutate).toHaveBeenCalledWith(invoiceMutations.EXPORT_INVOICES, { input: { ...input, requestedByUserID: 'u1' } });
  });
});
