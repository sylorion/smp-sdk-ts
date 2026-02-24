import { APIClient } from '../../api/APIClient.js';
import { MUTATION_CREATE_USER } from '../../api/graphql/auth/mutations.js';

// Types d'input pour la création d'utilisateur
export interface CreateUserInput {
  username: string;
  userKind: string;
  twoFactorEnabled?: boolean | null;
  state: string;
  profileID?: string | null;
  plan?: string | null;
  password: string;
  email: string;
  rsaPublicKey?: string;
}

// Types de réponse pour la création d'utilisateur
export interface CreateUserResponse {
  userID: string;
  uniqRef: string;
  slug: string;
  username: string;
  email: string;
  plan?: string;
  profileID?: string;
  userKind: string;
  lastLogin?: string;
  twoFactorEnabled?: boolean;
  loginDuration?: number;
  rsaPublicKey?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export class Signup {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Crée un nouvel utilisateur
   * @param input Les données d'entrée pour créer un utilisateur
   * @returns Les informations de l'utilisateur créé
   */
  async create(input: CreateUserInput, affiliateToken?: string): Promise<CreateUserResponse> {
    const variables = { input, affiliateToken };
    try {
      const response = await this.client.mutate(MUTATION_CREATE_USER, variables) as { signup: CreateUserResponse };
      return response.signup;
    } catch (error) {
      console.error('Error in createUser:', error);
      throw error;
    }
  }
}