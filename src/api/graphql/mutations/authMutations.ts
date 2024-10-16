
export const MUTATION_AUTH_APP = /* GraphQL */`
  mutation AuthenticateApp($appLoginInput: AppLoginInput!) {
    authenticateApp(input: $appLoginInput) {
      accessToken
      refreshToken
      accessValidityDuration
      refreshValidityDuration
      app {
        applicationID
        uniqRef
        slug
        authKey
        authID
        description
        name
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
  mutation LogoutUser($userID: ID!) {
    logoutUser(userID: $userID) {
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

