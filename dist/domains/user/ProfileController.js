import { profileMutations, MUTATION_REQUEST_EMAIL_CHANGE, MUTATION_CONFIRM_EMAIL_CHANGE } from '../../api/graphql/user/mutations.js';
import { MUTATION_UPDATE_USERNAME } from '../../api/graphql/auth/mutations.js';
import { profileQueries } from '../../api/graphql/user/queries.js';
// Contrôleur des mutations et des requêtes pour les profils
export class Profile {
    constructor(client) {
        this.client = client;
    }
    // ======================= MUTATIONS =======================
    async create(input) {
        const mutation = profileMutations.CREATE_PROFILE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createProfile;
    }
    async update(profileId, input) {
        const mutation = profileMutations.UPDATE_PROFILE;
        const variables = { profileId, input, };
        const response = await this.client.mutate(mutation, variables);
        return response.updateProfile;
    }
    async delete(profileID) {
        const mutation = profileMutations.DELETE_PROFILE;
        const variables = { profileID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteProfile;
    }
    async updateUsername(newUsername) {
        const variables = { input: { newUsername } };
        const response = await this.client.mutate(MUTATION_UPDATE_USERNAME, variables);
        return response.updateUsername;
    }
    // ======================= QUERIES =======================
    async getById(profileId) {
        const query = profileQueries.GET_PROFILE;
        const variables = { profileId };
        const response = await this.client.query(query, variables);
        return response.profile;
    }
    async getByUserId(userID) {
        const query = profileQueries.GET_PROFILES_BY_USER_ID;
        const response = await this.client.query(query, { userID });
        return response.profilesByUserID ?? [];
    }
    async list() {
        const query = profileQueries.GET_PROFILES;
        const response = await this.client.query(query);
        return response.profiles;
    }
    async getBySlug(slug) {
        const query = profileQueries.GET_PROFILE_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.profileBySlug;
    }
    async getByUniqRef(uniqRef) {
        const query = profileQueries.GET_PROFILE_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.profileByUniqRef;
    }
    async getByIds(profileIDs) {
        const query = profileQueries.GET_PROFILES_BY_IDS;
        const variables = { profileIDs };
        const response = await this.client.query(query, variables);
        return response.profilesByIDs;
    }
    async getBySlugs(slugs) {
        const query = profileQueries.GET_PROFILES_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.profilesBySlugs;
    }
    // ======================= EMAIL CHANGE =======================
    async requestEmailChange(input, userID) {
        const variables = { input, userID };
        const response = await this.client.mutate(MUTATION_REQUEST_EMAIL_CHANGE, variables);
        return response.requestEmailChange;
    }
    async confirmEmailChange(input, userID) {
        const variables = { input, userID };
        const response = await this.client.mutate(MUTATION_CONFIRM_EMAIL_CHANGE, variables);
        return response.confirmEmailChange;
    }
}
