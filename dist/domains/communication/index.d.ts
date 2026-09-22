import { APIClient } from '../../api/APIClient.js';
import { Mailing } from './MailingController.js';
import { Notification } from './NotificationController.js';
import { WaitingList } from './WaitingListController.js';
export declare class CommunicationDomain {
    mailing: Mailing;
    notification: Notification;
    waitingList: WaitingList;
    constructor(client: APIClient);
}
