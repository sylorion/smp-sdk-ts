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
  `
};

 