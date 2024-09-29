
export const MUTATION_AUTH_APP = `
  mutation AuthenticateApp($appId: String!, $appSecret: String!) {
    authenticateApp(appId: $appId, appSecret: $appSecret) {
      token
      refreshToken
    }
  }
`;

export const MUTATION_AUTH_USER = `
  mutation AuthenticateUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        accessToken  
        refreshToken  
        accessValidityDuration
        details {
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

export const MUTATION_REFRESH_APP_TOKEN = `
  mutation RefreshAppToken {
    refreshAppToken {
      appToken
    }
  }
`;

export const MUTATION_REFRESH_USER_TOKEN = `
  mutation RefreshUserToken($refreshToken: String!) {
    refreshUserToken(refreshUserToken: $refreshToken) {
      accessToken
      expiresIn
    } 
  }
`;

export const MUTATION_AUTH_LOGOUT_USER = `
  mutation LogoutUser($userID: ID!) {
    logoutUser(userID: $userID) {
      message
      success
    } 
  }
`;

export const MUTATION_AUTH_LOGOUT_APP = `
  mutation LogoutApp($appID: ID!) {
    logoutApp(appID: $appID) {
      message
      success
    } 
  }
`;

