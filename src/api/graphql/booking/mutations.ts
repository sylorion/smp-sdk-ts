import { gql } from 'graphql-request';

const bookingMutations = {
  // MUTATION POUR CRÉER UNE DEMANDE DE DEVIS
  CREATE_ESTIMATE_REQUEST: `
    mutation CreateEstimateRequest($input: CreateEstimateRequestInput!) {
      createEstimateRequest(input: $input) {
        estimateRequestId
        serviceId
        userId
        requestedStartDate
        requestedEndDate
        requestedDuration
        description
        status
        billingInformation
        additionalRequirements
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // MUTATION POUR CRÉER UNE RÉSERVATION
  CREATE_BOOKING: `
    mutation CreateBooking($input: CreateBookingInput!) {
      createBooking(data: $input) {
        bookingId
        serviceId
        userId
        status
        weeklyAvailabilityId
        slotDate
        slotStartTime
        slotEndTime
        slotDuration
        bookingStartDate
        bookingEndDate
        customerDetails
        engagementId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // MUTATION POUR CRÉER UNE DISPONIBILITÉ
  CREATE_AVAILABILITY: `
    mutation CreateAvailability($input: CreateAvailabilityInput!) {
      createAvailability(input: $input) {
        availabilityId
        serviceId
        startDate
        endDate
        startTime
        endTime
        capacity
        status
        createdAt
        updatedAt
      }
    }
  `,

  // MUTATION POUR METTRE À JOUR UNE DISPONIBILITÉ
  UPDATE_AVAILABILITY: `
    mutation UpdateAvailability($id: String!, $input: UpdateAvailabilityInput!) {
      updateAvailability(id: $id, input: $input) {
        availabilityId
        serviceId
        startDate
        endDate
        startTime
        endTime
        capacity
        status
        createdAt
        updatedAt
      }
    }
  `,

  // MUTATION POUR ANNULER UNE DISPONIBILITÉ
  CANCEL_AVAILABILITY: `
    mutation CancelAvailability($id: String!) {
      cancelAvailability(id: $id) {
        availabilityId
        status
        updatedAt
      }
    }
  `,

  // MUTATION POUR CRÉER UNE DISPONIBILITÉ HEBDOMADAIRE
  CREATE_WEEKLY_AVAILABILITY: `
    mutation CreateWeeklyAvailability($input: CreateWeeklyAvailabilityInput!) {
      createWeeklyAvailability(input: $input) {
        weeklyAvailabilityId
        userId
        serviceId
        dayOfWeek
        startTime
        endTime
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // NOUVELLE MUTATION POUR CRÉER UNE RÉSERVATION AVEC CRÉNEAU AUTO-DÉTERMINÉ
  CREATE_BOOKING_WITH_SLOT: `
    mutation CreateBookingWithSlot($input: CreateBookingInput!) {
      createBooking(data: $input) {
        bookingId
        serviceId
        userId
        status
        weeklyAvailabilityId
        slotDate
        slotStartTime
        slotEndTime
        slotDuration
        bookingStartDate
        bookingEndDate
        customerDetails
        engagementId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // MUTATION POUR CRÉER UNE DISPONIBILITÉ HEBDOMADAIRE EN LOT
  CREATE_WEEKLY_AVAILABILITY_BATCH: `
    mutation CreateWeeklyAvailabilityBatch($input: CreateWeeklyAvailabilityBatchInput!) {
      createWeeklyAvailabilityBatch(input: $input) {
        weeklyAvailabilityId
        userId
        serviceId
        dayOfWeek
        startTime
        endTime
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // MUTATION POUR CRÉER DES CRÉNEAUX QUOTIDIENS
  CREATE_DAILY_SLOTS: `
    mutation CreateDailySlots($input: CreateDailySlotsInput!) {
      createDailySlots(input: $input) {
        slotId
        date
        startTime
        endTime
        duration
        capacity
        availableCapacity
        bookedCapacity
        status
        serviceId
        weeklyAvailabilityId
        isRecurring
        bookingIds
      }
    }
  `,

  // MUTATION POUR CRÉER UNE EXCEPTION DE DISPONIBILITÉ
  CREATE_AVAILABILITY_EXCEPTION: `
    mutation CreateAvailabilityException($input: CreateAvailabilityExceptionInput!) {
      createAvailabilityException(input: $input) {
        availabilityExceptionId
        userId
        serviceId
        exceptionStartDate
        exceptionEndDate
        startTime
        endTime
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // MUTATION POUR ANNULER UNE RÉSERVATION
  CANCEL_BOOKING: `
    mutation CancelBooking($bookingId: String!, $message: String) {
      cancelBooking(bookingId: $bookingId, message: $message) {
        bookingId
        serviceId
        userId
        status
        weeklyAvailabilityId
        slotDate
        slotStartTime
        slotEndTime
        slotDuration
        customerDetails
        engagementId
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // MUTATION POUR METTRE À JOUR UNE RÉSERVATION
  UPDATE_BOOKING: `
    mutation UpdateBooking($input: UpdateBookingInput!) {
      updateBooking(data: $input) {
        bookingId
        customerDetails
      }
    }
  `,
};

export { bookingMutations };

const bookingConfigurationMutations = {
  // MUTATION POUR CRÉER UNE CONFIGURATION DE BOOKING
  CREATE_BOOKING_CONFIGURATION: `
    mutation CreateBookingConfiguration($input: CreateBookingConfigurationInput!) {
      createBookingConfiguration(input: $input) {
        bookingConfigurationId
        userId
        serviceId
        bookingMode
        defaultSlotDuration
        allowGroupBooking
        minBookingDuration
        maxBookingDuration
        dateRangeBookingAllowed
        cancellationWindow
        cancellationPolicy
        advanceBookingLimit
        maxCapacity
        customRequirements
        postBookingMessageTemplate
        autoSendPostBookingMessage
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // MUTATION POUR CRÉER UNE CONFIGURATION DE BOOKING BASÉE SUR LE TYPE DE SERVICE
  CREATE_SERVICE_TYPE_BOOKING: `
    mutation CreateServiceTypeBooking($input: CreateServiceTypeBookingInput!) {
      createServiceTypeBooking(input: $input) {
        bookingConfigurationId
        userId
        serviceId
        bookingMode
        defaultSlotDuration
        allowGroupBooking
        minBookingDuration
        maxBookingDuration
        dateRangeBookingAllowed
        cancellationWindow
        cancellationPolicy
        advanceBookingLimit
        maxCapacity
        customRequirements
        postBookingMessageTemplate
        autoSendPostBookingMessage
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // MUTATION POUR METTRE À JOUR UNE CONFIGURATION DE BOOKING
  UPDATE_BOOKING_CONFIGURATION: `
    mutation UpdateBookingConfiguration($id: String!, $input: UpdateBookingConfigurationInput!) {
      updateBookingConfiguration(id: $id, input: $input) {
        bookingConfigurationId
        userId
        serviceId
        bookingMode
        defaultSlotDuration
        allowGroupBooking
        minBookingDuration
        maxBookingDuration
        dateRangeBookingAllowed
        cancellationWindow
        cancellationPolicy
        advanceBookingLimit
        maxCapacity
        customRequirements
        postBookingMessageTemplate
        autoSendPostBookingMessage
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
};

export { bookingConfigurationMutations };

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
