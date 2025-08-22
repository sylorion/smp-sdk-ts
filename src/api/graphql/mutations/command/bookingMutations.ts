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
        unloggedUser
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
      createBooking(input: $input) {
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
      createBooking(input: $input) {
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
};

export { bookingMutations };
