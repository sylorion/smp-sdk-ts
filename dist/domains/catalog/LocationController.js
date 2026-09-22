import { placeQueries } from '../../api/graphql/catalog/queries.js';
import { placeMutations } from '../../api/graphql/catalog/mutations.js';
/**
 * The `Location` class manages place-related requests within the application.
 */
export class Location {
    constructor(client) {
        this.client = client;
    }
    //==========================  QUERIES  =============================================================
    /**
     * Fetches a single place by its ID.
     */
    async getById(placeId) {
        const query = placeQueries.GET_PLACE_BY_ID;
        const variables = { placeId };
        const response = await this.client.query(query, variables);
        return response.place;
    }
    //========================== MUTATIONS =============================================================
    /**
     * Creates a new place with the specified input.
     */
    async create(input) {
        const mutation = placeMutations.CREATE_PLACE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createPlace;
    }
    /**
     * Updates an existing place by its ID with the specified input.
     */
    async update(placeId, input) {
        const mutation = placeMutations.UPDATE_PLACE;
        const variables = { placeId, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updatePlace;
    }
}
