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
  /** `queued` (remis à l'envoi) ou `failed`. */
  status: string;
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
}
