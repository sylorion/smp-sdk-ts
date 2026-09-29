import { REFERRAL_OFFER_FIELDS, REFERRAL_PARTNERSHIP_FIELDS } from './queries.js';

const referralMutations = {
  UPSERT_REFERRAL_OFFER: `
    mutation UpsertReferralOffer($serviceId: ID!, $data: ReferralOfferInput!) {
      upsertReferralOffer(serviceId: $serviceId, data: $data) {${REFERRAL_OFFER_FIELDS}}
    }
  `,
  REQUEST_REFERRAL_PARTNERSHIP: `
    mutation RequestReferralPartnership($data: RequestReferralPartnershipInput!) {
      requestReferralPartnership(data: $data) {${REFERRAL_PARTNERSHIP_FIELDS}}
    }
  `,
  DECIDE_REFERRAL_PARTNERSHIP: `
    mutation DecideReferralPartnership($partnershipId: ID!, $decision: String!, $reason: String) {
      decideReferralPartnership(partnershipId: $partnershipId, decision: $decision, reason: $reason) {${REFERRAL_PARTNERSHIP_FIELDS}}
    }
  `,
  REVOKE_REFERRAL_PARTNERSHIP: `
    mutation RevokeReferralPartnership($partnershipId: ID!, $reason: String) {
      revokeReferralPartnership(partnershipId: $partnershipId, reason: $reason) {${REFERRAL_PARTNERSHIP_FIELDS}}
    }
  `,
  REGENERATE_REFERRAL_TOKEN: `
    mutation RegenerateReferralToken($partnershipId: ID!) {
      regenerateReferralToken(partnershipId: $partnershipId) {${REFERRAL_PARTNERSHIP_FIELDS}}
    }
  `,
};

export { referralMutations };
