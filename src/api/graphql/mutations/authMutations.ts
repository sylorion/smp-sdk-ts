
export const MUTATION_AUTH_APP = `
  mutation AuthenticateApp($appId: String!, $appSecret: String!) {
    authenticateApp(appId: $appId, appSecret: $appSecret) {
      token
      refreshToken
    }
  }
`;

export const MUTATION_AUTH_USER = `
  mutation AuthenticateUser($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      refreshToken
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
    refreshUserToken(refreshToken: $refreshToken) {
      token
    }
  }
`;

