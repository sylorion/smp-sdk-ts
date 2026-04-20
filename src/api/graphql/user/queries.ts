import { gql } from 'graphql-request';

// =========================================
// Source: user-space/profileQueries.ts
// =========================================
export const profileQueries = {
  // Query to get a single profile by ID
  GET_PROFILE: `
      query Profile($profileId: ID!) {
        profile(profileID: $profileId) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
          profilePictureID
          profilePicture {
            url
          }
        }
      }
    `,

  // Query to get all profiles
  GET_PROFILES: `
      query Profiles {
        profiles {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
          profilePictureID
          profilePicture {
            url
          }
        }
      }
    `,

  // Query to get a profile by slug
  GET_PROFILE_BY_SLUG: `
      query ProfileBySlug($slug: String!) {
        profileBySlug(Slug: $slug) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
          profilePictureID
          profilePicture {
            url
          }
        }
      }
    `,

  // Query to get a profile by uniqRef
  GET_PROFILE_BY_UNIQ_REF: `
      query ProfileByUniqRef($uniqRef: String!) {
        profileByUniqRef(uniqRef: $uniqRef) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
          profilePictureID
          profilePicture {
            url
          }
        }
      }
    `,

  // Query to get profiles by IDs
  GET_PROFILES_BY_IDS: `
      query ProfilesByIds($profileIDs: [ID!]!) {
        profilesByIDs(profileIDs: $profileIDs) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
          profilePictureID
          profilePicture {
            url
          }
        }
      }
    `,

  // Query to get profiles by slugs
  GET_PROFILES_BY_SLUGS: `
      query ProfilesBySlugs($slugs: [String!]!) {
        profilesBySlugs(slugs: $slugs) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
          profilePictureID
          profilePicture {
            url
          }
        }
      }
    `,
};

// =========================================
// Source: authentication/affiliateQueries.ts
// =========================================
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


// =========================================
// Source: authentication/userQueries.ts
// =========================================
export const userPlanQueries = {
  /**
   * Fetch the authenticated user's live plan data directly from the DB.
   * Bypasses the JWT token (which may be stale after a Stripe subscription event).
   *
   * Usage:
   *   const data = await gqlClient.request(userPlanQueries.GET_MY_PLAN, { userID });
   *   const { plan, stripeCustomerId, planTrialEndsAt, planExpiresAt } = data.getMyPlan;
   */
  GET_MY_PLAN: `
    query GetMyPlan($userID: ID!) {
      getMyPlan(userID: $userID) {
        userID
        plan
        planSubscriptionId
        planExpiresAt
        planTrialEndsAt
        stripeCustomerId
      }
    }
  `,
};


// =========================================
// Source: authentication/waitingListQueries.ts
// =========================================
export const waitingListQueries = {
  GET_WAITING_LIST: `
    query GetWaitingList($waitingListID: ID!) {
      waitingList(waitingListID: $waitingListID) {
        waitingListID
        uniqRef
        firstName
        lastName
        email
        city
        details
        age
        jwt
        mailSent
        lastMailSentAt
        state
        slug
        createdAt
        updatedAt
      }
    }
  `,

  GET_WAITING_LISTS: `
    query GetWaitingLists($page: Int, $limit: Int, $state: WaitingListState) {
      waitingLists(page: $page, limit: $limit, state: $state) {
        waitingListID
        uniqRef
        firstName
        lastName
        email
        city
        details
        age
        jwt
        mailSent
        lastMailSentAt
        state
        slug
        createdAt
        updatedAt
      }
    }
  `
};

export const preferenceQueries = {
  GET_USER_PREFERENCES: `
    query GetUserPreferences($userPreferencesID: ID!) {
      userPreferences(userPreferencesID: $userPreferencesID) {
        userPreferencesID
        userID
        lang
        timeZone
        notificationPreferences
        privacySettings
        theme
        marketplaceConfig
        defaultCurrency
        defaultPaymentMethodID
        notificationFrequency
        showRecommendations
        otherSettings
        onboardingData
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  GET_USER_PREFERENCES_BY_USER_ID: `
    query GetUserPreferencesByUserId($userID: String!) {
      userPreferencesByUserId(userID: $userID) {
        userPreferencesID
        userID
        lang
        timeZone
        notificationPreferences
        privacySettings
        theme
        marketplaceConfig
        defaultCurrency
        defaultPaymentMethodID
        notificationFrequency
        showRecommendations
        otherSettings
        onboardingData
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `
};
