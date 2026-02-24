import { APIClient } from '../api/APIClient.js';
import { Mailing } from './communication/MailingController.js';
import { Notification } from './communication/NotificationController.js';
import { WaitingList } from './communication/WaitingListController.js';

export class CommunicationDomain {
  public mailing: Mailing;
  public notification: Notification;
  public waitingList: WaitingList;

  constructor(client: APIClient) {
    this.mailing = new Mailing(client);
    this.notification = new Notification(client);
    this.waitingList = new WaitingList(client);
  }
}
