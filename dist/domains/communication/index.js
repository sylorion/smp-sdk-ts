import { Mailing } from './MailingController.js';
import { Notification } from './NotificationController.js';
import { WaitingList } from './WaitingListController.js';
export class CommunicationDomain {
    constructor(client) {
        this.mailing = new Mailing(client);
        this.notification = new Notification(client);
        this.waitingList = new WaitingList(client);
    }
}
