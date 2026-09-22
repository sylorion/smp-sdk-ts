import { preferenceMutations } from '../../api/graphql/user/mutations.js';
import { preferenceQueries } from '../../api/graphql/user/queries.js';
export class UserPreferencesController {
    constructor(client) {
        this.client = client;
    }
    async create(input) {
        const mutation = preferenceMutations.CREATE_USER_PREFERENCES;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createUserPreferences;
    }
    async update(userPreferencesID, input) {
        const mutation = preferenceMutations.UPDATE_USER_PREFERENCES;
        const variables = { userPreferencesID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateUserPreferences;
    }
    async getById(userPreferencesID) {
        const query = preferenceQueries.GET_USER_PREFERENCES;
        const variables = { userPreferencesID };
        const response = await this.client.query(query, variables);
        return response.userPreferences;
    }
    async getByUserId(userID) {
        const query = preferenceQueries.GET_USER_PREFERENCES_BY_USER_ID;
        const variables = { userID };
        const response = await this.client.query(query, variables);
        return response.userPreferencesByUserId;
    }
}
