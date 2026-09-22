import { MUTATION_CREATE_USER } from '../api/graphql/mutations/authMutations.js';
export class Signup {
    constructor(client) {
        this.client = client;
    }
    /**
     * Crée un nouvel utilisateur
     * @param input Les données d'entrée pour créer un utilisateur
     * @returns Les informations de l'utilisateur créé
     */
    async createUser(input, affiliateToken) {
        const variables = { input, affiliateToken };
        try {
            const response = await this.client.mutate(MUTATION_CREATE_USER, variables);
            return response.signup;
        }
        catch (error) {
            console.error('Error in createUser:', error);
            throw error;
        }
    }
}
