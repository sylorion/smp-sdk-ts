import { APIClient } from '../api/APIClient';
import { organizationMutations } from './../api/graphql/mutations/organization/organizationMutation';
import {MUTATION_SIGNUP_AFTER_INVITATION} from './../api/graphql/mutations/authMutations'





// Types des réponses
export interface AddUserToOrganizationResponse {
    success: boolean;
    message: string;
  }
  
  export interface InvitationResponse {
    success: boolean;
    message: string;
    email: string;
    organizationID: string;
    userExists: boolean;
  }
  
  export interface CreateUserOrganizationResponse {
    userOrganizationID: string;
    uniqRef: string;
    slug: string;
    authorID: string;
    legend: string;
    userID: string;
    roleID: string;
    organizationID: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  }
  
  export interface SignupAfterInvitationResponse {
    username: string;
    userID: string;
    email: string;
    deletedAt?: string;
    profileID: string;
    state: string;
  }
  
  // Types des inputs
  export interface InviteUserToOrganizationInput {
    email: string;
    organizationID: string;
    message: string;
  }
  
  export interface CreateUserOrganizationInput {
    // Définissez ici les champs nécessaires pour créer une relation utilisateur-organisation
    userID: string;
    organizationID: string;
    roleID: string;
  }
  
  export interface VerifyInvitationTokenInput {
    token: string;
  }
  
  export interface CreateUserInput {
    // Définissez ici les champs nécessaires pour l'inscription d'un utilisateur
    username: string;
    email: string;
    password: string;
  }
/**
 * The `MemberOrganization` class manages member-organization-related requests within the application.
 */
export class ManageOrganization {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ========================== MUTATIONS =============================================================

  /**
   * Invites a user to an organization.
   */
  async inviteUserToOrganization(input: InviteUserToOrganizationInput): Promise<AddUserToOrganizationResponse> {
    const mutation = organizationMutations.INVITE_USER_TO_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { inviteUserToOrganization: AddUserToOrganizationResponse };
    return response.inviteUserToOrganization;
  }

  /**
   * Creates a new user-organization relationship.
   */
  async createUserOrganization(input: CreateUserOrganizationInput): Promise<CreateUserOrganizationResponse> {
    const mutation = organizationMutations.CREATE_USER_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createUserOrganization: CreateUserOrganizationResponse };
    return response.createUserOrganization;
  }
  
  /**
   * Verifies an invitation token.
   */
  async verifyInvitationToken(input: VerifyInvitationTokenInput): Promise<InvitationResponse> {
    const mutation = organizationMutations.VERIFY_INVITATION_TOKEN;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { verifyInvitationToken: InvitationResponse };
    return response.verifyInvitationToken;
  }

  /**
   * Allows a user to sign up after receiving an invitation.
   */
  async signupAfterInvitation(input: CreateUserInput, organizationId: string): Promise<SignupAfterInvitationResponse> {
    const mutation = MUTATION_SIGNUP_AFTER_INVITATION;
    const variables = { input, organizationId };
    const response = await this.client.mutate(mutation, variables) as { signupAfterInvitation: SignupAfterInvitationResponse };
    return response.signupAfterInvitation;
  }
}