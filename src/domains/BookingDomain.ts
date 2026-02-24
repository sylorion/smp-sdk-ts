import { APIClient } from '../api/APIClient.js';
import { BookingConfigurationController } from './booking/BookingConfigurationController.js';
import { BookingController } from './booking/BookingController.js';
import { TimeSlotController } from './booking/TimeSlotController.js';

export class BookingDomain {
  public bookingConfigurationController: BookingConfigurationController;
  public bookingController: BookingController;
  public timeSlotController: TimeSlotController;

  constructor(client: APIClient) {
    this.bookingConfigurationController = new BookingConfigurationController(client);
    this.bookingController = new BookingController(client);
    this.timeSlotController = new TimeSlotController(client);
  }
}
