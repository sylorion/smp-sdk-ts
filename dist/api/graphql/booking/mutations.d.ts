declare const bookingMutations: {
    CREATE_ESTIMATE_REQUEST: string;
    CREATE_BOOKING: string;
    CREATE_AVAILABILITY: string;
    CREATE_BOOKING_WITH_SLOT: string;
    CREATE_WEEKLY_AVAILABILITY_BATCH: string;
    CREATE_AVAILABILITY_EXCEPTION: string;
    CANCEL_BOOKING: string;
    UPDATE_BOOKING: string;
};
export { bookingMutations };
declare const bookingConfigurationMutations: {
    CREATE_BOOKING_CONFIGURATION: string;
    UPDATE_BOOKING_CONFIGURATION: string;
};
export { bookingConfigurationMutations };
declare const timeSlotMutations: {
    CREATE_TIME_SLOT: string;
    UPDATE_TIME_SLOT: string;
    DELETE_TIME_SLOT: string;
};
export { timeSlotMutations };
