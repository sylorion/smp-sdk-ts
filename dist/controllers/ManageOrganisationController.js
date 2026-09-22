import { organizationMutations } from './../api/graphql/mutations/organization/organizationMutation.js';
import { MUTATION_SIGNUP_AFTER_INVITATION } from './../api/graphql/mutations/authMutations.js';
import { organizationQueries } from '../api/graphql/queries/organization/organizationQueries.js';
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
    async inviteUserToOrganization(input) {
        const mutation = organizationMutations.INVITE_USER_TO_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.inviteUserToOrganization;
    }
    /**
     * Creates a new user-organization relationship.
     */
    async createUserOrganization(input) {
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
    async updateUserRoleInOrganization(input) {
        const mutation = organizationMutations.UPDATE_USER_ROLE_IN_ORGANIZATION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateUserRoleInOrganization;
    }
    async removeUserFromOrganization(input) {
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
    async addUserToOrganization(input) {
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
    async members(organizationId) {
        const query = organizationQueries.GET_ORGANIZATION_MEMBERS;
        const variables = { organizationId };
        const response = await this.client.query(query, variables);
        return response.listOrganizationMembers;
    }
    async getUserOrganizations(userId) {
        const query = organizationQueries.GET_USER_ORGANIZATIONS;
        const variables = { userId };
        const response = await this.client.query(query, variables);
        return response.getUserOrganizations;
    }
}
