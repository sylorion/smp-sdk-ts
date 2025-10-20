const engagementMutations = {
  // MUTATION POUR CRÉER UN ENGAGEMENT
  CREATE_ENGAGEMENT: `
    mutation CreateEngagement($data: CreateEngagementInput!) {
      createEngagement(data: $data) {
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

  // MUTATION POUR METTRE À JOUR UN ENGAGEMENT
  UPDATE_ENGAGEMENT: `
    mutation UpdateEngagement($engagementId: String!, $data: UpdateEngagementInput!) {
      updateEngagement(engagementId: $engagementId, data: $data) {
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

  // MUTATION POUR SUPPRIMER UN ENGAGEMENT
  DELETE_ENGAGEMENT: `
    mutation DeleteEngagement($engagementId: String!) {
      deleteEngagement(engagementId: $engagementId) {
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

  // MUTATION POUR CRÉER UN CRÉNEAU TEMPOREL
  CREATE_TIME_SLOT: `
    mutation CreateTimeSlot($data: CreateTimeSlotInput!) {
      createTimeSlot(data: $data) {
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
