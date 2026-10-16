import { APIClient } from '../../api/APIClient.js';
import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';
import { AgendaController } from './AgendaController.js';

export { AgendaController };

export class BookingDomain {
  public bookingConfiguration: BookingConfigurationController;
  public booking: BookingController;
  public timeSlot: TimeSlotController;
  /** Agenda des membres d'une organisation (réunions, rendez-vous, indisponibilités). */
  public agenda: AgendaController;

  constructor(client: APIClient) {
    this.bookingConfiguration = new BookingConfigurationController(client);
    this.booking = new BookingController(client);
    this.timeSlot = new TimeSlotController(client);
    this.agenda = new AgendaController(client);
  }
}
