import { APIClient } from '../../api/APIClient.js';
import { Mailing } from './MailingController.js';
import { Notification } from './NotificationController.js';
import { WaitingList } from './WaitingListController.js';

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
