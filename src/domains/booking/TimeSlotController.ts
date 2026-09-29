import { APIClient } from '../../api/APIClient.js';
import { timeSlotMutations } from '../../api/graphql/booking/mutations.js';
import {
  TimeSlot,
  TimeSlotType,
  TimeSlotStatus,
  TimeSlotPriority,
  CreateTimeSlotInput,
  UpdateTimeSlotInput
} from '../../types/communication/index.js';

// Re-export des types pour faciliter l'utilisation
export {
  TimeSlot,
  TimeSlotType,
  TimeSlotStatus,
  TimeSlotPriority,
  CreateTimeSlotInput,
  UpdateTimeSlotInput
} from '../../types/communication/index.js';

/**
 * Créneaux (mu-command) : seules les mutations `createTimeSlot`, `updateTimeSlot` et
 * `deleteTimeSlot` existent côté service. Les créneaux se lisent via les engagements
 * (`Engagement.timeSlots`) ou le calendrier (`booking.booking.listCalendarSlots`).
 */
export class TimeSlotController {
  constructor(private apiClient: APIClient) { }

  // ===== MUTATIONS =====

  async create(data: CreateTimeSlotInput): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.CREATE_TIME_SLOT,
      { data }
    ) as { createTimeSlot: TimeSlot };
    return response.createTimeSlot;
  }

  async update(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.UPDATE_TIME_SLOT,
      { timeSlotId, data }
    ) as { updateTimeSlot: TimeSlot };
    return response.updateTimeSlot;
  }

  async delete(timeSlotId: string): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.DELETE_TIME_SLOT,
      { timeSlotId }
    ) as { deleteTimeSlot: TimeSlot };
    return response.deleteTimeSlot;
  }

}
