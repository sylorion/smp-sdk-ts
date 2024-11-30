import { APIClient } from '../api/APIClient';
import { profileMutations } from './../api/graphql/mutations/user-space/profileMutation';

// Types d'entrée pour les mutations des profils
export interface CreateProfileInput {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 format
  gender: string; // ProfileGender
  nationality: string;
  phoneNumber: string;
  locationID: string;
  idCardNumber?: string;
  passportNumber?: string;
  socialSecurityNumber?: string;
  state: string; // ObjectStatus
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  phoneNumber?: string;
  locationID?: string;
  idCardNumber?: string;
  passportNumber?: string;
  socialSecurityNumber?: string;
  state?: string; // ObjectStatus
}

// Types de réponse pour les mutations
export interface ProfileEntity {
  profileID: string;
  uniqRef: string;
  slug: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phoneNumber: string;
  locationID: string;
  idCardNumber?: string;
  passportNumber?: string;
  socialSecurityNumber?: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface MutationResponse {
  success: boolean;
  message: string;
}

// Contrôleur des mutations pour les profils
export class ProfileController {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  async createProfile(input: CreateProfileInput): Promise<ProfileEntity> {
    const mutation = profileMutations.CREATE_PROFILE;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createProfile: ProfileEntity };
    return response.createProfile;
  }

  async updateProfile(profileID: string, input: UpdateProfileInput): Promise<ProfileEntity> {
    const mutation = profileMutations.UPDATE_PROFILE;
    const variables = { profileID, input };
    const response = await this.client.mutate(mutation, variables) as { updateProfile: ProfileEntity };
    return response.updateProfile;
  }

  async deleteProfile(profileID: string): Promise<MutationResponse> {
    const mutation = profileMutations.DELETE_PROFILE;
    const variables = { profileID };
    const response = await this.client.mutate(mutation, variables) as { deleteProfile: MutationResponse };
    return response.deleteProfile;
  }
}
