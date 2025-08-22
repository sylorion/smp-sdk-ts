const bookingQueries = {
  // QUERY POUR RÉCUPÉRER LES DISPONIBILITÉS HEBDOMADAIRES
  GET_WEEKLY_AVAILABILITIES: `
    query GetWeeklyAvailabilities($serviceId: String!, $userId: String!) {
      weeklyAvailabilities(serviceId: $serviceId, userId: $userId) {
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

  // QUERY POUR RÉCUPÉRER LES EXCEPTIONS DE DISPONIBILITÉ
  GET_AVAILABILITY_EXCEPTIONS: `
    query GetAvailabilityExceptions($serviceId: String!, $userId: String!, $startDate: DateTime!, $endDate: DateTime!) {
      availabilityExceptions(serviceId: $serviceId, userId: $userId, startDate: $startDate, endDate: $endDate) {
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

  // QUERY POUR RECHERCHER DES DISPONIBILITÉS
  SEARCH_AVAILABILITIES: `
    query SearchAvailabilities($input: SearchAvailabilityInput!) {
      searchAvailabilities(input: $input) {
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

  // QUERY POUR RÉCUPÉRER LES CRÉNEAUX DISPONIBLES
  GET_AVAILABLE_SLOTS: `
    query GetAvailableSlots($input: AvailableSlotsInput!) {
      availableSlots(input: $input) {
        slotId
        startTime
        endTime
        duration
        availableCapacity
        totalCapacity
        serviceId
        isAvailable
        remainingSlots
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES CRÉNEAUX QUOTIDIENS
  GET_DAILY_SLOTS: `
    query GetDailySlots($input: SearchDailySlotsInput!) {
      dailySlots(input: $input) {
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

  // QUERY POUR RÉCUPÉRER LES CRÉNEAUX DU CALENDRIER
  GET_CALENDAR_SLOTS: `
    query GetCalendarSlots($serviceId: String!, $startDate: DateTime!, $endDate: DateTime!, $userId: String) {
      calendarSlots(serviceId: $serviceId, startDate: $startDate, endDate: $endDate, userId: $userId) {
        slotId
        startTime
        endTime
        duration
        availableCapacity
        totalCapacity
        serviceId
        isAvailable
        remainingSlots
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES DEMANDES DE DEVIS
  GET_ESTIMATE_REQUESTS: `
    query GetEstimateRequests($serviceId: String!, $userId: String) {
      estimateRequests(serviceId: $serviceId, userId: $userId) {
        estimateRequestId
        serviceId
        userId
        requestedStartDate
        requestedEndDate
        requestedDuration
        description
        status
        unloggedUser
        additionalRequirements
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER UNE DEMANDE DE DEVIS SPÉCIFIQUE
  GET_ESTIMATE_REQUEST: `
    query GetEstimateRequest($estimateRequestId: String!) {
      estimateRequest(estimateRequestId: $estimateRequestId) {
        estimateRequestId
        serviceId
        userId
        requestedStartDate
        requestedEndDate
        requestedDuration
        description
        status
        unloggedUser
        additionalRequirements
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RÉSERVATIONS PAR SERVICE
  GET_BOOKINGS_BY_SERVICE: `
    query GetBookingsByService($serviceId: String!) {
      bookingsByService(serviceId: $serviceId) {
        bookingId
        serviceId
        availabilityId
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
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RÉSERVATIONS PAR UTILISATEUR
  GET_BOOKINGS_BY_USER: `
    query GetBookingsByUser($userId: String!) {
      bookingsByUser(userId: $userId) {
        bookingId
        serviceId
        availabilityId
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
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES RÉSERVATIONS PAR DISPONIBILITÉ
  GET_BOOKINGS_BY_AVAILABILITY: `
    query GetBookingsByAvailability($availabilityId: String!) {
      bookingsByAvailability(availabilityId: $availabilityId) {
        bookingId
        serviceId
        availabilityId
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
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LA CONFIGURATION DE BOOKING
  GET_BOOKING_CONFIGURATION: `
    query GetBookingConfiguration($id: String!) {
      bookingConfiguration(id: $id) {
        bookingConfigurationId
        userId
        serviceId
        bookingMode
        defaultSlotDuration
        allowGroupBooking
        minBookingDuration
        maxBookingDuration
        dateRangeBookingAllowed
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LA CONFIGURATION DE BOOKING PAR SERVICE
  GET_BOOKING_CONFIGURATION_BY_SERVICE: `
    query GetBookingConfigurationByService($serviceId: String!) {
      bookingConfigurationByService(serviceId: $serviceId) {
        bookingConfigurationId
        userId
        serviceId
        bookingMode
        defaultSlotDuration
        allowGroupBooking
        minBookingDuration
        maxBookingDuration
        dateRangeBookingAllowed
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // QUERY POUR RÉCUPÉRER LES CONFIGURATIONS DE BOOKING PAR UTILISATEUR
  GET_BOOKING_CONFIGURATIONS_BY_USER: `
    query GetBookingConfigurationsByUser($userId: String!) {
      bookingConfigurationsByUser(userId: $userId) {
        bookingConfigurationId
        userId
        serviceId
        bookingMode
        defaultSlotDuration
        allowGroupBooking
        minBookingDuration
        maxBookingDuration
        dateRangeBookingAllowed
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  // NOUVELLE QUERY POUR RÉCUPÉRER LES DONNÉES COMPLÈTES DU CALENDRIER
  GET_CALENDAR_DATA: `
    query GetCalendarData($serviceId: String!, $startDate: DateTime!, $endDate: DateTime!) {
      weeklyAvailabilities(serviceId: $serviceId) {
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
      availabilityExceptions(serviceId: $serviceId, startDate: $startDate, endDate: $endDate) {
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
      bookingsByService(serviceId: $serviceId) {
        bookingId
        serviceId
        availabilityId
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
        createdAt
        updatedAt
        deletedAt
      }
      calendarSlots(serviceId: $serviceId, startDate: $startDate, endDate: $endDate) {
        slotId
        startTime
        endTime
        duration
        availableCapacity
        totalCapacity
        serviceId
        isAvailable
        remainingSlots
      }
    }
  `,


};

export { bookingQueries };
