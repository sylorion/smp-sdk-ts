const engagementQueries = {
  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR SERVICE
  GET_ENGAGEMENTS_BY_SERVICE: `
    query GetEngagementsByService($serviceId: String!) {
      engagementsByService(serviceId: $serviceId) {
        engagementId
        consultantUserId
        organizationId
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

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR CONSULTANT
  GET_ENGAGEMENTS_BY_CONSULTANT: `
    query GetEngagementsByConsultant($consultantUserId: String!) {
      engagementsByConsultant(consultantUserId: $consultantUserId) {
        engagementId
        consultantUserId
        organizationId
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

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR ORGANISATION
  GET_ENGAGEMENTS_BY_ORGANIZATION: `
    query GetEngagementsByOrganization($organizationId: String!) {
      engagementsByOrganization(organizationId: $organizationId) {
        engagementId
        consultantUserId
        organizationId
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

  // QUERY POUR RÉCUPÉRER UN ENGAGEMENT SPÉCIFIQUE
  GET_ENGAGEMENT: `
    query GetEngagement($engagementId: String!) {
      engagement(engagementId: $engagementId) {
        engagementId
        consultantUserId
        organizationId
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

  // QUERY POUR RÉCUPÉRER UN ENGAGEMENT COMPLET AVEC TOUTES SES RELATIONS
  GET_ENGAGEMENT_WITH_RELATIONS: `
    query GetEngagementWithRelations($engagementId: String!) {
      engagement(engagementId: $engagementId) {
        engagementId
        consultantUserId
        organizationId
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
        reports {
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
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR SERVICE AVEC RELATIONS
  GET_ENGAGEMENTS_BY_SERVICE_WITH_RELATIONS: `
    query GetEngagementsByServiceWithRelations($serviceId: String!) {
      engagementsByService(serviceId: $serviceId) {
        engagementId
        consultantUserId
        organizationId
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
        reports {
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
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR CONSULTANT AVEC RELATIONS
  GET_ENGAGEMENTS_BY_CONSULTANT_WITH_RELATIONS: `
    query GetEngagementsByConsultantWithRelations($consultantUserId: String!) {
      engagementsByConsultant(consultantUserId: $consultantUserId) {
        engagementId
        consultantUserId
        organizationId
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
        reports {
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
    }
  `,

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR ORGANISATION AVEC RELATIONS
  GET_ENGAGEMENTS_BY_ORGANIZATION_WITH_RELATIONS: `
    query GetEngagementsByOrganizationWithRelations($organizationId: String!) {
      engagementsByOrganization(organizationId: $organizationId) {
        engagementId
        consultantUserId
        organizationId
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
        reports {
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
    }
  `,

  // QUERY POUR RÉCUPÉRER UN RAPPORT D'ENGAGEMENT PAR TOKEN
  GET_ENGAGEMENT_REPORT_BY_TOKEN: `
    query GetEngagementReportByToken($token: String!) {
      engagementReportByToken(token: $token) {
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

export { engagementQueries };
