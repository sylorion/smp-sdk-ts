import { APIClient } from '../../api/APIClient.js';
import { profileMutations, MUTATION_REQUEST_EMAIL_CHANGE, MUTATION_CONFIRM_EMAIL_CHANGE } from '../../api/graphql/user/mutations.js';
import { MUTATION_UPDATE_USERNAME } from '../../api/graphql/auth/mutations.js';
import { profileQueries } from '../../api/graphql/user/queries.js';
import {
  CreateProfileInput,
  UpdateProfileInput,
  ProfileEntity
} from '../../types/user/index.js';

interface MutationResponse {
  success: boolean;
  message: string;
}

// Contrôleur des mutations et des requêtes pour les profils
export class Profile {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ======================= MUTATIONS =======================

  async create(input: CreateProfileInput): Promise<ProfileEntity> {
    const mutation = profileMutations.CREATE_PROFILE;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createProfile: ProfileEntity };
    return response.createProfile;
  }

  async update(profileId: string, input: UpdateProfileInput): Promise<ProfileEntity> {
    const mutation = profileMutations.UPDATE_PROFILE;
    const variables = { profileId, input, };
    const response = await this.client.mutate(mutation, variables) as { updateProfile: ProfileEntity };
    return response.updateProfile;
  }

  async delete(profileID: string): Promise<MutationResponse> {
    const mutation = profileMutations.DELETE_PROFILE;
    const variables = { profileID };
    const response = await this.client.mutate(mutation, variables) as { deleteProfile: MutationResponse };
    return response.deleteProfile;
  }

  async updateUsername(newUsername: string): Promise<MutationResponse> {
    const variables = { input: { newUsername } };
    const response = await this.client.mutate(MUTATION_UPDATE_USERNAME, variables) as { updateUsername: MutationResponse };
    return response.updateUsername;
  }

  // ======================= QUERIES =======================

  async getById(profileId: string): Promise<ProfileEntity> {
    const query = profileQueries.GET_PROFILE;
    const variables = { profileId };
    const response = await this.client.query(query, variables) as { profile: ProfileEntity };
    return response.profile;
  }

  async getByUserId(userID: string): Promise<ProfileEntity[]> {
    const query = profileQueries.GET_PROFILES_BY_USER_ID;
    const response = await this.client.query(query, { userID }) as { profilesByUserID: ProfileEntity[] };
    return response.profilesByUserID ?? [];
  }

  async list(): Promise<ProfileEntity[]> {
    const query = profileQueries.GET_PROFILES;
    const response = await this.client.query(query) as { profiles: ProfileEntity[] };
    return response.profiles;
  }

  async getBySlug(slug: string): Promise<ProfileEntity> {
    const query = profileQueries.GET_PROFILE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { profileBySlug: ProfileEntity };
    return response.profileBySlug;
  }

  async getByUniqRef(uniqRef: string): Promise<ProfileEntity> {
    const query = profileQueries.GET_PROFILE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { profileByUniqRef: ProfileEntity };
    return response.profileByUniqRef;
  }

  async getByIds(profileIDs: string[]): Promise<ProfileEntity[]> {
    const query = profileQueries.GET_PROFILES_BY_IDS;
    const variables = { profileIDs };
    const response = await this.client.query(query, variables) as { profilesByIDs: ProfileEntity[] };
    return response.profilesByIDs;
  }

  async getBySlugs(slugs: string[]): Promise<ProfileEntity[]> {
    const query = profileQueries.GET_PROFILES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { profilesBySlugs: ProfileEntity[] };
    return response.profilesBySlugs;
  }

  // ======================= EMAIL CHANGE =======================

  async requestEmailChange(input: { newEmail: string; password: string }, userID: string): Promise<MutationResponse> {
    const variables = { input, userID };
    const response = await this.client.mutate(MUTATION_REQUEST_EMAIL_CHANGE, variables) as { requestEmailChange: MutationResponse };
    return response.requestEmailChange;
  }

  async confirmEmailChange(input: { code: string }, userID: string): Promise<MutationResponse> {
    const variables = { input, userID };
    const response = await this.client.mutate(MUTATION_CONFIRM_EMAIL_CHANGE, variables) as { confirmEmailChange: MutationResponse };
    return response.confirmEmailChange;
  }
}
