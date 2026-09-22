import { APIClient } from '../../api/APIClient.js';
import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';
export declare class BookingDomain {
    bookingConfiguration: BookingConfigurationController;
    booking: BookingController;
    timeSlot: TimeSlotController;
    constructor(client: APIClient);
}
