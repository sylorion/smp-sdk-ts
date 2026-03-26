export const affiliateQueries = {
  GET_AFFILIATES_BY_REFERRER: `
    query AffiliatesByReferrer($referrerUserId: ID!) {
      affiliatesByReferrer(referrerUserId: $referrerUserId) {
        affiliateId
        uniqRef
        slug
        referrerUserId
        referredUserId
        referredUser {
          userID
          username
          email
          profileID
          loginDuration
          lastLogin
        }
        affiliateToken
        email
        isValidated
        validatedAt
        expiresAt
        commissionRate
        metadata
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_AFFILIATE_LINKS_BY_REFERRER: `
    query AffiliateLinksByReferrer($referrerUserId: ID!) {
      affiliateLinksByReferrer(referrerUserId: $referrerUserId) {
        id
        token
        label
        isActive
        referrerUserId
        usageCount
        createdAt
        updatedAt
      }
    }
  `,

  GET_AFFILIATE_LINK_BY_TOKEN: `
    query AffiliateLinkByToken($token: String!) {
      affiliateLinkByToken(token: $token) {
        id
        token
        label
        isActive
        referrerUserId
        usageCount
        createdAt
        updatedAt
      }
    }
  `
};

