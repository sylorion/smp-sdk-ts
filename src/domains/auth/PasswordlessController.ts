import { APIClient } from '../../api/APIClient.js';
import { authMutations } from '../../api/graphql/index.js';
import type { LogIn } from '../../types/auth/index.js';

const {
    MUTATION_REQUEST_MAGIC_LINK,
    MUTATION_LOGIN_WITH_MAGIC_LINK,
    MUTATION_REQUEST_BLITZ_SIGNUP,
    MUTATION_COMPLETE_BLITZ_SIGNUP,
} = authMutations;

export interface PasswordlessRequestResponse {
    success: boolean;
    message?: string;
}

/**
 * Connexion sans mot de passe (mu-authentication, 08/11) : lien magique pour tout compte, et
 * Blitzscription (inscription par la seule adresse e-mail). Les mutations qui ouvrent une session
 * répondent comme `login` : `user` absent et `errors` renseigné en cas de refus.
 */
export class Passwordless {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    /** Demande un lien de connexion. La réponse est la même que l'adresse ait un compte ou non. */
    async requestMagicLink(email: string): Promise<PasswordlessRequestResponse> {
        const response = await this.client.mutate(MUTATION_REQUEST_MAGIC_LINK, { input: { email } }) as { requestMagicLink: PasswordlessRequestResponse };
        return response.requestMagicLink;
    }

    /** Consomme un lien magique (`ml_…`) : session ouverte, ou `errors` renseigné. */
    async loginWithMagicLink(token: string): Promise<LogIn> {
        const response = await this.client.mutate(MUTATION_LOGIN_WITH_MAGIC_LINK, { token }) as { loginWithMagicLink: LogIn };
        return response.loginWithMagicLink;
    }

    /** Blitzscription, étape 1 : e-mail de confirmation. Rien n'est créé avant le clic. */
    async requestBlitzSignup(email: string): Promise<PasswordlessRequestResponse> {
        const response = await this.client.mutate(MUTATION_REQUEST_BLITZ_SIGNUP, { input: { email } }) as { requestBlitzSignup: PasswordlessRequestResponse };
        return response.requestBlitzSignup;
    }

    /** Blitzscription, étape 2 : compte créé et session ouverte, ou `errors` renseigné (lien invalide, compte déjà créé). */
    async completeBlitzSignup(token: string): Promise<LogIn> {
        const response = await this.client.mutate(MUTATION_COMPLETE_BLITZ_SIGNUP, { token }) as { completeBlitzSignup: LogIn };
        return response.completeBlitzSignup;
    }
}
