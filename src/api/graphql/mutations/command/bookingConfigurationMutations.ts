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
        advanceBookingLimit
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
        advanceBookingLimit
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
        advanceBookingLimit
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
};

export { bookingConfigurationMutations };
