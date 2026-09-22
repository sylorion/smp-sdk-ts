import { contactQueries } from '../../api/graphql/organization/contactQueries.js';
import { contactMutations } from '../../api/graphql/organization/contactMutations.js';
// ── Controller ──
export class ContactController {
    constructor(client) {
        this.client = client;
    }
    // ── Queries ──
    async list(organizationID, callerUserID, filters) {
        const query = contactQueries.GET_ORGANIZATION_CONTACTS;
        const variables = { organizationID, callerUserID, ...filters };
        const response = await this.client.query(query, variables);
        return response.organizationContacts;
    }
    async getById(contactID, callerUserID) {
        const query = contactQueries.GET_ORGANIZATION_CONTACT;
        const variables = { contactID, callerUserID };
        const response = await this.client.query(query, variables);
        return response.organizationContact;
    }
    async search(organizationID, callerUserID, query, limit) {
        const gqlQuery = contactQueries.SEARCH_ORGANIZATION_CONTACTS;
        const variables = { organizationID, callerUserID, query, limit };
        const response = await this.client.query(gqlQuery, variables);
        return response.searchOrganizationContacts;
    }
    // ── Mutations ──
    async create(input) {
        const mutation = contactMutations.CREATE_CONTACT;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createOrganizationContact;
    }
    async update(contactID, callerUserID, input) {
        const mutation = contactMutations.UPDATE_CONTACT;
        const variables = { contactID, callerUserID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateOrganizationContact;
    }
    async delete(contactID, callerUserID) {
        const mutation = contactMutations.DELETE_CONTACT;
        const variables = { contactID, callerUserID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteOrganizationContact.success;
    }
    async bulkCreate(organizationID, callerUserID, contacts) {
        const mutation = contactMutations.BULK_CREATE_CONTACTS;
        const variables = { organizationID, callerUserID, contacts };
        const response = await this.client.mutate(mutation, variables);
        return response.bulkCreateOrganizationContacts;
    }
    async setPrivacy(contactID, callerUserID, isPrivate) {
        const mutation = contactMutations.SET_CONTACT_PRIVACY;
        const variables = { contactID, callerUserID, isPrivate };
        const response = await this.client.mutate(mutation, variables);
        return response.setOrganizationContactPrivacy;
    }
}
