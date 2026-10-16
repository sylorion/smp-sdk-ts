import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';
import { AgendaController } from './AgendaController.js';
export { AgendaController };
export class BookingDomain {
    constructor(client) {
        this.bookingConfiguration = new BookingConfigurationController(client);
        this.booking = new BookingController(client);
        this.timeSlot = new TimeSlotController(client);
        this.agenda = new AgendaController(client);
    }
}
