import { APIClient } from '../../api/APIClient.js';
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
export declare class ManageOrganization {
    private client;
    constructor(client: APIClient);
    /**
     * Invites a user to an organization.
     */
    inviteUser(input: InviteUserToOrganizationInput): Promise<AddUserToOrganizationResponse>;
    /**
     * Creates a new user-organization relationship.
     */
    createMember(input: CreateUserOrganizationInput): Promise<AddUserToOrganizationResponse>;
    /**
     * Verifies an invitation token.
     */
    verifyInvitationToken(input: VerifyInvitationTokenInput): Promise<InvitationResponse>;
    /**
     * Allows a user to sign up after receiving an invitation.
     */
    signupAfterInvitation(input: CreateUserInput, organizationId: string, firstName?: string, lastName?: string): Promise<SignupAfterInvitationResponse>;
    updateUserRole(input: UpdateUserRoleInOrganizationInput): Promise<UpdateUserRoleInOrganizationResponse>;
    removeUser(input: {
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
    addUser(input: {
        userID: string;
        organizationID: string;
        role: string;
    }): Promise<AddUserToOrganizationResponse>;
    /**
     * Lists the members of an organization.
     * @param organizationId The ID of the organization.
     * @returns The list of members of the organization.
      */
    listMembers(organizationId: string): Promise<OrganizationMembers>;
    listByUserId(userId: string): Promise<OrganizationsByUserResponse[]>;
    verifyUserRole(input: {
        userID: string;
        organizationID: string;
    }): Promise<VerifyUserRoleResponse>;
    searchUsers(query: string, limit?: number): Promise<SearchUsersResult[]>;
    getMemberProfile(organizationID: string, userID: string): Promise<MemberProfileResponse>;
    updateMemberProfile(input: UpdateMemberProfileInput): Promise<MemberProfileResponse>;
    resendInvitation(input: {
        email: string;
        organizationID: string;
    }): Promise<ResendInvitationResponse>;
    /**
     * Initiates an owner transfer. Sends an OTP to the current owner's email.
     */
    initiateOwnerTransfer(input: InitiateOwnerTransferInput): Promise<OwnerTransferResponse>;
    /**
     * Validates the OTP and completes the owner transfer.
     * The former owner is demoted to Admin, the target becomes the new Owner.
     */
    validateOwnerTransfer(input: ValidateOwnerTransferInput): Promise<OwnerTransferResponse>;
}
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
