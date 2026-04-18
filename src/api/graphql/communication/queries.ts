import { gql } from 'graphql-request';

// =========================================
// Source: notification/mailingQueries.ts
// =========================================
// src/api/graphql/queries/mailing/mailingQueries.js

const mailingQueries = {
    // ------------------ Campaign ------------------
    GET_CAMPAIGN_BY_ID: `
      query GetCampaignById($campaignID: ID!) {
        campaign(campaignID: $campaignID) {
          campaignID
          uniqRef
          slug
          emailCampaignTemplateID
          subject
          contentHTML
          contentText
          groupIDs
          scheduledAt
          sentAt
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
    GET_CAMPAIGNS: `
      query GetCampaigns($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        campaigns(pagination: $pagination, sort: $sort, filter: $filter) {
          campaignID
          uniqRef
          slug
          emailCampaignTemplateID
          subject
        }
      }
    `,
    GET_CAMPAIGN_BY_SLUG: `
      query GetCampaignBySlug($slug: String!) {
        campaignBySlug(slug: $slug) {
          campaignID
          uniqRef
          slug
          emailCampaignTemplateID
          subject
        }
      }
    `,
  
    // ------------------ Newsletter ------------------
    GET_NEWSLETTER: `
      query GetNewsletter($newsletterID: ID!) {
        newsletter(newsletterID: $newsletterID) {
          newsletterID
          uniqRef
          slug
          emailNewsletterTemplateID
          subject
          contentHTML
          contentText
          scheduledAt
          sentAt
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
    GET_NEWSLETTERS: `
      query GetNewsletters($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        newsletters(pagination: $pagination, sort: $sort, filter: $filter) {
          newsletterID
          uniqRef
          slug
          emailNewsletterTemplateID
          subject
        }
      }
    `,
    GET_NEWSLETTER_BY_SLUG: `
      query GetNewsletterBySlug($slug: String!) {
        newsletterBySlug(slug: $slug) {
          newsletterID
          uniqRef
          slug
          emailNewsletterTemplateID
          subject
        }
      }
    `,
  
    // ------------------ NewsletterContact ------------------
    GET_NEWSLETTER_CONTACT: `
      query GetNewsletterContact($newsletterContactID: ID!) {
        newsletterContact(newsletterContactID: $newsletterContactID) {
          newsletterContactID
          userID
          email
          firstName
          lastName
          isNewsletterSubscriber
          source
          country
          gender
          birthDate
          state
          slug
          uniqRef
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
    GET_NEWSLETTER_CONTACTS: `
      query GetNewsletterContacts($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        newsletterContacts(pagination: $pagination, sort: $sort, filter: $filter) {
          newsletterContactID
          userID
          email
          firstName
          lastName
        }
      }
    `,
    GET_NEWSLETTER_CONTACT_BY_SLUG: `
      query GetNewsletterContactBySlug($slug: String!) {
        newsletterContactBySlug(slug: $slug) {
          newsletterContactID
          userID
          email
          firstName
          lastName
        }
      }
    `,
    GET_NEWSLETTER_CONTACTS_BY_USER_ID: `
      query GetNewsletterContactsByUserID($userID: ID!) {
        newsletterContactsByUserID(userID: $userID) {
          newsletterContactID
          email
          firstName
          lastName
        }
      }
    `,
  };
  
  export { mailingQueries };
  
// =========================================
// Source: notification/notificationQueries.ts
// =========================================
// smp-sdk-ts/src/api/graphql/queries/notification/notificationQueries.js

const notificationQueries = {
    // QUERY TO GET A LIST OF NOTIFICATIONS WITH OPTIONAL PAGINATION, SORTING, AND FILTERING
    GET_NOTIFICATIONS: `
      query GetNotifications($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        notifications(pagination: $pagination, sort: $sort, filter: $filter) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET A SINGLE NOTIFICATION BY ITS UNIQUE ID
    GET_NOTIFICATION_BY_ID: `
      query GetNotificationByID($notificationID: ID!) {
        notificationByID(notificationID: $notificationID) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE NOTIFICATIONS BY AN ARRAY OF NOTIFICATION IDS
    GET_NOTIFICATIONS_BY_IDS: `
      query GetNotificationsByIDs($notificationIDs: [ID!]!) {
        notificationsByIDs(notificationIDs: $notificationIDs) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET A NOTIFICATION BY ITS UNIQUE REFERENCE
    GET_NOTIFICATION_BY_UNIQ_REF: `
      query GetNotificationByUniqRef($uniqRef: String!) {
        notificationByUniqRef(uniqRef: $uniqRef) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET A NOTIFICATION BY ITS SLUG
    GET_NOTIFICATION_BY_SLUG: `
      query GetNotificationBySlug($slug: String!) {
        notificationBySlug(slug: $slug) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE NOTIFICATIONS BY SLUGS
    GET_NOTIFICATIONS_BY_SLUGS: `
      query GetNotificationsBySlugs($slugs: [String!]!) {
        notificationsBySlugs(slugs: $slugs) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

    // QUERY TO GET NOTIFICATIONS BY USER ID
    GET_NOTIFICATIONS_BY_USER_ID: `
      query GetNotificationsByUserID($userID: ID!) {
        notificationsByUserID(userID: $userID) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
        }
      }
    `,

    // QUERY TO GET NOTIFICATIONS BY ORGANIZATION ID
    GET_NOTIFICATIONS_BY_ORGANIZATION_ID: `
      query GetNotificationsByOrganizationID($organizationID: ID!) {
        notificationsByOrganizationID(organizationID: $organizationID) {
          notificationID
          userID
          organizationID
          title
          message
          readAt
          link
          state
          slug
          uniqRef
          type
          notificationTemplateID
          entityType
          entityID
          createdAt
          updatedAt
        }
      }
    `,

    // MUTATION TO MARK A NOTIFICATION AS READ
    MARK_NOTIFICATION_AS_READ: `
      mutation MarkNotificationAsRead($notificationID: ID!) {
        markNotificationAsRead(notificationID: $notificationID) {
          notificationID
          readAt
        }
      }
    `
  };
  
  export { notificationQueries };


// =========================================
// Source: engagement/engagementQueries.ts
// =========================================

const TIME_SLOT_FIELDS = `
  timeSlotId
  slotType
  engagementId
  engagementReportId
  engagementMilestoneId
  serviceId
  startDateTime
  endDateTime
  duration
  title
  description
  status
  priority
  capacity
  maxParticipants
  currentParticipants
  isPublic
  requiresApproval
  parentSlotId
  dependentSlotIds
  estimatedHours
  actualHours
  hourlyRate
  qualityScore
  clientFeedback
  internalNotes
  deliverables
  codeCommits
  documentation
  participants
  metadata
  tags
  createdAt
  updatedAt
  deletedAt
`;

const ENGAGEMENT_REPORT_FIELDS = `
  engagementReportId
  engagementId
  consultantUserId
  organizationId
  serviceId
  periodType
  periodValue
  month
  year
  hourlyRate
  totalHours
  totalAmount
  status
  submittedAt
  approvedAt
  paidAt
  notes
  invoiceId
  token
  metadata
  createdAt
  updatedAt
  deletedAt
  timeSlots {
    ${TIME_SLOT_FIELDS}
  }
`;

const engagementQueries = {
  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR SERVICE
  GET_ENGAGEMENTS_BY_SERVICE_ID: `
    query GetEngagementsByService($serviceId: String!, $organizationId: String) {
      engagementsByService(serviceId: $serviceId, organizationId: $organizationId) {
        engagementId
        consultantUserId
        organizationId
        buyerUserId
        estimateId
        serviceId
        projectName
        projectDescription
        startDate
        endDate
        hourlyRate
        estimatedHours
        actualHours
        status
        priority
        notes
        attachments
        deliverables
        metadata
        createdAt
        updatedAt
        deletedAt
        timeSlots {
          ${TIME_SLOT_FIELDS}
        }
        reports {
          ${ENGAGEMENT_REPORT_FIELDS}
        }
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR CONSULTANT
  GET_ENGAGEMENTS_BY_CONSULTANT: `
    query GetEngagementsByConsultant($consultantUserId: String!) {
      engagementsByConsultant(consultantUserId: $consultantUserId) {
        engagementId
        consultantUserId
        organizationId
        buyerUserId
        estimateId
        serviceId
        projectName
        projectDescription
        startDate
        endDate
        hourlyRate
        estimatedHours
        actualHours
        status
        priority
        notes
        attachments
        deliverables
        metadata
        createdAt
        updatedAt
        deletedAt
        timeSlots {
          ${TIME_SLOT_FIELDS}
        }
        reports {
          ${ENGAGEMENT_REPORT_FIELDS}
        }
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR ACHETEUR
  GET_ENGAGEMENTS_BY_BUYER: `
    query GetEngagementsByBuyer($buyerUserId: String!) {
      engagementsByBuyer(buyerUserId: $buyerUserId) {
        engagementId
        consultantUserId
        organizationId
        buyerUserId
        estimateId
        serviceId
        projectName
        projectDescription
        startDate
        endDate
        hourlyRate
        estimatedHours
        actualHours
        status
        priority
        notes
        attachments
        deliverables
        metadata
        createdAt
        updatedAt
        deletedAt
        timeSlots {
          ${TIME_SLOT_FIELDS}
        }
        reports {
          ${ENGAGEMENT_REPORT_FIELDS}
        }
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR ORGANISATION
  GET_ENGAGEMENTS_BY_ORGANIZATION: `
    query GetEngagementsByOrganization($organizationId: String!) {
      engagementsByOrganization(organizationId: $organizationId) {
        engagementId
        consultantUserId
        organizationId
        buyerUserId
        estimateId
        serviceId
        projectName
        projectDescription
        startDate
        endDate
        hourlyRate
        estimatedHours
        actualHours
        status
        priority
        notes
        attachments
        deliverables
        metadata
        createdAt
        updatedAt
        deletedAt
        timeSlots {
          ${TIME_SLOT_FIELDS}
        }
        reports {
          ${ENGAGEMENT_REPORT_FIELDS}
        }
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER UN ENGAGEMENT SPÉCIFIQUE
  GET_ENGAGEMENT: `
    query GetEngagement($engagementId: String!) {
      engagement(engagementId: $engagementId) {
        engagementId
        consultantUserId
        organizationId
        buyerUserId
        estimateId
        serviceId
        projectName
        projectDescription
        startDate
        endDate
        hourlyRate
        estimatedHours
        actualHours
        status
        priority
        notes
        attachments
        deliverables
        metadata
        createdAt
        updatedAt
        deletedAt
        timeSlots {
          ${TIME_SLOT_FIELDS}
        }
        reports {
          ${ENGAGEMENT_REPORT_FIELDS}
        }
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR ESTIMATE
  GET_ENGAGEMENTS_BY_ESTIMATE: `
    query GetEngagementsByEstimate($estimateId: String!) {
      engagementsByEstimate(estimateId: $estimateId) {
        engagementId
        consultantUserId
        organizationId
        buyerUserId
        estimateId
        serviceId
        projectName
        projectDescription
        startDate
        endDate
        hourlyRate
        estimatedHours
        actualHours
        status
        priority
        notes
        attachments
        deliverables
        metadata
        createdAt
        updatedAt
        deletedAt
        timeSlots {
          ${TIME_SLOT_FIELDS}
        }
        reports {
          ${ENGAGEMENT_REPORT_FIELDS}
        }
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER UN RAPPORT D'ENGAGEMENT PAR TOKEN
  GET_ENGAGEMENT_REPORT_BY_TOKEN: `
    query GetEngagementReportByToken($token: String!) {
      engagementReportByToken(token: $token) {
        ${ENGAGEMENT_REPORT_FIELDS}
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR ENGAGEMENT
  GET_ENGAGEMENT_REPORTS_BY_ENGAGEMENT: `
    query GetEngagementReportsByEngagement($engagementId: String!) {
      engagementReportsByEngagement(engagementId: $engagementId) {
        ${ENGAGEMENT_REPORT_FIELDS}
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR CONSULTANT
  GET_ENGAGEMENT_REPORTS_BY_CONSULTANT: `
    query GetEngagementReportsByConsultant($consultantUserId: String!) {
      engagementReportsByConsultant(consultantUserId: $consultantUserId) {
        ${ENGAGEMENT_REPORT_FIELDS}
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR ORGANISATION
  GET_ENGAGEMENT_REPORTS_BY_ORGANIZATION: `
    query GetEngagementReportsByOrganization($organizationId: String!) {
      engagementReportsByOrganization(organizationId: $organizationId) {
        ${ENGAGEMENT_REPORT_FIELDS}
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR PÉRIODE
  GET_ENGAGEMENT_REPORTS_BY_PERIOD: `
    query GetEngagementReportsByPeriod($year: Int!, $periodType: String!, $periodValue: Int!) {
      engagementReportsByPeriod(year: $year, periodType: $periodType, periodValue: $periodValue) {
        ${ENGAGEMENT_REPORT_FIELDS}
      }
    }
  `,
};

export { engagementQueries };

