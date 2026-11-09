import { APIClient } from '../../api/APIClient.js';

export const MUTATION_ENSURE_USER_SPACE = /* GraphQL */ `
  mutation EnsureUserSpace($userID: ID!, $profileID: ID, $email: String, $username: String) {
    ensureUserSpace(userID: $userID, profileID: $profileID, email: $email, username: $username) {
      profileID
      profileRepaired
      preferencesCreated
    }
  }
`;

export const MUTATION_ENSURE_SIGNUP_WALLET = /* GraphQL */ `
  mutation EnsureSignupWallet($userID: ID!) {
    ensureSignupWallet(userID: $userID) { walletId created }
  }
`;

export interface UserSpaceBootstrap {
  profileID: string;
  profileRepaired: boolean;
  preferencesCreated: boolean;
}

export interface SignupWalletEnsured {
  walletId: string;
  created: boolean;
}

/**
 * Filet de sécurité de l'inscription (mu-user-space, mu-wallet) : profil, préférences et wallet d'un
 * compte garantis, créés s'ils manquent, sans rien réécrire. **Réservé aux services internes** : le
 * client doit porter `x-smp-internal-secret` (sinon refus).
 */
export class AccountBootstrapController {
  constructor(private readonly client: APIClient) { }

  async ensureUserSpace(input: { userID: string; profileID?: string | null; email?: string | null; username?: string | null }): Promise<UserSpaceBootstrap> {
    const response = await this.client.mutate(MUTATION_ENSURE_USER_SPACE, {
      userID: input.userID,
      profileID: input.profileID ?? null,
      email: input.email ?? null,
      username: input.username ?? null,
    }) as { ensureUserSpace: UserSpaceBootstrap };
    return response.ensureUserSpace;
  }

  async ensureSignupWallet(userID: string): Promise<SignupWalletEnsured> {
    const response = await this.client.mutate(MUTATION_ENSURE_SIGNUP_WALLET, { userID }) as { ensureSignupWallet: SignupWalletEnsured };
    return response.ensureSignupWallet;
  }
}
