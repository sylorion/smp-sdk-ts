import { APIClient } from '../../api/APIClient.js';
import { preferenceMutations } from '../../api/graphql/user/mutations.js';
import { preferenceQueries } from '../../api/graphql/user/queries.js';
import {
    CreateUserPreferencesInput,
    UpdateUserPreferencesInput,
    UserPreferences
} from '../../types/user/index.js';

export class UserPreferencesController {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    async create(input: CreateUserPreferencesInput): Promise<UserPreferences> {
        const mutation = preferenceMutations.CREATE_USER_PREFERENCES;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables) as { createUserPreferences: UserPreferences };
        return response.createUserPreferences;
    }

    async update(userPreferencesID: string, input: UpdateUserPreferencesInput): Promise<UserPreferences> {
        const mutation = preferenceMutations.UPDATE_USER_PREFERENCES;
        const variables = { userPreferencesID, input };
        const response = await this.client.mutate(mutation, variables) as { updateUserPreferences: UserPreferences };
        return response.updateUserPreferences;
    }

    async getById(userPreferencesID: string): Promise<UserPreferences> {
        const query = preferenceQueries.GET_USER_PREFERENCES;
        const variables = { userPreferencesID };
        const response = await this.client.query(query, variables) as { userPreferences: UserPreferences };
        return response.userPreferences;
    }

    async getByUserId(userID: string): Promise<UserPreferences> {
        const query = preferenceQueries.GET_USER_PREFERENCES_BY_USER_ID;
        const variables = { userID };
        const response = await this.client.query(query, variables) as { userPreferencesByUserId: UserPreferences };
        return response.userPreferencesByUserId;
    }
}
