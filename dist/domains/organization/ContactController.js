import { contactQueries } from '../../api/graphql/organization/contactQueries.js';
import { contactMutations } from '../../api/graphql/organization/contactMutations.js';
/**
 * Note : depuis le CRM (mu-organization), l'appelant est TOUJOURS l'identité signée du client
 * (`APIClient.withUserAssertion` côté serveur) ; le paramètre `callerUserID` des méthodes est
 * conservé pour compatibilité mais ignoré par le service.
 */
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
    // ── CRM : responsable d'un lead ──
    /** `assigneeUserID` null : le contact n'a plus de responsable. */
    async assign(contactID, assigneeUserID) {
        const input = assigneeUserID ? { contactID, assigneeUserID } : { contactID };
        const response = await this.client.mutate(contactMutations.ASSIGN_CONTACT, { input });
        return response.assignOrganizationContact;
    }
    async handOver(input) {
        const response = await this.client.mutate(contactMutations.HAND_OVER_CONTACT, { input });
        return response.handOverOrganizationContact;
    }
    async summary(organizationID) {
        const response = await this.client.query(contactQueries.GET_ORGANIZATION_CONTACTS_SUMMARY, { organizationID });
        return response.organizationContactsSummary;
    }
    /** Contacts modifiés et contacts refusés (droits). */
    async bulkUpdate(input) {
        const response = await this.client.mutate(contactMutations.BULK_UPDATE_CONTACTS, { input });
        return response.bulkUpdateOrganizationContacts;
    }
}
