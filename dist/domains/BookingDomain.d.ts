import { APIClient } from '../api/APIClient.js';
import { BookingConfigurationController } from './booking/BookingConfigurationController.js';
import { BookingController } from './booking/BookingController.js';
import { TimeSlotController } from './booking/TimeSlotController.js';
export declare class BookingDomain {
    bookingConfigurationController: BookingConfigurationController;
    bookingController: BookingController;
    timeSlotController: TimeSlotController;
    constructor(client: APIClient);
}
