import type { DocumentTemplateSettings } from 'accounting-tools/document';

/**
 * Présentation d'une facture (champ `Invoice.documentPresentation` de mu-billing) :
 * la copie figée à l'émission, ou le réglage courant de l'organisation si la
 * facture n'a pas encore de PDF définitif. Déjà normalisée selon les droits du plan.
 */
export interface InvoiceDocumentPresentation {
  settings: DocumentTemplateSettings;
  /** Logo de l'organisation ; null si le réglage n'en affiche pas. */
  logoUrl: string | null;
  /** Facture de frais émise par la plateforme (modèle Services). */
  platform: boolean;
}
