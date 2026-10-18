// ==============================
// EXPORT COMPTABLE DES FACTURES (mu-billing, `src/billing/invoice-export/`)
// ==============================

/** Factures émises (ventes), reçues (achats) ou les deux. */
export type InvoiceExportSide = 'sales' | 'purchases' | 'all';

export interface InvoiceExportInput {
  organizationID: string;
  /** Premier jour de la période (AAAA-MM-JJ, inclus), sur la date d'émission. */
  from: string;
  /** Dernier jour de la période (AAAA-MM-JJ, inclus) ; 366 jours au plus. */
  to: string;
  side?: InvoiceExportSide;
  /** Membre à l'origine de l'export (journal) — vérifié par l'appelant. */
  requestedByUserID?: string;
}

export interface InvoiceExportPreview {
  invoiceCount: number;
  salesCount: number;
  purchasesCount: number;
  /** Plafond de factures par export (500). */
  maxInvoices: number;
}

export interface InvoiceExportResult {
  exportId: string;
  fileName: string;
  invoiceCount: number;
  /** Factures dont le PDF est dans l'archive (base du débit STK). */
  pdfCount: number;
  /** Numéros des factures sans PDF (listées dans l'index). */
  missingPdfs: string[];
  /** Lien signé de l'archive ZIP, valable une heure. */
  downloadUrl: string;
  expiresAt: string;
}
