import { gql } from 'graphql-request';

// =========================================
// Source: timeSlot/timeSlotMutations.ts
// =========================================
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



// =========================================
// Booking / Availability / Estimate mutations
// =========================================
const bookingMutations = {
  CREATE_ESTIMATE_REQUEST: `mutation CreateEstimateRequest($input: CreateEstimateRequestInput!) { createEstimateRequest(input: $input) { estimateRequestId status createdAt } }`,
  CREATE_BOOKING: `mutation CreateBooking($input: CreateBookingInput!) { createBooking(input: $input) { bookingId status createdAt } }`,
  CREATE_BOOKING_WITH_SLOT: `mutation CreateBookingWithSlot($input: CreateBookingInput!) { createBooking(input: $input) { bookingId status createdAt } }`,
  CANCEL_BOOKING: `mutation CancelBooking($bookingId: String!, $message: String) { cancelBooking(bookingId: $bookingId, message: $message) { bookingId status } }`,
  UPDATE_BOOKING: `mutation UpdateBooking($input: UpdateBookingInput!) { updateBooking(input: $input) { bookingId status } }`,
  CREATE_AVAILABILITY: `mutation CreateAvailability($input: CreateAvailabilityInput!) { createAvailability(input: $input) { availabilityId } }`,
  UPDATE_AVAILABILITY: `mutation UpdateAvailability($id: String!, $input: UpdateAvailabilityInput!) { updateAvailability(id: $id, input: $input) { availabilityId } }`,
  CANCEL_AVAILABILITY: `mutation CancelAvailability($id: String!) { cancelAvailability(id: $id) { availabilityId } }`,
  CREATE_WEEKLY_AVAILABILITY: `mutation CreateWeeklyAvailability($input: CreateWeeklyAvailabilityInput!) { createWeeklyAvailability(input: $input) { weeklyAvailabilityId } }`,
  CREATE_WEEKLY_AVAILABILITY_BATCH: `mutation CreateWeeklyAvailabilityBatch($input: CreateWeeklyAvailabilityBatchInput!) { createWeeklyAvailabilityBatch(input: $input) { weeklyAvailabilityId } }`,
  CREATE_DAILY_SLOTS: `mutation CreateDailySlots($input: CreateDailySlotsInput!) { createDailySlots(input: $input) { slotId } }`,
  CREATE_AVAILABILITY_EXCEPTION: `mutation CreateAvailabilityException($input: CreateAvailabilityExceptionInput!) { createAvailabilityException(input: $input) { exceptionId } }`,
  CREATE_BOOKING_CONFIGURATION: `mutation CreateBookingConfiguration($input: CreateBookingConfigurationInput!) { createBookingConfiguration(input: $input) { bookingConfigurationId } }`,
  CREATE_SERVICE_TYPE_BOOKING: `mutation CreateServiceTypeBooking($input: CreateServiceTypeBookingInput!) { createServiceTypeBooking(input: $input) { bookingConfigurationId } }`,
  UPDATE_BOOKING_CONFIGURATION: `mutation UpdateBookingConfiguration($id: String!, $input: UpdateBookingConfigurationInput!) { updateBookingConfiguration(id: $id, input: $input) { bookingConfigurationId } }`,
};

export { bookingMutations };
