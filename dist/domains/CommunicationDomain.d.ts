import { APIClient } from '../api/APIClient.js';
import { Mailing } from './communication/MailingController.js';
import { Notification } from './communication/NotificationController.js';
import { WaitingList } from './communication/WaitingListController.js';
export declare class CommunicationDomain {
    mailing: Mailing;
    notification: Notification;
    waitingList: WaitingList;
    constructor(client: APIClient);
}
