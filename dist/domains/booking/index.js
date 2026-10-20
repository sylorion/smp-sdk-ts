import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';
import { AgendaController } from './AgendaController.js';
import { ProjectsController } from './ProjectsController.js';
export { AgendaController, ProjectsController };
export class BookingDomain {
    constructor(client) {
        this.bookingConfiguration = new BookingConfigurationController(client);
        this.booking = new BookingController(client);
        this.timeSlot = new TimeSlotController(client);
        this.agenda = new AgendaController(client);
        this.projects = new ProjectsController(client);
    }
}
