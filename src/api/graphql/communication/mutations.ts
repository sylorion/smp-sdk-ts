import { gql } from 'graphql-request';

// =========================================
// Source: notification/mailingMutations.ts
// =========================================
// src/api/graphql/mutations/mailing/mailingMutations.js

const mailingMutations = {
    // ------------------ Campaign ------------------
    CREATE_CAMPAIGN: `
      mutation CreateCampaign($input: CreateCampaignInput!) {
        createCampaign(input: $input) {
          campaignID
        }
      }
    `,
    UPDATE_CAMPAIGN: `
      mutation UpdateCampaign($campaignID: ID!, $input: UpdateCampaignInput!) {
        updateCampaign(campaignID: $campaignID, input: $input) {
          campaignID
        }
      }
    `,
    DELETE_CAMPAIGN: `
      mutation DeleteCampaign($campaignID: ID!) {
        deleteCampaign(campaignID: $campaignID)
      }
    `,
  
    // ------------------ Newsletter ------------------
    CREATE_NEWSLETTER: `
      mutation CreateNewsletter($input: CreateNewsletterInput!) {
        createNewsletter(input: $input) {
          newsletterID
        }
      }
    `,
    UPDATE_NEWSLETTER: `
      mutation UpdateNewsletter($newsletterID: ID!, $input: UpdateNewsletterInput!) {
        updateNewsletter(newsletterID: $newsletterID, input: $input) {
          newsletterID
        }
      }
    `,
    DELETE_NEWSLETTER: `
      mutation DeleteNewsletter($newsletterID: ID!) {
        deleteNewsletter(newsletterID: $newsletterID)
      }
    `,
  
    // ------------------ NewsletterContact ------------------
    CREATE_NEWSLETTER_CONTACT: `
      mutation CreateNewsletterContact($input: CreateNewsletterContactInput!) {
        createNewsletterContact(input: $input) {
          newsletterContactID
        }
      }
    `,
    UPDATE_NEWSLETTER_CONTACT: `
      mutation UpdateNewsletterContact($newsletterContactID: ID!, $input: UpdateNewsletterContactInput!) {
        updateNewsletterContact(newsletterContactID: $newsletterContactID, input: $input) {
          newsletterContactID
        }
      }
    `,
    DELETE_NEWSLETTER_CONTACT: `
      mutation DeleteNewsletterContact($newsletterContactID: ID!) {
        deleteNewsletterContact(newsletterContactID: $newsletterContactID)
      }
    `,
  };
  
  export { mailingMutations };
  
// =========================================
// Source: engagement/engagementMutations.ts
// =========================================
const engagementMutations = {
  // MUTATION POUR CRÉER UN ENGAGEMENT
  CREATE_ENGAGEMENT: `
    mutation CreateEngagement($data: CreateEngagementInput!) {
      createEngagement(data: $data) {
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
      }
    }
  `,

  // MUTATION POUR METTRE À JOUR UN ENGAGEMENT
  UPDATE_ENGAGEMENT: `
    mutation UpdateEngagement($engagementId: String!, $data: UpdateEngagementInput!) {
      updateEngagement(engagementId: $engagementId, data: $data) {
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
      }
    }
  `,

  // MUTATION POUR SUPPRIMER UN ENGAGEMENT
  DELETE_ENGAGEMENT: `
    mutation DeleteEngagement($engagementId: String!) {
      deleteEngagement(engagementId: $engagementId) {
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
      }
    }
  `,

  // MUTATION POUR CRÉER UN CRÉNEAU TEMPOREL
  CREATE_TIME_SLOT: `
    mutation CreateTimeSlot($data: CreateTimeSlotInput!) {
      createTimeSlot(data: $data) {
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
      }
    }
  `,

  // MUTATION POUR METTRE À JOUR UN CRÉNEAU TEMPOREL
  UPDATE_TIME_SLOT: `
    mutation UpdateTimeSlot($timeSlotId: String!, $data: UpdateTimeSlotInput!) {
      updateTimeSlot(timeSlotId: $timeSlotId, data: $data) {
        timeSlotId
        slotType
        engagementId
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
      }
    }
  `,

  // MUTATION POUR SUPPRIMER UN CRÉNEAU TEMPOREL
  DELETE_TIME_SLOT: `
    mutation DeleteTimeSlot($timeSlotId: String!) {
      deleteTimeSlot(timeSlotId: $timeSlotId) {
        timeSlotId
        slotType
        engagementId
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
      }
    }
  `,

  // MUTATION POUR CRÉER UN RAPPORT D'ENGAGEMENT
  CREATE_ENGAGEMENT_REPORT: `
    mutation CreateEngagementReport($data: CreateEngagementReportInput!) {
      createEngagementReport(data: $data) {
        engagementReportId
        engagementId
        consultantUserId
        organizationId
        serviceId
        periodType
        periodValue
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
      }
    }
  `,

  // MUTATION POUR METTRE À JOUR UN RAPPORT D'ENGAGEMENT
  UPDATE_ENGAGEMENT_REPORT: `
    mutation UpdateEngagementReport($engagementReportId: String!, $data: UpdateEngagementReportInput!) {
      updateEngagementReport(engagementReportId: $engagementReportId, data: $data) {
        engagementReportId
        engagementId
        consultantUserId
        organizationId
        serviceId
        periodType
        periodValue
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
      }
    }
  `,

  // MUTATION POUR SUPPRIMER UN RAPPORT D'ENGAGEMENT
  DELETE_ENGAGEMENT_REPORT: `
    mutation DeleteEngagementReport($engagementReportId: String!) {
      deleteEngagementReport(engagementReportId: $engagementReportId) {
        engagementReportId
        engagementId
        consultantUserId
        organizationId
        serviceId
        periodType
        periodValue
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
      }
    }
  `,

  // MUTATION POUR CRÉER UN RAPPORT POUR UNE NOUVELLE PÉRIODE
  CREATE_REPORT_FOR_NEW_PERIOD: `
    mutation CreateReportForNewPeriod($engagementId: String!, $periodType: String!, $periodValue: Float!, $year: Float!) {
      createReportForNewPeriod(engagementId: $engagementId, periodType: $periodType, periodValue: $periodValue, year: $year) {
        engagementReportId
        engagementId
        consultantUserId
        organizationId
        serviceId
        periodType
        periodValue
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
      }
    }
  `,
};

export { engagementMutations };

