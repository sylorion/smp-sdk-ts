import { organizationMutations } from '../../api/graphql/organization/mutations.js';
import { authMutations } from '../../api/graphql/index.js';
const { MUTATION_SIGNUP_AFTER_INVITATION } = authMutations;
import { organizationQueries } from '../../api/graphql/organization/queries.js';
/**
 * The `MemberOrganization` class manages member-organization-related requests within the application.
 */
export class ManageOrganization {
    constructor(client) {
        this.client = client;
    }
    // ========================== MUTATIONS =============================================================
    /**
     * Invites a user to an organization.
     */
    async inviteUser(input) {
        const mutation = organizationMutations.INVITE_USER_TO_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.inviteUserToOrganization;
    }
    /**
     * Creates a new user-organization relationship.
     */
    async createMember(input) {
        const mutation = organizationMutations.CREATE_USER_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.addUserToOrganization;
    }
    /**
     * Verifies an invitation token.
     */
    async verifyInvitationToken(input) {
        const mutation = organizationMutations.VERIFY_INVITATION_TOKEN;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.verifyInvitationToken;
    }
    /**
     * Allows a user to sign up after receiving an invitation.
     */
    async signupAfterInvitation(input, organizationId, firstName, lastName) {
        const mutation = MUTATION_SIGNUP_AFTER_INVITATION;
        const variables = { input, organizationId, firstName, lastName };
        const response = await this.client.mutate(mutation, variables);
        return response.signupAfterInvitation;
    }
    async updateUserRole(input) {
        const mutation = organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateUserRoleInOrganization;
    }
    async removeUser(input) {
        const mutation = organizationMutations.REMOVE_USER_FROM_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.removeUserFromOrganization;
    }
    async removeInvitation(input) {
        const mutation = organizationMutations.REMOVE_INVITATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.removeInvitation;
    }
    /**
     * Adds a user to an organization.
     */
    async addUser(input) {
        const mutation = organizationMutations.ADD_USER_TO_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.addUserToOrganization;
    }
    // ========================== QUERIES =============================================================
    /**
     * Lists the members of an organization.
     * @param organizationId The ID of the organization.
     * @returns The list of members of the organization.
      */
    async listMembers(organizationId) {
        const query = organizationQueries.GET_ORGANIZATION_MEMBERS;
        const variables = { organizationId };
        const response = await this.client.query(query, variables);
        return response.listOrganizationMembers;
    }
    async listByUserId(userId) {
        const query = organizationQueries.GET_USER_ORGANIZATIONS;
        const variables = { userId };
        const response = await this.client.query(query, variables);
        return response.getUserOrganizations;
    }
    // ========================== NEW: Role Verification ==========================
    async verifyUserRole(input) {
        const query = organizationQueries.VERIFY_USER_ROLE;
        const variables = { input };
        const response = await this.client.query(query, variables);
        return response.verifyUserRole;
    }
    // ========================== NEW: User Search ==========================
    async searchUsers(query, limit = 10) {
        const gqlQuery = organizationQueries.SEARCH_USERS;
        const variables = { query, limit };
        const response = await this.client.query(gqlQuery, variables);
        return response.searchUsers;
    }
    // ========================== NEW: Member Profile ==========================
    async getMemberProfile(organizationID, userID) {
        const query = organizationQueries.GET_MEMBER_PROFILE;
        const variables = { organizationID, userID };
        const response = await this.client.query(query, variables);
        return response.getMemberProfile;
    }
    async updateMemberProfile(input) {
        const mutation = organizationMutations.UPDATE_MEMBER_PROFILE;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateMemberProfile;
    }
    // ========================== NEW: Resend Invitation ==========================
    async resendInvitation(input) {
        const mutation = organizationMutations.RESEND_INVITATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.resendInvitation;
    }
    // ========================== NEW: Owner Transfer ==========================
    /**
     * Initiates an owner transfer. Sends an OTP to the current owner's email.
     */
    async initiateOwnerTransfer(input) {
        const mutation = organizationMutations.INITIATE_OWNER_TRANSFER;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.initiateOwnerTransfer;
    }
    /**
     * Validates the OTP and completes the owner transfer.
     * The former owner is demoted to Admin, the target becomes the new Owner.
     */
    async validateOwnerTransfer(input) {
        const mutation = organizationMutations.VALIDATE_OWNER_TRANSFER;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.validateOwnerTransfer;
    }
}
