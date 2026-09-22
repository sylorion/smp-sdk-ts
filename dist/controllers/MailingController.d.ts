import { APIClient } from '../api/APIClient.js';
export interface Campaign {
    campaignID: string;
    uniqRef: string;
    slug: string;
    emailCampaignTemplateID: string;
    subject: string;
    contentHTML?: string;
    contentText?: string;
    groupIDs?: string[];
    scheduledAt?: string;
    sentAt?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreateCampaignInput {
    emailCampaignTemplateID: string;
    subject: string;
    contentHTML?: string;
    contentText?: string;
    groupIDs?: string[];
    scheduledAt?: string;
    state?: string;
}
export interface UpdateCampaignInput {
    subject?: string;
    contentHTML?: string;
    contentText?: string;
    groupIDs?: string[];
    scheduledAt?: string;
    sentAt?: string;
    state?: string;
}
export interface Newsletter {
    newsletterID: string;
    uniqRef: string;
    slug: string;
    emailNewsletterTemplateID: string;
    subject: string;
    contentHTML?: string;
    contentText?: string;
    scheduledAt?: string;
    sentAt?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreateNewsletterInput {
    emailNewsletterTemplateID: string;
    subject: string;
    contentHTML?: string;
    contentText?: string;
    scheduledAt?: string;
    state?: string;
}
export interface UpdateNewsletterInput {
    subject?: string;
    contentHTML?: string;
    contentText?: string;
    scheduledAt?: string;
    sentAt?: string;
    state?: string;
}
export interface NewsletterContact {
    newsletterContactID: string;
    userID?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isNewsletterSubscriber: boolean;
    source?: string;
    country?: string;
    gender?: string;
    birthDate?: string;
    state: string;
    slug: string;
    uniqRef: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreateNewsletterContactInput {
    userID?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    isNewsletterSubscriber?: boolean;
    source?: string;
    country?: string;
    gender?: string;
    birthDate?: string;
    state?: string;
}
export interface UpdateNewsletterContactInput {
    userID?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    isNewsletterSubscriber?: boolean;
    source?: string;
    country?: string;
    gender?: string;
    birthDate?: string;
    state?: string;
}
/**
 * La classe Mailing gère les appels API liés aux campagnes, newsletters et contacts newsletter.
 */
export declare class Mailing {
    private client;
    constructor(client: APIClient);
    getCampaignById(campaignID: string): Promise<Campaign>;
    getNewsletterById(newsletterID: string): Promise<Newsletter>;
    getNewsletterContactsByUserID(userID: string): Promise<NewsletterContact[]>;
    createCampaign(input: CreateCampaignInput): Promise<Campaign>;
    updateCampaign(campaignID: string, input: UpdateCampaignInput): Promise<Campaign>;
    deleteCampaign(campaignID: string): Promise<boolean>;
    createNewsletter(input: CreateNewsletterInput): Promise<Newsletter>;
    updateNewsletter(newsletterID: string, input: UpdateNewsletterInput): Promise<Newsletter>;
    deleteNewsletter(newsletterID: string): Promise<boolean>;
    createNewsletterContact(input: CreateNewsletterContactInput): Promise<NewsletterContact>;
    updateNewsletterContact(newsletterContactID: string, input: UpdateNewsletterContactInput): Promise<NewsletterContact>;
    deleteNewsletterContact(newsletterContactID: string): Promise<boolean>;
}
