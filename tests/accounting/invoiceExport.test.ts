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

  test('export asynchrone : documents valides, demande / état / téléchargement transmis tels quels', async () => {
    for (const doc of [invoiceMutations.REQUEST_INVOICE_EXPORT, invoiceQueries.INVOICE_EXPORT_STATUS, invoiceMutations.DOWNLOAD_INVOICE_EXPORT]) expect(() => parse(doc)).not.toThrow();
    for (const f of ['processedCount', 'tokenCost', 'attachedToEmail', 'downloadable', 'availableUntil']) expect(invoiceQueries.INVOICE_EXPORT_STATUS).toContain(f);
    expect(invoiceQueries.INVOICE_EXPORT_PREVIEW).toContain('archivedCount');
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    const invoice = new Invoice(client);
    const req = { organizationID: 'org-1', from: '2026-10-01', to: '2026-10-31', side: 'all' as const, requestedByUserID: 'u1', origin: 'dashboard' as const };
    client.mutate.mockResolvedValueOnce({ requestInvoiceExport: { exportId: 'e1', status: 'queued' } });
    await expect(invoice.requestExport(req)).resolves.toEqual({ exportId: 'e1', status: 'queued' });
    expect(client.mutate).toHaveBeenLastCalledWith(invoiceMutations.REQUEST_INVOICE_EXPORT, { input: req });
    client.query.mockResolvedValueOnce({ invoiceExportStatus: { exportId: 'e1', status: 'running', processedCount: 4 } });
    await expect(invoice.getExportStatus({ organizationID: 'org-1', exportId: 'e1' })).resolves.toMatchObject({ processedCount: 4 });
    client.mutate.mockResolvedValueOnce({ downloadInvoiceExport: { downloadUrl: 'https://s3/x', fileName: 'f.zip', expiresAt: 'x' } });
    await expect(invoice.downloadExport({ organizationID: 'org-1', exportId: 'e1' })).resolves.toMatchObject({ downloadUrl: 'https://s3/x' });
  });
});
