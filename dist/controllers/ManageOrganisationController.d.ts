import { APIClient } from '../api/APIClient.js';
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
export interface InviteUserToOrganizationInput {
    email: string;
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
    sectorID?: string;
    smallLogoUrl?: string;
    organizationMedia?: OrganizationMedia[];
    userRole: UserRole;
}
/**
 * The `MemberOrganization` class manages member-organization-related requests within the application.
 */
export declare class ManageOrganization {
    private client;
    constructor(client: APIClient);
    /**
     * Invites a user to an organization.
     */
    inviteUserToOrganization(input: InviteUserToOrganizationInput): Promise<AddUserToOrganizationResponse>;
    /**
     * Creates a new user-organization relationship.
     */
    createUserOrganization(input: CreateUserOrganizationInput): Promise<AddUserToOrganizationResponse>;
    /**
     * Verifies an invitation token.
     */
    verifyInvitationToken(input: VerifyInvitationTokenInput): Promise<InvitationResponse>;
    /**
     * Allows a user to sign up after receiving an invitation.
     */
    signupAfterInvitation(input: CreateUserInput, organizationId: string, firstName?: string, lastName?: string): Promise<SignupAfterInvitationResponse>;
    updateUserRoleInOrganization(input: UpdateUserRoleInOrganizationInput): Promise<UpdateUserRoleInOrganizationResponse>;
    removeUserFromOrganization(input: {
        userID: string;
        organizationID: string;
    }): Promise<AddUserToOrganizationResponse>;
    removeInvitation(input: {
        email: string;
        organizationID: string;
    }): Promise<AddUserToOrganizationResponse>;
    /**
     * Adds a user to an organization.
     */
    addUserToOrganization(input: {
        userID: string;
        organizationID: string;
        role: string;
    }): Promise<AddUserToOrganizationResponse>;
    /**
     * Lists the members of an organization.
     * @param organizationId The ID of the organization.
     * @returns The list of members of the organization.
      */
    members(organizationId: string): Promise<OrganizationMembers>;
    getUserOrganizations(userId: string): Promise<OrganizationsByUserResponse[]>;
}
