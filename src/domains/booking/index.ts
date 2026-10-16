import { APIClient } from '../../api/APIClient.js';
import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';
import { AgendaController } from './AgendaController.js';
import { ProjectsController } from './ProjectsController.js';

export { AgendaController, ProjectsController };

export class BookingDomain {
  public bookingConfiguration: BookingConfigurationController;
  public booking: BookingController;
  public timeSlot: TimeSlotController;
  /** Agenda des membres d'une organisation (réunions, rendez-vous, indisponibilités). */
  public agenda: AgendaController;
  /** Projets internes : activités, livrables, prérequis, qui attend quoi. */
  public projects: ProjectsController;

  constructor(client: APIClient) {
    this.bookingConfiguration = new BookingConfigurationController(client);
    this.booking = new BookingController(client);
    this.timeSlot = new TimeSlotController(client);
    this.agenda = new AgendaController(client);
    this.projects = new ProjectsController(client);
  }
}
