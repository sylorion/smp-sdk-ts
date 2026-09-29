import { timeSlotMutations } from '../../api/graphql/booking/mutations.js';
// Re-export des types pour faciliter l'utilisation
export { TimeSlotType, TimeSlotStatus, TimeSlotPriority } from '../../types/communication/index.js';
/**
 * Créneaux (mu-command) : seules les mutations `createTimeSlot`, `updateTimeSlot` et
 * `deleteTimeSlot` existent côté service. Les créneaux se lisent via les engagements
 * (`Engagement.timeSlots`) ou le calendrier (`booking.booking.listCalendarSlots`).
 */
export class TimeSlotController {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    // ===== MUTATIONS =====
    async create(data) {
        const response = await this.apiClient.mutate(timeSlotMutations.CREATE_TIME_SLOT, { data });
        return response.createTimeSlot;
    }
    async update(timeSlotId, data) {
        const response = await this.apiClient.mutate(timeSlotMutations.UPDATE_TIME_SLOT, { timeSlotId, data });
        return response.updateTimeSlot;
    }
    async delete(timeSlotId) {
        const response = await this.apiClient.mutate(timeSlotMutations.DELETE_TIME_SLOT, { timeSlotId });
        return response.deleteTimeSlot;
    }
}
