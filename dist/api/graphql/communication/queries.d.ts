declare const mailingQueries: {
    GET_CAMPAIGN_BY_ID: string;
    GET_CAMPAIGNS: string;
    GET_CAMPAIGN_BY_SLUG: string;
    GET_NEWSLETTER: string;
    GET_NEWSLETTERS: string;
    GET_NEWSLETTER_BY_SLUG: string;
    GET_NEWSLETTER_CONTACT: string;
    GET_NEWSLETTER_CONTACTS: string;
    GET_NEWSLETTER_CONTACT_BY_SLUG: string;
    GET_NEWSLETTER_CONTACTS_BY_USER_ID: string;
};
export { mailingQueries };
declare const notificationQueries: {
    GET_NOTIFICATIONS: string;
    GET_NOTIFICATION_BY_ID: string;
    GET_NOTIFICATIONS_BY_IDS: string;
    GET_NOTIFICATION_BY_UNIQ_REF: string;
    GET_NOTIFICATION_BY_SLUG: string;
    GET_NOTIFICATIONS_BY_SLUGS: string;
    GET_NOTIFICATIONS_BY_USER_ID: string;
    GET_NOTIFICATIONS_BY_ORGANIZATION_ID: string;
    MARK_NOTIFICATION_AS_READ: string;
};
export { notificationQueries };
declare const engagementQueries: {
    GET_ENGAGEMENTS_BY_SERVICE_ID: string;
    GET_ENGAGEMENTS_BY_CONSULTANT: string;
    GET_ENGAGEMENTS_BY_BUYER: string;
    GET_ENGAGEMENTS_BY_ORGANIZATION: string;
    GET_ENGAGEMENT: string;
    GET_ENGAGEMENTS_BY_ESTIMATE: string;
    GET_ENGAGEMENT_REPORT_BY_TOKEN: string;
    GET_ENGAGEMENT_REPORTS_BY_ENGAGEMENT: string;
    GET_ENGAGEMENT_REPORTS_BY_CONSULTANT: string;
    GET_ENGAGEMENT_REPORTS_BY_ORGANIZATION: string;
    GET_ENGAGEMENT_REPORTS_BY_PERIOD: string;
};
export { engagementQueries };
