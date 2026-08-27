import { APIClient } from '../../api/APIClient.js';
import { organizationMutations } from '../../api/graphql/organization/mutations.js';
import { authMutations } from '../../api/graphql/index.js';
const { MUTATION_SIGNUP_AFTER_INVITATION } = authMutations;
import { organizationQueries } from '../../api/graphql/organization/queries.js';





// Types des réponses
export interface AddUserToOrganizationResponse {
  success: boolean;
  message: string;
  token?: string;
  email?: string;
  organizationID?: string;
  organizationName?: string;
  firstName?: string;
  lastName?: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  email: string;
  organizationID: string;
  userExists: boolean;
  userID: string | null;
  firstName?: string;
  lastName?: string;
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
  firstName?: string;
  lastName?: string;
  organizationName?: string;
  state: string;
}

// Types des inputs
export interface InviteUserToOrganizationInput {
  email?: string;
  userID?: string;
  callerUserID?: string;
  organizationID: string;
  message?: string;
  firstName?: string;
  lastName?: string;
}

export interface CreateUserOrganizationInput {
  userID: string;
  organizationID: string;
  roleID: string;
}

export interface VerifyInvitationTokenInput {
  token: string;
}

export interface CreateUserInput {
  username: string;
  userKind: string;
  twoFactorEnabled?: boolean | null;
  state: string;
  profileID?: string | null;
  plan?: string | null;
  password: string;
  email: string;
  rsaPublicKey?: string;
  acceptNewsletter?: boolean;
}

/** 
 * The `OrganizationMember` interface represents a member of an organization.
*/
export interface OrganizationMember {
  userID: string;
  role: string;
  username: string;
  email: string;
  name: string;
  lastname: string;
  joinedAt: string;
  profilePicture?: string;
  isInvitation?: boolean;
  invitedAt?: string;
  expiresAt?: string;
  jobTitle?: string;
  missionDescription?: string;
}
/**
 * The `OrganizationMembers` interface represents the response of the `listOrganizationMembers` query.
 */
export interface OrganizationMembers {
  members: OrganizationMember[];
  totalMembers: number;
}

export interface UpdateUserRoleInOrganizationInput {
  organizationID: string;
  userID: string;
  newRoleID: string;
  /** UserID du membre qui effectue l'action — injecté côté serveur, optionnel ici */
  callerUserID?: string;
}

export interface UpdateUserRoleInOrganizationResponse {
  success: boolean;
  message: string;
}

export interface UserRole {
  roleID: string;
  roleName: string;
}

export interface OrganizationMedia {
  mediaID: string;
  url: string;
  state: string;
  originalName: string;
}

export interface OrganizationsByUserResponse {
  organizationID: string;
  organizationName: string;
  organizationMedia: OrganizationMedia[];
  userRole: UserRole;
  sectorID?: string;
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
  async inviteUser(input: InviteUserToOrganizationInput): Promise<AddUserToOrganizationResponse> {
    const mutation = organizationMutations.INVITE_USER_TO_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { inviteUserToOrganization: AddUserToOrganizationResponse };
    return response.inviteUserToOrganization;
  }

