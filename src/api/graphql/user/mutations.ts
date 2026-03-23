import { gql } from 'graphql-request';

// =========================================
// Source: user-space/profileMutation.ts
// =========================================
const profileMutations = {
  // MUTATION TO CREATE A PROFILE
  CREATE_PROFILE: `
      mutation CreateProfile($input: CreateProfileInput!) {
        createProfile(input: $input) {
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

  // MUTATION TO UPDATE A PROFILE
  UPDATE_PROFILE: `
mutation UpdateProfile($input: UpdateProfileInput!, $profileId: ID!) {
  updateProfile(profileID: $profileId ,input: $input) {
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


  // MUTATION TO DELETE A PROFILE
  DELETE_PROFILE: `
      mutation DeleteProfile($profileID: ID!) {
        deleteProfile(profileID: $profileID) {
          success
          message
        }
      }
    `,
};

export { profileMutations };

// =========================================
// Source: authentication/affiliateMutations.ts
// =========================================
export const affiliateMutations = {
  GENERATE_AFFILIATE_TOKEN: `
    mutation GenerateAffiliateToken($input: GenerateAffiliateTokenInput!) {
      generateAffiliateToken(input: $input) {
        affiliateToken
        expiresAt
        message
        errors {
          message
        }
      }
    }
  `,

  CREATE_AFFILIATE: `
    mutation CreateAffiliate($input: CreateAffiliateInput!) {
      createAffiliate(input: $input) {
        affiliateId
        affiliateToken
        email
        isValidated
        referrerUserId
        createdAt
      }
    }
  `,

  DECODE_AFFILIATE_TOKEN: `
    mutation DecodeAffiliateToken($token: String!) {
      decodeAffiliateToken(token: $token) {
        referrerUserId
        referrerUsername
        type
        createdAt
        isValid
        message
      }
    }
  `
};


// =========================================
// Source: authentication/waitingListMutations.ts
// =========================================
export const waitingListMutations = {
  CREATE_WAITING_LIST: `
    mutation CreateWaitingList($input: WaitingListInput!) {
      createWaitingList(input: $input) {
        success
        message
        waitingList {
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
    }
  `,

  UPDATE_WAITING_LIST: `
    mutation UpdateWaitingList($waitingListID: ID!, $input: WaitingListInput!) {
      updateWaitingList(waitingListID: $waitingListID, input: $input) {
        success
        message
        waitingList {
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
    }
  `,

  DELETE_WAITING_LIST: `
    mutation DeleteWaitingList($waitingListID: ID!) {
      deleteWaitingList(waitingListID: $waitingListID) {
        success
        message
      }
    }
  `,

  CONFIRM_WAITING_LIST: `
    mutation ConfirmWaitingList($waitingListID: ID!) {
      confirmWaitingList(waitingListID: $waitingListID) {
        success
        message
        waitingList {
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
    }
  `,

  RESEND_WAITING_LIST_EMAIL: `
    mutation ResendWaitingListEmail($waitingListID: ID!) {
      resendWaitingListEmail(waitingListID: $waitingListID) {
        success
        message
        waitingList {
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
    }
  `,

  VERIFY_WAITING_LIST_TOKEN: `
    mutation VerifyWaitingListToken($token: String!) {
      verifyWaitingListToken(token: $token) {
        success
        message
        data {
          waitingListID
          firstName
          lastName
          email
          age
          isUserExists
          userState
        }
      }
    }
  `
};
export const MUTATION_AUTH_APP = /* GraphQL */`
  mutation AuthenticateApp($appLoginInput: AppLoginInput!) {
    authenticateApp(input: $appLoginInput) {
      accessToken
      refreshToken
      accessValidityDuration
      refreshValidityDuration
      application {
        applicationID
        uniqRef
        slug
        authKey
        appID
        description
        title
        email
        logo
        url
        plan
        isOfficialApp
        appConfiguration
        developerID
        authorID
        state
        createdAt
        updatedAt
      }
    }
  }
`;

export const MUTATION_AUTH_USER = /* GraphQL */ `
  mutation AuthenticateUser($loginInput: LoginInput!) {
    login(input: $loginInput) {
        accessToken  
        refreshToken  
        accessValidityDuration
        refreshValidityDuration
        user {
          userID        
          uniqRef       
          slug          
          username      
          email         
          plan          
          profileID    
          lastLogin     
          loginDuration  
          state         
          updatedAt     
          twoFactorEnabled 
      }
      message 
      errors {
        code
        field
        message
      }
    }
  }
`;

export const MUTATION_REFRESH_APP_TOKEN = /* GraphQL */ `
  mutation RefreshAppToken($refreshToken: String!) {
    refreshAppToken(token: $refreshToken) {
      accessToken
      expiresIn 
    } 
  }
`;

export const MUTATION_REFRESH_USER_TOKEN = /* GraphQL */ `
  mutation RefreshUserToken($refreshToken: String!) {
    refreshUserToken(token: $refreshToken) {
      accessToken
      expiresIn
    } 
  }
`;

export const MUTATION_AUTH_LOGOUT_USER = /* GraphQL */ `
  mutation logout($input: LogoutInput!) {
  logout(input: $input) {
    message
    success
  }
}
`;

export const MUTATION_AUTH_LOGOUT_APP = /* GraphQL */ `
  mutation LogoutApp($appID: ID!) {
    logoutApp(appID: $appID) {
      message
      success
    } 
  }
`;

export const MUTATION_CREATE_USER = /* GraphQL */ `
  mutation Signup($input: CreateUserInput!, $affiliateToken: String) {
    signup(input: $input, affiliateToken: $affiliateToken) {
      userID
      uniqRef
      slug
      username
      email
      plan
      profileID
      userKind
      lastLogin
      twoFactorEnabled
      loginDuration
      rsaPublicKey
      state
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const MUTATION_FORGOT_PASSWORD = /* GraphQL */ `
 mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email) {
    success
    message
    token
  }
}
`;

export const MUTATION_RESET_PASSWORD = /* GraphQL */ `
mutation resetPassword($input: ResetPasswordInput!) {
  resetPassword(input: $input) {
    success
    message
  }
}`;

export const MUTATION_SIGNUP_AFTER_INVITATION = /* GraphQL */ `
mutation SignupAfterInvitation($input: CreateUserInput!, $organizationId: ID!, $firstName: String, $lastName: String) {
  signupAfterInvitation(input: $input, organizationID: $organizationId, firstName: $firstName, lastName: $lastName) {
    username
    userID
    email
    plan
    deletedAt
    profileID
    state
  }
} `;



export const preferenceMutations = {
  CREATE_USER_PREFERENCES: `
    mutation CreateUserPreferences($input: CreateUserPreferencesInput!) {
      createUserPreferences(input: $input) {
        userPreferencesID
        userID
        onboardingData
      }
    }
  `,
  UPDATE_USER_PREFERENCES: `
    mutation UpdateUserPreferences($userPreferencesID: ID!, $input: UpdateUserPreferencesInput!) {
      updateUserPreferences(userPreferencesID: $userPreferencesID, input: $input) {
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
