import { APIClient } from '../../api/APIClient.js';
import { referralQueries } from '../../api/graphql/referral/queries.js';
import { referralMutations } from '../../api/graphql/referral/mutations.js';
import type {
  ReferralCommission,
  ReferralCommissionStatus,
  ReferralMarketplaceService,
  ReferralOffer,
  ReferralOfferInput,
  ReferralPartnership,
  ReferralPartnershipStatus,
  ReferralRole,
  ReferralStats,
  ReferralTokenInfo,
  RequestReferralPartnershipInput,
} from '../../types/referral/index.js';

/**
 * Apport d'affaires (mu-command, module `referral`).
 *
 * Toutes les opérations exigent un client porteur de l'identité de l'utilisateur
 * (assertion signée côté BFF) et l'appartenance à l'organisation concernée,
 * sauf `resolveToken` (public, sans donnée sur l'apporteur).
 */
export class ReferralController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /** Offre d'apport d'un service (membre de l'organisation du service) ; `null` si jamais configurée. */
  async getOffer(serviceId: string): Promise<ReferralOffer | null> {
    const r = await this.client.query<{ referralOffer: ReferralOffer | null }>(referralQueries.GET_REFERRAL_OFFER, { serviceId });
    return r.referralOffer ?? null;
  }

  /** Taux 1–50 %, durée d'attribution 1–90 jours (erreur `REFERRAL_INVALID_RATE`). */
  async upsertOffer(serviceId: string, data: ReferralOfferInput): Promise<ReferralOffer> {
    const r = await this.client.mutate<{ upsertReferralOffer: ReferralOffer }>(referralMutations.UPSERT_REFERRAL_OFFER, { serviceId, data });
    return r.upsertReferralOffer;
  }

  /** Services des autres organisations ouverts à l'apport, avec le statut du partenariat de l'apporteur. */
  async marketplace(apporteurOrganizationId: string, options: { search?: string; limit?: number; offset?: number } = {}): Promise<ReferralMarketplaceService[]> {
    const r = await this.client.query<{ referralMarketplace: ReferralMarketplaceService[] }>(referralQueries.GET_REFERRAL_MARKETPLACE, {
      apporteurOrganizationId,
      ...(options.search ? { search: options.search } : {}),
      ...(options.limit != null ? { limit: options.limit } : {}),
      ...(options.offset != null ? { offset: options.offset } : {}),
    });
    return r.referralMarketplace ?? [];
  }

  async partnerships(organizationId: string, role: ReferralRole, status?: ReferralPartnershipStatus[]): Promise<ReferralPartnership[]> {
    const r = await this.client.query<{ referralPartnerships: ReferralPartnership[] }>(referralQueries.GET_REFERRAL_PARTNERSHIPS, {
      organizationId, role, ...(status?.length ? { status } : {}),
    });
    return r.referralPartnerships ?? [];
  }

  async commissions(
    organizationId: string,
    role: ReferralRole,
    options: { status?: ReferralCommissionStatus[]; limit?: number; offset?: number } = {},
  ): Promise<ReferralCommission[]> {
    const r = await this.client.query<{ referralCommissions: ReferralCommission[] }>(referralQueries.GET_REFERRAL_COMMISSIONS, {
      organizationId,
      role,
      ...(options.status?.length ? { status: options.status } : {}),
      ...(options.limit != null ? { limit: options.limit } : {}),
      ...(options.offset != null ? { offset: options.offset } : {}),
    });
    return r.referralCommissions ?? [];
  }

  async stats(organizationId: string, role: ReferralRole): Promise<ReferralStats> {
    const r = await this.client.query<{ referralStats: ReferralStats }>(referralQueries.GET_REFERRAL_STATS, { organizationId, role });
    return r.referralStats;
  }

  /** Validité d'un jeton `?ref=` (public). */
  async resolveToken(token: string): Promise<ReferralTokenInfo> {
    const r = await this.client.query<{ resolveReferralToken: ReferralTokenInfo }>(referralQueries.RESOLVE_REFERRAL_TOKEN, { token });
    return r.resolveReferralToken ?? { valid: false };
  }

  /** Demande de partenariat ; `acceptMandate: true` obligatoire (mandat de facturation). Acceptée d'office si l'offre est en mode `auto`. */
  async requestPartnership(data: RequestReferralPartnershipInput): Promise<ReferralPartnership> {
    const r = await this.client.mutate<{ requestReferralPartnership: ReferralPartnership }>(referralMutations.REQUEST_REFERRAL_PARTNERSHIP, { data });
    return r.requestReferralPartnership;
  }

  /** Décision du prestataire sur une demande en attente. */
  async decidePartnership(partnershipId: string, decision: 'approve' | 'reject', reason?: string): Promise<ReferralPartnership> {
    const r = await this.client.mutate<{ decideReferralPartnership: ReferralPartnership }>(referralMutations.DECIDE_REFERRAL_PARTNERSHIP, {
      partnershipId, decision, ...(reason ? { reason } : {}),
    });
    return r.decideReferralPartnership;
  }

  /** Fin du partenariat, par l'une ou l'autre partie. */
  async revokePartnership(partnershipId: string, reason?: string): Promise<ReferralPartnership> {
    const r = await this.client.mutate<{ revokeReferralPartnership: ReferralPartnership }>(referralMutations.REVOKE_REFERRAL_PARTNERSHIP, {
      partnershipId, ...(reason ? { reason } : {}),
    });
    return r.revokeReferralPartnership;
  }

  /** Nouveau lien (l'ancien cesse d'attribuer) : apporteur uniquement. */
  async regenerateToken(partnershipId: string): Promise<ReferralPartnership> {
    const r = await this.client.mutate<{ regenerateReferralToken: ReferralPartnership }>(referralMutations.REGENERATE_REFERRAL_TOKEN, { partnershipId });
    return r.regenerateReferralToken;
  }
}
