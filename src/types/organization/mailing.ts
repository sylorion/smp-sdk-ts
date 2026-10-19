/** Statuts de contact acceptés par la sélection (`OrgContactStatus`). */
export type MailingContactStatus = 'active' | 'inactive' | 'prospect' | 'lead' | 'churned' | 'blocked';

/** Sélection des destinataires : filtres combinés en ET ; étiquettes : au moins une. */
export interface MailingSegment {
  statuses?: MailingContactStatus[];
  tags?: string[];
  contactIDs?: string[];
}

export interface OrganizationMailing {
  mailingID: string;
  subject: string;
  excerpt: string;
  sentAt: string;
  actorUserID: string;
  recipientCount: number;
  /** `queued` (remis à l'envoi), `sent` (compte rendu reçu) ou `failed`. */
  status: string;
  /** Campagne d'origine. */
  campaignID?: string | null;
  /** Compte rendu de mu-notification : e-mails remis au service d'envoi, échecs. */
  delivered?: number | null;
  failedCount?: number | null;
}

export interface OrganizationMailingPreview {
  recipientCount: number;
  excludedOptOut: number;
  excludedNoEmail: number;
  duplicates: number;
  sample: string[];
  maxRecipients: number;
  remainingToday: number;
}

export interface SendOrganizationMailingInput {
  organizationID: string;
  subject: string;
  /** Texte brut (aucun HTML interprété). */
  message: string;
  segment?: MailingSegment;
  /** E-mail mis en forme (composeur) : ramené aux droits du plan par mu-organization. */
  preheader?: string;
  design?: Partial<CampaignDesign>;
}

// ─── Campagnes : contenu rattaché à chaque campagne (aucune bibliothèque de modèles) ─────────

/** `sobre` pour tous ; `annonce` et `lettre` avec le plan Pro (`CUSTOMIZE_EMAILS`). */
export type CampaignLayout = 'sobre' | 'annonce' | 'lettre';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';

export interface CampaignDesign {
  layout: CampaignLayout;
  /** `#RRGGBB`. */
  color: string;
  logo: 'org' | 'none';
  ctaLabel: string;
  /** `https://` seulement. */
  ctaUrl: string;
  signature: string;
}

export interface CampaignAudience extends MailingSegment {
  label?: string;
}

export interface OrganizationCampaign {
  campaignID: string;
  name: string;
  status: CampaignStatus;
  subject: string;
  preheader: string;
  /** Texte brut ; variables `{prénom}` et `{entreprise}`. */
  body: string;
  design: CampaignDesign;
  audience: CampaignAudience;
  scheduledAt?: string | null;
  mailingID?: string | null;
  sentAt?: string | null;
  recipientCount?: number | null;
  /** E-mails remis au service d'envoi, et ceux qui n'ont pas pu l'être (campagne stockée par mu-notification). */
  deliveredCount?: number | null;
  failedCount?: number | null;
  failureReason?: string | null;
  /** `iro` : préparée avec IRO. */
  origin?: string | null;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface SaveOrganizationCampaignInput {
  organizationID: string;
  /** Absent : nouvelle campagne. */
  campaignID?: string;
  name?: string;
  subject?: string;
  preheader?: string;
  body?: string;
  design?: Partial<CampaignDesign>;
  audience?: CampaignAudience;
  /** ISO ; `null` retire la programmation ; absent : inchangée. */
  scheduledAt?: string | null;
  origin?: 'iro';
}

export interface OrganizationEmailTemplate {
  layout: CampaignLayout;
  color: string;
  logo: 'org' | 'none';
  signature: string;
  footer: string;
}

export interface OrganizationEmailSettings {
  template: OrganizationEmailTemplate;
  canCustomize: boolean;
}

export interface OrganizationContactLastMailed {
  contactID: string;
  lastMailedAt: string;
}
