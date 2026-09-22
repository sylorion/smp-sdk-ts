import { Mailing } from './communication/MailingController.js';
import { Notification } from './communication/NotificationController.js';
import { WaitingList } from './communication/WaitingListController.js';
export class CommunicationDomain {
    constructor(client) {
        this.mailing = new Mailing(client);
        this.notification = new Notification(client);
        this.waitingList = new WaitingList(client);
    }
}
