
// Définir des types ou interfaces pour les inputs complexes


interface CreatePostInput {
  title: string;
  content: string;
}


// Types de mutation existant
// TODO générer ces types à partir d'une moulinette qui prend le schema GraphQL général de la plateforme

interface LoginInput {
  email?: string;
  name: string;
}

interface UpdateUserInput {
  id: string;
  name: string;
}

// Structure complète de la mutation Login
type GraphQLMutationType = {
  login: {
    variables: { input: LoginInput },
    fields: {
      accessToken: string;
      refreshToken: string;
      accessValidityDuration: number;
      refreshValidityDuration: number;
      user: {
        userID: string;
        uniqRef: string;
        slug: string;
        username: string;
        email: string;
        plan: string;
        profileID: string;
        lastLogin: string;
        twoFactorEnabled: boolean;
        loginDuration: number;
        state: string;
        updatedAt: string;
      };
      errors: {
        message: string;
        field: string;
        code: string;
      }[];
    };
  };
};
