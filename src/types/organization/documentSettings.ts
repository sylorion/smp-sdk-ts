// ==============================
// PERSONNALISATION DES DOCUMENTS COMMERCIAUX
// (factures, avoirs, devis, bons de commande)
// ==============================
//
// Le format du réglage est celui de la lib partagée accounting-tools/document :
// c'est elle qui valide, applique les droits du plan et dessine les documents,
// côté serveur (mu-organization, mu-billing) comme côté navigateur (webapp).
import type { DocumentTemplateSettings } from 'accounting-tools/document';

export type { DocumentTemplateSettings } from 'accounting-tools/document';

/** Droits du plan du propriétaire de l'organisation. */
export interface OrganizationDocumentEntitlements {
  /** Modèle, couleurs, disposition, colonnes, logo, mention libre — dès Starter. */
  canCustomize: boolean;
  /** Retrait de la mention « Émis avec Services » — Pro et Business. */
  canRemovePoweredBy: boolean;
  /** Palier effectif : standard | starter | pro | business. */
  plan: string;
}

export interface OrganizationDocumentSettings {
  organizationID: string;
  /** Réglage APPLIQUÉ aux prochains documents (droits du plan déjà appliqués). */
  settings: DocumentTemplateSettings;
  /** Réglage enregistré tel quel ; null = modèle par défaut. */
  savedSettings: DocumentTemplateSettings | null;
  isDefault: boolean;
  /** Réglage enregistré au-delà des droits du plan actuel (plan rétrogradé) : conservé mais inactif. */
  customizationSuspended: boolean;
  entitlements: OrganizationDocumentEntitlements;
  /** Corrections appliquées, à afficher à l'utilisateur. */
  warnings: string[];
  updatedAt: string | null;
}
