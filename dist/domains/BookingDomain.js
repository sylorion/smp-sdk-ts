import { BookingConfigurationController } from './booking/BookingConfigurationController.js';
import { BookingController } from './booking/BookingController.js';
import { TimeSlotController } from './booking/TimeSlotController.js';
export class BookingDomain {
    constructor(client) {
        this.bookingConfigurationController = new BookingConfigurationController(client);
        this.bookingController = new BookingController(client);
        this.timeSlotController = new TimeSlotController(client);
    }
}
