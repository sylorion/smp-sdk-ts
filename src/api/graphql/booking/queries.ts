import { gql } from 'graphql-request';

// =========================================
// Source: timeSlot/timeSlotQueries.ts
// =========================================
const timeSlotQueries = {
  // QUERY POUR RÉCUPÉRER LES TIMESLOTS PAR SERVICE (disponibilités générales)
  GET_TIME_SLOTS_BY_SERVICE: `
    query GetTimeSlotsByService($serviceId: String!) {
      timeSlotsByService(serviceId: $serviceId) {
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

  // QUERY POUR RÉCUPÉRER LES TIMESLOTS PAR ENGAGEMENT
  GET_TIME_SLOTS_BY_ENGAGEMENT: `
    query GetTimeSlotsByEngagement($engagementId: String!) {
      timeSlotsByEngagement(engagementId: $engagementId) {
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

  // QUERY POUR RÉCUPÉRER LES TIMESLOTS PAR MILESTONE
  GET_TIME_SLOTS_BY_MILESTONE: `
    query GetTimeSlotsByMilestone($engagementMilestoneId: String!) {
      timeSlotsByMilestone(engagementMilestoneId: $engagementMilestoneId) {
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

  // QUERY POUR RÉCUPÉRER LES TIMESLOTS PAR UTILISATEUR
  GET_TIME_SLOTS_BY_USER: `
    query GetTimeSlotsByUser($userId: String!) {
      timeSlotsByUser(userId: $userId) {
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

  // QUERY POUR RÉCUPÉRER LES TIMESLOTS PAR PÉRIODE
  GET_TIME_SLOTS_BY_DATE_RANGE: `
    query GetTimeSlotsByDateRange($startDate: DateTime!, $endDate: DateTime!) {
      timeSlotsByDateRange(startDate: $startDate, endDate: $endDate) {
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

  // QUERY POUR RÉCUPÉRER UN TIMESLOT SPÉCIFIQUE
  GET_TIME_SLOT: `
    query GetTimeSlot($timeSlotId: String!) {
      timeSlot(timeSlotId: $timeSlotId) {
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

  // QUERY POUR RÉCUPÉRER LES TIMESLOTS DISPONIBLES (pour booking)
  GET_AVAILABLE_TIME_SLOTS: `
    query GetAvailableTimeSlots($serviceId: String!, $startDate: DateTime!, $endDate: DateTime!) {
      availableTimeSlots(serviceId: $serviceId, startDate: $startDate, endDate: $endDate) {
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

export { timeSlotQueries };



// =========================================
// Booking / Availability / Estimate queries
// =========================================
const bookingQueries = {
  GET_ESTIMATE_REQUESTS: `query GetEstimateRequests($serviceId: String!, $userId: String) { estimateRequests(serviceId: $serviceId, userId: $userId) { estimateRequestId status } }`,
  GET_ESTIMATE_REQUEST: `query GetEstimateRequest($estimateRequestId: String!) { estimateRequest(estimateRequestId: $estimateRequestId) { estimateRequestId status } }`,
  GET_BOOKINGS_BY_SERVICE: `query GetBookingsByService($serviceId: String!) { bookingsByService(serviceId: $serviceId) { bookingId status } }`,
  GET_BOOKINGS_BY_USER: `query GetBookingsByUser($userId: String!) { bookingsByUser(userId: $userId) { bookingId status } }`,
  GET_CALENDAR_DATA: `query GetCalendarData($serviceId: String!, $startDate: DateTime!, $endDate: DateTime!) { weeklyAvailabilities(serviceId: $serviceId) { weeklyAvailabilityId } availabilityExceptions(serviceId: $serviceId, startDate: $startDate, endDate: $endDate) { exceptionId } bookingsByService(serviceId: $serviceId) { bookingId } calendarSlots(serviceId: $serviceId, startDate: $startDate, endDate: $endDate) { slotId } }`,
  GET_BOOKINGS_BY_AVAILABILITY: `query GetBookingsByAvailability($availabilityId: String!) { bookingsByAvailability(availabilityId: $availabilityId) { bookingId status } }`,
  SEARCH_AVAILABILITIES: `query SearchAvailabilities($input: SearchAvailabilityInput!) { searchAvailabilities(input: $input) { availabilityId } }`,
  GET_WEEKLY_AVAILABILITIES: `query GetWeeklyAvailabilities($serviceId: String!, $userId: String!) { weeklyAvailabilities(serviceId: $serviceId, userId: $userId) { weeklyAvailabilityId } }`,
  GET_DAILY_SLOTS: `query GetDailySlots($input: SearchDailySlotsInput!) { dailySlots(input: $input) { slotId } }`,
  GET_AVAILABLE_SLOTS: `query GetAvailableSlots($input: AvailableSlotsInput!) { availableSlots(input: $input) { slotId isAvailable startTime endTime } }`,
  GET_CALENDAR_SLOTS: `query GetCalendarSlots($serviceId: String!, $startDate: DateTime!, $endDate: DateTime!, $userId: String) { calendarSlots(serviceId: $serviceId, startDate: $startDate, endDate: $endDate, userId: $userId) { slotId isAvailable startTime endTime } }`,
  GET_AVAILABILITY_EXCEPTIONS: `query GetAvailabilityExceptions($serviceId: String!, $userId: String!, $startDate: DateTime!, $endDate: DateTime!) { availabilityExceptions(serviceId: $serviceId, userId: $userId, startDate: $startDate, endDate: $endDate) { exceptionId } }`,
  GET_BOOKING_CONFIGURATION: `query GetBookingConfiguration($id: String!) { bookingConfiguration(id: $id) { bookingConfigurationId } }`,
  GET_BOOKING_CONFIGURATION_BY_SERVICE: `query GetBookingConfigurationByService($serviceId: String!) { bookingConfigurationByService(serviceId: $serviceId) { bookingConfigurationId } }`,
  GET_BOOKING_CONFIGURATIONS_BY_USER: `query GetBookingConfigurationsByUser($userId: String!) { bookingConfigurationsByUser(userId: $userId) { bookingConfigurationId } }`,
};

export { bookingQueries };
