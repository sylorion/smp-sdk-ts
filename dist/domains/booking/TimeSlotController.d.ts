import { APIClient } from '../../api/APIClient.js';
import { TimeSlot, CreateTimeSlotInput, UpdateTimeSlotInput } from '../../types/communication/index.js';
export { TimeSlot, TimeSlotType, TimeSlotStatus, TimeSlotPriority, CreateTimeSlotInput, UpdateTimeSlotInput } from '../../types/communication/index.js';
/**
 * Créneaux (mu-command) : seules les mutations `createTimeSlot`, `updateTimeSlot` et
 * `deleteTimeSlot` existent côté service. Les créneaux se lisent via les engagements
 * (`Engagement.timeSlots`) ou le calendrier (`booking.booking.listCalendarSlots`).
 */
export declare class TimeSlotController {
    private apiClient;
    constructor(apiClient: APIClient);
    create(data: CreateTimeSlotInput): Promise<TimeSlot>;
    update(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot>;
    delete(timeSlotId: string): Promise<TimeSlot>;
}
