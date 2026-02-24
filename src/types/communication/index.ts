// ==============================
// CAMPAIGNS
// ==============================
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

// ==============================
// NEWSLETTERS
// ==============================
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

// ==============================
// NEWSLETTER CONTACTS
// ==============================
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
export * from './EngagementTypes.js';
