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

export const QUERY_CHECK_USERNAME_AVAILABILITY = /* GraphQL */ `
  query CheckUsernameAvailability($input: CheckUsernameInput!) {
    checkUsernameAvailability(input: $input) {
      available
      message
    }
  }
`;

// ─── Admin Queries (mu-authentication) ───────────────────────────────────────
// These queries hit the authentication service directly and have NO state filter.
// They allow searching all users regardless of their state (online/awaiting/suspended).

export const adminAuthQueries = {
  ADMIN_SEARCH_USERS: /* GraphQL */ `
    query AdminSearchUsers($query: String!, $limit: Float) {
      adminSearchUsers(query: $query, limit: $limit) {
        userID
        username
        email
        plan
        state
        createdAt
      }
    }
  `,

  ADMIN_GET_USER_BY_ID: /* GraphQL */ `
    query AdminGetUserByID($userID: ID!) {
      adminGetUserByID(userID: $userID) {
        userID
        username
        email
        plan
        state
        createdAt
        updatedAt
      }
    }
  `,

  ADMIN_GET_USER_BY_EMAIL: /* GraphQL */ `
    query AdminGetUserByEmail($email: String!) {
      adminGetUserByEmail(email: $email) {
        userID
        username
        email
        plan
        state
        createdAt
        updatedAt
      }
    }
  `,

  ADMIN_GET_PLAN_STATS: /* GraphQL */ `
    query AdminGetPlanStats {
      adminGetPlanStats {
        plan
        count
      }
    }
  `,

  ADMIN_GET_USER_COUNT: /* GraphQL */ `
    query AdminGetUserCount {
      adminGetUserCount
    }
  `,
};


