import { APIClient } from '../../api/APIClient.js';
import { MUTATION_CREATE_USER } from '../../api/graphql/auth/mutations.js';
import { QUERY_CHECK_USERNAME_AVAILABILITY } from '../../api/graphql/auth/queries.js';

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
  acceptNewsletter?: boolean;
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
   * Vérifie la disponibilité d'un nom d'utilisateur
   * @param username Le nom d'utilisateur à vérifier
   * @returns La disponibilité et un message
   */
  async checkAvailability(username: string): Promise<{ available: boolean; message: string }> {
    const variables = { input: { username } };
    try {
      const response = await this.client.query(QUERY_CHECK_USERNAME_AVAILABILITY, variables) as { checkUsernameAvailability: { available: boolean; message: string } };
      return response.checkUsernameAvailability;
    } catch (error) {
      console.error('Error in checkAvailability:', error);
      throw error;
    }
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