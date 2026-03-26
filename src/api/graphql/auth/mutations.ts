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

