import { APIClient } from '../../api/APIClient.js';
import { BookingConfigurationController } from './BookingConfigurationController.js';
import { BookingController } from './BookingController.js';
import { TimeSlotController } from './TimeSlotController.js';

export class BookingDomain {
  public bookingConfiguration: BookingConfigurationController;
  public booking: BookingController;
  public timeSlot: TimeSlotController;

  constructor(client: APIClient) {
    this.bookingConfiguration = new BookingConfigurationController(client);
    this.booking = new BookingController(client);
    this.timeSlot = new TimeSlotController(client);
  }
}
