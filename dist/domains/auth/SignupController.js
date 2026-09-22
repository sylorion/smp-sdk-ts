import { logger } from '../../utils/Logger.js';
import { MUTATION_CREATE_USER } from '../../api/graphql/auth/mutations.js';
import { QUERY_CHECK_USERNAME_AVAILABILITY } from '../../api/graphql/auth/queries.js';
export class Signup {
    constructor(client) {
        this.client = client;
    }
    /**
     * Vérifie la disponibilité d'un nom d'utilisateur
     * @param username Le nom d'utilisateur à vérifier
     * @returns La disponibilité et un message
     */
    async checkAvailability(username) {
        const variables = { input: { username } };
        try {
            const response = await this.client.query(QUERY_CHECK_USERNAME_AVAILABILITY, variables);
            return response.checkUsernameAvailability;
        }
        catch (error) {
            logger.error('Error in checkAvailability:', error);
            throw error;
        }
    }
    /**
     * Crée un nouvel utilisateur
     * @param input Les données d'entrée pour créer un utilisateur
     * @returns Les informations de l'utilisateur créé
     */
    async create(input, affiliateToken) {
        const variables = { input, affiliateToken };
        try {
            const response = await this.client.mutate(MUTATION_CREATE_USER, variables);
            return response.signup;
        }
        catch (error) {
            logger.error('Error in createUser:', error);
            throw error;
        }
    }
}
