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
  /** Factures au PDF déjà archivé (relu, moins coûteux) : base de l'estimation STK. */
  archivedCount: number;
}

// ── Export ASYNCHRONE (01/11) : demande, avancement, téléchargement — services internes ──

export type InvoiceExportOrigin = 'dashboard' | 'agent' | 'automation';
export type InvoiceExportStatus = 'queued' | 'running' | 'done' | 'failed';

export interface RequestInvoiceExportInput extends InvoiceExportInput {
  /** Membre notifié à la fin et débité des STK (vérifié par l'appelant). */
  requestedByUserID: string;
  origin?: InvoiceExportOrigin;
  /** Exécution d'automatisation qui demande l'export (livrable de l'exécution). */
  automationRunId?: string;
  /** Langue des notifications : fr, en, es. */
  language?: string;
}

export interface InvoiceExportStatusInput {
  organizationID: string;
  exportId: string;
}

/** État d'un export : avancement en direct, coût débité au fil de l'eau, livraison. */
export interface InvoiceExportJob {
  exportId: string;
  status: InvoiceExportStatus;
  origin: InvoiceExportOrigin;
  automationRunId: string | null;
  from: string;
  to: string;
  side: InvoiceExportSide;
  invoiceCount: number;
  /** Factures déjà traitées par l'agent. */
  processedCount: number;
  pdfCount: number | null;
  missingCount: number;
  fileName: string | null;
  requestedAt: string;
  finishedAt: string | null;
  /** Téléchargeable jusqu'à cette date (null : envoyée par e-mail ou supprimée). */
  availableUntil: string | null;
  /** STK débités à ce stade, coût réel une fois livré. */
  tokenCost: number;
  /** Archive jointe à l'e-mail (supprimée du stockage dès l'envoi). */
  attachedToEmail: boolean;
  downloadable: boolean;
  error: string | null;
}

export interface InvoiceExportDownload {
  /** Lien signé d'une heure ; le premier téléchargement programme la suppression de l'archive. */
  downloadUrl: string;
  fileName: string;
  expiresAt: string;
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
