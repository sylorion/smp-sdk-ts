import { socialMutations } from '../../api/graphql/user/socialMutations.js';
import { socialQueries } from '../../api/graphql/user/socialQueries.js';
export class Social {
    constructor(client) {
        this.client = client;
    }
    /**
     * Toggle like for a service
     */
    async toggleLike(userID, serviceID) {
        const mutation = socialMutations.TOGGLE_LIKE;
        const variables = { userID, serviceID };
        const response = await this.client.mutate(mutation, variables);
        return response.toggleLike;
    }
    /**
     * Toggle favorite for a service
     */
    async toggleFavorite(userID, serviceID) {
        const mutation = socialMutations.TOGGLE_FAVORITE;
        const variables = { userID, serviceID };
        const response = await this.client.mutate(mutation, variables);
        return response.toggleFavorite;
    }
    /**
     * Get interaction status (liked/favorited) for a user on a service
     */
    async getStatus(userID, serviceID) {
        const query = socialQueries.GET_INTERACTION_STATUS;
        const variables = { userID, serviceID };
        const response = await this.client.query(query, variables);
        return response.interactionStatus;
    }
}
