/**
 * Apport d'affaires — types alignés sur le schéma GraphQL de mu-command
 * (module referral). Référence : smp/docs/architecture/apport-affaires.md.
 * Montants en centimes, HT sauf mention contraire.
 */

export type ReferralApprovalMode = 'auto' | 'manual';
export type ReferralRole = 'apporteur' | 'provider';
export type ReferralPartnershipStatus = 'pending' | 'approved' | 'rejected' | 'revoked';
export type ReferralCommissionStatus = 'earned' | 'invoiced' | 'paid' | 'payout_failed' | 'reversed';

export interface ReferralOffer {
  serviceId: string;
  organizationId: string;
  enabled: boolean;
  /** Pourcentage du HT du service, de 1 à 50. */
  commissionRate: number;
  approvalMode: ReferralApprovalMode | string;
  terms?: string | null;
  /** Durée d'attribution du lien, en jours (1 à 90). */
  attributionDays: number;
  acceptedAt?: string | null;
  updatedAt?: string | null;
}

export interface ReferralPartnership {
  partnershipId: string;
  serviceId: string;
  sellerOrganizationId: string;
  apporteurOrganizationId: string;
  status: ReferralPartnershipStatus | string;
  commissionRate: number;
  attributionDays: number;
  /** Jeton du lien `?ref=` : rendu uniquement aux membres de l'organisation apporteuse. */
  token?: string | null;
  message?: string | null;
  decisionReason?: string | null;
  mandateAcceptedAt?: string | null;
  requestedAt: string;
  decidedAt?: string | null;
  ordersCount: number;
  /** Total des commissions non annulées, en centimes HT. */
  commissionTotal: number;
  currency?: string | null;
}

export interface ReferralCommission {
  commissionId: string;
  orderId: string;
  partnershipId: string;
  serviceId: string;
  sellerOrganizationId: string;
  apporteurOrganizationId: string;
  baseAmount: number;
  commissionRate: number;
  amount: number;
  currency: string;
  status: ReferralCommissionStatus | string;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  creditNoteId?: string | null;
  failureReason?: string | null;
  earnedAt: string;
  invoicedAt?: string | null;
  paidAt?: string | null;
  reversedAt?: string | null;
}

export interface ReferralMarketplaceService {
  serviceId: string;
  organizationId: string;
  title?: string | null;
  price?: number | null;
  currency?: string | null;
  commissionRate: number;
  approvalMode: ReferralApprovalMode | string;
  attributionDays: number;
  terms?: string | null;
  /** Statut du partenariat de l'organisation apporteuse, `null` si aucun. */
  partnershipStatus?: ReferralPartnershipStatus | string | null;
}

export interface ReferralStats {
  orders30d: number;
  commissionEarned30d: number;
  commissionPaid: number;
  commissionPending: number;
  pendingRequests: number;
  activePartnerships: number;
  currency?: string | null;
}

export interface ReferralTokenInfo {
  valid: boolean;
  serviceId?: string | null;
  attributionDays?: number | null;
}

export interface ReferralOfferInput {
  enabled: boolean;
  commissionRate: number;
  approvalMode: ReferralApprovalMode;
  terms?: string;
  attributionDays?: number;
}

export interface RequestReferralPartnershipInput {
  serviceId: string;
  apporteurOrganizationId: string;
  message?: string;
  /** Mandat de facturation (art. 289 I-2 CGI) : obligatoire. */
  acceptMandate: boolean;
}

export type ReferralErrorCode =
  | 'REFERRAL_NOT_OPEN'
  | 'REFERRAL_SELF'
  | 'REFERRAL_MANDATE_REQUIRED'
  | 'REFERRAL_ALREADY_EXISTS'
  | 'REFERRAL_NOT_FOUND'
  | 'REFERRAL_INVALID_RATE'
  | 'REFERRAL_INVALID_TRANSITION'
  | 'SERVICE_NOT_IN_ORGANIZATION'
  | 'SERVICE_NOT_FOUND'
  | 'BAD_USER_INPUT';
