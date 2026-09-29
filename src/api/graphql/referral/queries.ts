// =========================================
// Apport d'affaires (mu-command, module referral)
// Référence : smp/docs/architecture/apport-affaires.md §4
// =========================================

export const REFERRAL_OFFER_FIELDS = `
  serviceId
  organizationId
  enabled
  commissionRate
  approvalMode
  terms
  attributionDays
  acceptedAt
  updatedAt
`;

export const REFERRAL_PARTNERSHIP_FIELDS = `
  partnershipId
  serviceId
  sellerOrganizationId
  apporteurOrganizationId
  status
  commissionRate
  attributionDays
  token
  message
  decisionReason
  mandateAcceptedAt
  requestedAt
  decidedAt
  ordersCount
  commissionTotal
  currency
`;

export const REFERRAL_COMMISSION_FIELDS = `
  commissionId
  orderId
  partnershipId
  serviceId
  sellerOrganizationId
  apporteurOrganizationId
  baseAmount
  commissionRate
  amount
  currency
  status
  invoiceId
  invoiceNumber
  creditNoteId
  failureReason
  earnedAt
  invoicedAt
  paidAt
  reversedAt
`;

const referralQueries = {
  GET_REFERRAL_OFFER: `
    query ReferralOffer($serviceId: ID!) {
      referralOffer(serviceId: $serviceId) {${REFERRAL_OFFER_FIELDS}}
    }
  `,
  GET_REFERRAL_MARKETPLACE: `
    query ReferralMarketplace($apporteurOrganizationId: ID!, $search: String, $limit: Int, $offset: Int) {
      referralMarketplace(apporteurOrganizationId: $apporteurOrganizationId, search: $search, limit: $limit, offset: $offset) {
        serviceId
        organizationId
        title
        price
        currency
        commissionRate
        approvalMode
        attributionDays
        terms
        partnershipStatus
      }
    }
  `,
  GET_REFERRAL_PARTNERSHIPS: `
    query ReferralPartnerships($organizationId: ID!, $role: String!, $status: [String!]) {
      referralPartnerships(organizationId: $organizationId, role: $role, status: $status) {${REFERRAL_PARTNERSHIP_FIELDS}}
    }
  `,
  GET_REFERRAL_COMMISSIONS: `
    query ReferralCommissions($organizationId: ID!, $role: String!, $status: [String!], $limit: Int, $offset: Int) {
      referralCommissions(organizationId: $organizationId, role: $role, status: $status, limit: $limit, offset: $offset) {${REFERRAL_COMMISSION_FIELDS}}
    }
  `,
  GET_REFERRAL_STATS: `
    query ReferralStats($organizationId: ID!, $role: String!) {
      referralStats(organizationId: $organizationId, role: $role) {
        orders30d
        commissionEarned30d
        commissionPaid
        commissionPending
        pendingRequests
        activePartnerships
        currency
      }
    }
  `,
  RESOLVE_REFERRAL_TOKEN: `
    query ResolveReferralToken($token: String!) {
      resolveReferralToken(token: $token) { valid serviceId attributionDays }
    }
  `,
};

export { referralQueries };
