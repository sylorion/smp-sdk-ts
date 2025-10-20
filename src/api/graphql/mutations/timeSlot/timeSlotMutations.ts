const timeSlotMutations = {
  // MUTATION POUR CRÉER UN TIMESLOT
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

  // MUTATION POUR METTRE À JOUR UN TIMESLOT
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

  // MUTATION POUR SUPPRIMER UN TIMESLOT
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

  // MUTATION POUR CRÉER DES TIMESLOTS EN LOT
  CREATE_TIME_SLOTS_BATCH: `
    mutation CreateTimeSlotsBatch($data: [CreateTimeSlotInput!]!) {
      createTimeSlotsBatch(data: $data) {
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

  // MUTATION POUR ASSIGNER UN TIMESLOT À UN ENGAGEMENT
  ASSIGN_TIME_SLOT_TO_ENGAGEMENT: `
    mutation AssignTimeSlotToEngagement($timeSlotId: String!, $engagementId: String!) {
      assignTimeSlotToEngagement(timeSlotId: $timeSlotId, engagementId: $engagementId) {
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

  // MUTATION POUR ASSIGNER UN TIMESLOT À UN MILESTONE
  ASSIGN_TIME_SLOT_TO_MILESTONE: `
    mutation AssignTimeSlotToMilestone($timeSlotId: String!, $engagementMilestoneId: String!) {
      assignTimeSlotToMilestone(timeSlotId: $timeSlotId, engagementMilestoneId: $engagementMilestoneId) {
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
};

export { timeSlotMutations };
