// src/api/controllers/Mailing.ts
import { mailingQueries } from '../../api/graphql/communication/queries.js';
import { mailingMutations } from '../../api/graphql/communication/mutations.js';
//
// Controller Mailing
//
/**
 * La classe Mailing gère les appels API liés aux campagnes, newsletters et contacts newsletter.
 */
export class Mailing {
    constructor(client) {
        this.client = client;
    }
    // =========================== QUERIES ===========================
    async getCampaignById(campaignID) {
        const variables = { campaignID };
        const response = await this.client.query(mailingQueries.GET_CAMPAIGN_BY_ID, variables);
        return response.campaign;
    }
    async getNewsletterById(newsletterID) {
        const variables = { newsletterID };
        const response = await this.client.query(mailingQueries.GET_NEWSLETTER, variables);
        return response.newsletter;
    }
    async listNewsletterContactsByUserId(userID) {
        const variables = { userID };
        const response = await this.client.query(mailingQueries.GET_NEWSLETTER_CONTACTS_BY_USER_ID, variables);
        return response.newsletterContactsByUserID;
    }
    // =========================== MUTATIONS ===========================
    // Campagnes
    async createCampaign(input) {
        const variables = { input };
        const response = await this.client.mutate(mailingMutations.CREATE_CAMPAIGN, variables);
        return response.createCampaign;
    }
    async updateCampaign(campaignID, input) {
        const variables = { campaignID, input };
        const response = await this.client.mutate(mailingMutations.UPDATE_CAMPAIGN, variables);
        return response.updateCampaign;
    }
    async deleteCampaign(campaignID) {
        const variables = { campaignID };
        const response = await this.client.mutate(mailingMutations.DELETE_CAMPAIGN, variables);
        return response.deleteCampaign;
    }
    // Newsletters
    async createNewsletter(input) {
        const variables = { input };
        const response = await this.client.mutate(mailingMutations.CREATE_NEWSLETTER, variables);
        return response.createNewsletter;
    }
    async updateNewsletter(newsletterID, input) {
        const variables = { newsletterID, input };
        const response = await this.client.mutate(mailingMutations.UPDATE_NEWSLETTER, variables);
        return response.updateNewsletter;
    }
    async deleteNewsletter(newsletterID) {
        const variables = { newsletterID };
        const response = await this.client.mutate(mailingMutations.DELETE_NEWSLETTER, variables);
        return response.deleteNewsletter;
    }
    // Contacts Newsletter
    async createNewsletterContact(input) {
        const variables = { input };
        const response = await this.client.mutate(mailingMutations.CREATE_NEWSLETTER_CONTACT, variables);
        return response.createNewsletterContact;
    }
    async updateNewsletterContact(newsletterContactID, input) {
        const variables = { newsletterContactID, input };
        const response = await this.client.mutate(mailingMutations.UPDATE_NEWSLETTER_CONTACT, variables);
        return response.updateNewsletterContact;
    }
    async deleteNewsletterContact(newsletterContactID) {
        const variables = { newsletterContactID };
        const response = await this.client.mutate(mailingMutations.DELETE_NEWSLETTER_CONTACT, variables);
        return response.deleteNewsletterContact;
    }
}
