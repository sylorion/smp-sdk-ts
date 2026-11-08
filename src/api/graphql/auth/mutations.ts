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
          stripeCustomerId
          planSubscriptionId
          planTrialEndsAt
          planExpiresAt
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
  signupAfterInvitation(input: $input, organizationId: $organizationId, firstName: $firstName, lastName: $lastName) {
    username
    userID
    email
    plan
    deletedAt
    profileID
    state
  }
} `;


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
  `,

  CREATE_AFFILIATE_LINK: `
    mutation CreateAffiliateLink($input: CreateAffiliateLinkInput!) {
      createAffiliateLink(input: $input) {
        id
        token
        label
        isActive
        referrerUserId
        usageCount
        createdAt
      }
    }
  `,

  UPDATE_AFFILIATE_LINK: `
    mutation UpdateAffiliateLink($id: ID!, $input: UpdateAffiliateLinkInput!) {
      updateAffiliateLink(id: $id, input: $input) {
        id
        token
        label
        isActive
        usageCount
        updatedAt
      }
    }
  `,

  DELETE_AFFILIATE_LINK: `
    mutation DeleteAffiliateLink($id: ID!) {
      deleteAffiliateLink(id: $id) {
        success
        message
      }
    }
  `
};

export const MUTATION_UPDATE_USERNAME = /* GraphQL */ `
  mutation UpdateUsername($input: UpdateUsernameInput!) {
    updateUsername(input: $input) {
      success
      message
    }
  }
`;

export const MUTATION_UPDATE_PASSWORD = /* GraphQL */ `
  mutation UpdatePassword($input: UpdatePasswordInput!, $userID: ID!) {
    updatePassword(input: $input, userID: $userID) {
      success
      message
    }
  }
`;


// ─── Connexion sans mot de passe (08/11) : lien magique et Blitzscription ────────────────────

const PASSWORDLESS_LOGIN_FIELDS = /* GraphQL */ `
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
        }
        message
        errors {
          code
          field
          message
        }
`;

/** Demande d'un lien de connexion par e-mail pour un compte existant. Réponse neutre. */
export const MUTATION_REQUEST_MAGIC_LINK = /* GraphQL */ `
  mutation RequestMagicLink($input: EmailInput!) {
    requestMagicLink(input: $input) {
      success
      message
    }
  }
`;

/** Consomme un lien magique (jeton « ml_… », 15 min, usage unique) et ouvre une session. */
export const MUTATION_LOGIN_WITH_MAGIC_LINK = /* GraphQL */ `
  mutation LoginWithMagicLink($token: String!) {
    loginWithMagicLink(token: $token) {${PASSWORDLESS_LOGIN_FIELDS}    }
  }
`;

/** Blitzscription, étape 1 : e-mail de confirmation portant un jeton signé ; rien n'est créé avant le clic. */
export const MUTATION_REQUEST_BLITZ_SIGNUP = /* GraphQL */ `
  mutation RequestBlitzSignup($input: EmailInput!) {
    requestBlitzSignup(input: $input) {
      success
      message
    }
  }
`;

/** Blitzscription, étape 2 : le lien est cliqué, le compte est créé et une session ouverte. */
export const MUTATION_COMPLETE_BLITZ_SIGNUP = /* GraphQL */ `
  mutation CompleteBlitzSignup($token: String!) {
    completeBlitzSignup(token: $token) {${PASSWORDLESS_LOGIN_FIELDS}    }
  }
`;