  /**
   * Creates a new user-organization relationship.
   */
  async createMember(input: CreateUserOrganizationInput): Promise<AddUserToOrganizationResponse> {
    const mutation = organizationMutations.CREATE_USER_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { addUserToOrganization: AddUserToOrganizationResponse };
    return response.addUserToOrganization;
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
  async signupAfterInvitation(input: CreateUserInput, organizationId: string, firstName?: string, lastName?: string): Promise<SignupAfterInvitationResponse> {
    const mutation = MUTATION_SIGNUP_AFTER_INVITATION;
    const variables = { input, organizationId, firstName, lastName };
    const response = await this.client.mutate(mutation, variables) as { signupAfterInvitation: SignupAfterInvitationResponse };
    return response.signupAfterInvitation;
  }

  async updateUserRole(input: UpdateUserRoleInOrganizationInput): Promise<UpdateUserRoleInOrganizationResponse> {
    const mutation = organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { updateUserRoleInOrganization: UpdateUserRoleInOrganizationResponse };
    return response.updateUserRoleInOrganization;
  }

  async removeUser(input: { userID: string; organizationID: string }): Promise<AddUserToOrganizationResponse> {
    const mutation = organizationMutations.REMOVE_USER_FROM_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { removeUserFromOrganization: AddUserToOrganizationResponse };
    return response.removeUserFromOrganization;
  }

  async removeInvitation(input: { email: string; organizationID: string }): Promise<AddUserToOrganizationResponse> {
    const mutation = organizationMutations.REMOVE_INVITATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { removeInvitation: AddUserToOrganizationResponse };
    return response.removeInvitation;
  }

  /**
   * Adds a user to an organization.
   */
  async addUser(input: { userID: string; organizationID: string; role: string }): Promise<AddUserToOrganizationResponse> {
    const mutation = organizationMutations.ADD_USER_TO_ORGANIZATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { addUserToOrganization: AddUserToOrganizationResponse };
    return response.addUserToOrganization;
  }

  // ========================== QUERIES =============================================================

  /** 
   * Lists the members of an organization.
   * @param organizationId The ID of the organization.
   * @returns The list of members of the organization.
    */
  async listMembers(organizationId: string): Promise<OrganizationMembers> {
    const query = organizationQueries.GET_ORGANIZATION_MEMBERS;
    const variables = { organizationId };
    const response = await this.client.query(query, variables) as { listOrganizationMembers: OrganizationMembers };
    return response.listOrganizationMembers;
  }

  async listByUserId(userId: string): Promise<OrganizationsByUserResponse[]> {
    const query = organizationQueries.GET_USER_ORGANIZATIONS;
    const variables = { userId };
    const response = await this.client.query(query, variables) as { getUserOrganizations: OrganizationsByUserResponse[] };
    return response.getUserOrganizations;
  }

  // ========================== NEW: Role Verification ==========================

  async verifyUserRole(input: { userID: string; organizationID: string }): Promise<VerifyUserRoleResponse> {
    const query = organizationQueries.VERIFY_USER_ROLE;
    const variables = { input };
    const response = await this.client.query(query, variables) as { verifyUserRole: VerifyUserRoleResponse };
    return response.verifyUserRole;
  }

  // ========================== NEW: User Search ==========================

  async searchUsers(query: string, limit: number = 10): Promise<SearchUsersResult[]> {
    const gqlQuery = organizationQueries.SEARCH_USERS;
    const variables = { query, limit };
    const response = await this.client.query(gqlQuery, variables) as { searchUsers: SearchUsersResult[] };
    return response.searchUsers;
  }

  // ========================== NEW: Member Profile ==========================

  async getMemberProfile(organizationID: string, userID: string): Promise<MemberProfileResponse> {
    const query = organizationQueries.GET_MEMBER_PROFILE;
    const variables = { organizationID, userID };
    const response = await this.client.query(query, variables) as { getMemberProfile: MemberProfileResponse };
    return response.getMemberProfile;
  }

  async updateMemberProfile(input: UpdateMemberProfileInput): Promise<MemberProfileResponse> {
    const mutation = organizationMutations.UPDATE_MEMBER_PROFILE;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { updateMemberProfile: MemberProfileResponse };
    return response.updateMemberProfile;
  }

  // ========================== NEW: Resend Invitation ==========================

  async resendInvitation(input: { email: string; organizationID: string }): Promise<ResendInvitationResponse> {
    const mutation = organizationMutations.RESEND_INVITATION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { resendInvitation: ResendInvitationResponse };
    return response.resendInvitation;
  }

  // ========================== NEW: Owner Transfer ==========================

  /**
   * Initiates an owner transfer. Sends an OTP to the current owner's email.
   */
  async initiateOwnerTransfer(input: InitiateOwnerTransferInput): Promise<OwnerTransferResponse> {
    const mutation = organizationMutations.INITIATE_OWNER_TRANSFER;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { initiateOwnerTransfer: OwnerTransferResponse };
    return response.initiateOwnerTransfer;
  }

  /**
   * Validates the OTP and completes the owner transfer.
   * The former owner is demoted to Admin, the target becomes the new Owner.
   */
  async validateOwnerTransfer(input: ValidateOwnerTransferInput): Promise<OwnerTransferResponse> {
    const mutation = organizationMutations.VALIDATE_OWNER_TRANSFER;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { validateOwnerTransfer: OwnerTransferResponse };
    return response.validateOwnerTransfer;
  }
}

// ========================== NEW INTERFACES ==========================

export interface VerifyUserRoleResponse {
  success: boolean;
  role?: string;
  roleID?: string;
  message?: string;
}

export interface SearchUsersResult {
  userID: string;
  username: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
}

export interface MemberProfileResponse {
  success: boolean;
  message?: string;
  userID?: string;
  jobTitle?: string;
  missionDescription?: string;
}

export interface UpdateMemberProfileInput {
  organizationID: string;
  targetUserID: string;
  callerUserID: string;
  jobTitle?: string;
  missionDescription?: string;
}

export interface ResendInvitationResponse {
  success: boolean;
  message?: string;
  token?: string;
}

// ========================== NEW: Owner Transfer Interfaces ==========================

export interface InitiateOwnerTransferInput {
  organizationID: string;
  /** UserID de l'Owner actuel qui initie le transfert */
  callerUserID: string;
  /** UserID du membre cible qui deviendra le nouvel Owner */
  targetUserID: string;
}

export interface ValidateOwnerTransferInput {
  organizationID: string;
  /** UserID de l'Owner actuel (doit correspondre à l'initiateur) */
  callerUserID: string;
  /** UserID du membre cible */
  targetUserID: string;
  /** Code OTP 6 chiffres reçu par e-mail */
  otpCode: string;
}

export interface OwnerTransferResponse {
  success: boolean;
  message?: string;
}