import { APIClient } from '../../api/APIClient.js';
import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';
import { AgendaController } from './AgendaController.js';
import { ProjectsController } from './ProjectsController.js';
export { AgendaController, ProjectsController };
export declare class BookingDomain {
    bookingConfiguration: BookingConfigurationController;
    booking: BookingController;
    timeSlot: TimeSlotController;
    /** Agenda des membres d'une organisation (réunions, rendez-vous, indisponibilités). */
    agenda: AgendaController;
    /** Projets internes : activités, livrables, prérequis, qui attend quoi. */
    projects: ProjectsController;
    constructor(client: APIClient);
}
