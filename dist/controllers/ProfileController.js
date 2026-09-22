import { profileMutations } from './../api/graphql/mutations/user-space/profileMutation.js';
import { profileQueries } from './../api/graphql/queries/user-space/profileQueries.js';
// Contrôleur des mutations et des requêtes pour les profils
export class Profile {
    constructor(client) {
        this.client = client;
    }
    // ======================= MUTATIONS =======================
    async createProfile(input) {
        const mutation = profileMutations.CREATE_PROFILE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createProfile;
    }
    async updateProfile(profileId, input) {
        const mutation = profileMutations.UPDATE_PROFILE;
        const variables = { profileId, input, };
        const response = await this.client.mutate(mutation, variables);
        return response.updateProfile;
    }
    async deleteProfile(profileID) {
        const mutation = profileMutations.DELETE_PROFILE;
        const variables = { profileID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteProfile;
    }
    // ======================= QUERIES =======================
    async getProfile(profileId) {
        const query = profileQueries.GET_PROFILE;
        const variables = { profileId };
        const response = await this.client.query(query, variables);
        return response.profile;
    }
    async list() {
        const query = profileQueries.GET_PROFILES;
        const response = await this.client.query(query);
        return response.profiles;
    }
    async getProfileBySlug(slug) {
        const query = profileQueries.GET_PROFILE_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.profileBySlug;
    }
    async getProfileByUniqRef(uniqRef) {
        const query = profileQueries.GET_PROFILE_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.profileByUniqRef;
    }
    async getProfilesByIds(profileIDs) {
        const query = profileQueries.GET_PROFILES_BY_IDS;
        const variables = { profileIDs };
        const response = await this.client.query(query, variables);
        return response.profilesByIDs;
    }
    async getProfilesBySlugs(slugs) {
        const query = profileQueries.GET_PROFILES_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.profilesBySlugs;
    }
}
