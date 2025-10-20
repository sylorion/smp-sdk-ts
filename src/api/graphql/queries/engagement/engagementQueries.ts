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

  // QUERY POUR RÉCUPÉRER LES ENGAGEMENTS PAR ESTIMATE
  GET_ENGAGEMENTS_BY_ESTIMATE: `
    query GetEngagementsByEstimate($estimateId: String!) {
      engagementsByEstimate(estimateId: $estimateId) {
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

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR ENGAGEMENT
  GET_ENGAGEMENT_REPORTS_BY_ENGAGEMENT: `
    query GetEngagementReportsByEngagement($engagementId: String!) {
      engagementReportsByEngagement(engagementId: $engagementId) {
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

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR CONSULTANT
  GET_ENGAGEMENT_REPORTS_BY_CONSULTANT: `
    query GetEngagementReportsByConsultant($consultantUserId: String!) {
      engagementReportsByConsultant(consultantUserId: $consultantUserId) {
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

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR ORGANISATION
  GET_ENGAGEMENT_REPORTS_BY_ORGANIZATION: `
    query GetEngagementReportsByOrganization($organizationId: String!) {
      engagementReportsByOrganization(organizationId: $organizationId) {
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

  // QUERY POUR RÉCUPÉRER LES RAPPORTS D'ENGAGEMENT PAR PÉRIODE
  GET_ENGAGEMENT_REPORTS_BY_PERIOD: `
    query GetEngagementReportsByPeriod($year: Int!, $periodType: String!, $periodValue: Int!) {
      engagementReportsByPeriod(year: $year, periodType: $periodType, periodValue: $periodValue) {
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
