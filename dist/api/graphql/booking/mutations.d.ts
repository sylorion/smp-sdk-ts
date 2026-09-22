declare const bookingMutations: {
    CREATE_ESTIMATE_REQUEST: string;
    CREATE_BOOKING: string;
    CREATE_AVAILABILITY: string;
    UPDATE_AVAILABILITY: string;
    CANCEL_AVAILABILITY: string;
    CREATE_WEEKLY_AVAILABILITY: string;
    CREATE_BOOKING_WITH_SLOT: string;
    CREATE_WEEKLY_AVAILABILITY_BATCH: string;
    CREATE_DAILY_SLOTS: string;
    CREATE_AVAILABILITY_EXCEPTION: string;
    CANCEL_BOOKING: string;
    UPDATE_BOOKING: string;
};
export { bookingMutations };
declare const bookingConfigurationMutations: {
    CREATE_BOOKING_CONFIGURATION: string;
    CREATE_SERVICE_TYPE_BOOKING: string;
    UPDATE_BOOKING_CONFIGURATION: string;
};
export { bookingConfigurationMutations };
declare const timeSlotMutations: {
    CREATE_TIME_SLOT: string;
    UPDATE_TIME_SLOT: string;
    DELETE_TIME_SLOT: string;
    CREATE_TIME_SLOTS_BATCH: string;
    ASSIGN_TIME_SLOT_TO_ENGAGEMENT: string;
    ASSIGN_TIME_SLOT_TO_MILESTONE: string;
};
export { timeSlotMutations };
