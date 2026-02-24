import { APIClient } from '../../api/APIClient.js';
import { timeSlotMutations } from '../../api/graphql/booking/mutations.js';
import { timeSlotQueries } from '../../api/graphql/booking/queries.js';
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

export class TimeSlotController {
  constructor(private apiClient: APIClient) { }

  // ===== QUERIES =====

  /**
   * Récupérer les timeSlots par service (disponibilités générales)
   */
  async listTimeSlotsByService(serviceId: string): Promise<TimeSlot[]> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_TIME_SLOTS_BY_SERVICE,
      { serviceId }
    ) as { timeSlotsByService: TimeSlot[] };
    return response.timeSlotsByService;
  }

  /**
   * Récupérer les timeSlots par engagement
   */
  async listTimeSlotsByEngagement(engagementId: string): Promise<TimeSlot[]> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_TIME_SLOTS_BY_ENGAGEMENT,
      { engagementId }
    ) as { timeSlotsByEngagement: TimeSlot[] };
    return response.timeSlotsByEngagement;
  }

  /**
   * Récupérer les timeSlots par milestone
   */
  async listTimeSlotsByMilestone(engagementMilestoneId: string): Promise<TimeSlot[]> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_TIME_SLOTS_BY_MILESTONE,
      { engagementMilestoneId }
    ) as { timeSlotsByMilestone: TimeSlot[] };
    return response.timeSlotsByMilestone;
  }

  /**
   * Récupérer les timeSlots par utilisateur
   */
  async listTimeSlotsByUser(userId: string): Promise<TimeSlot[]> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_TIME_SLOTS_BY_USER,
      { userId }
    ) as { timeSlotsByUser: TimeSlot[] };
    return response.timeSlotsByUser;
  }

  /**
   * Récupérer les timeSlots par période
   */
  async listTimeSlotsByDateRange(startDate: string, endDate: string): Promise<TimeSlot[]> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_TIME_SLOTS_BY_DATE_RANGE,
      { startDate, endDate }
    ) as { timeSlotsByDateRange: TimeSlot[] };
    return response.timeSlotsByDateRange;
  }

  /**
   * Récupérer un timeSlot spécifique
   */
  async getTimeSlotById(timeSlotId: string): Promise<TimeSlot> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_TIME_SLOT,
      { timeSlotId }
    ) as { timeSlot: TimeSlot };
    return response.timeSlot;
  }

  /**
   * Récupérer les timeSlots disponibles pour booking
   */
  async listAvailableTimeSlots(serviceId: string, startDate: string, endDate: string): Promise<TimeSlot[]> {
    const response = await this.apiClient.query(
      timeSlotQueries.GET_AVAILABLE_TIME_SLOTS,
      { serviceId, startDate, endDate }
    ) as { availableTimeSlots: TimeSlot[] };
    return response.availableTimeSlots;
  }

  // ===== MUTATIONS =====

  /**
   * Créer un timeSlot
   */
  async createTimeSlot(data: CreateTimeSlotInput): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.CREATE_TIME_SLOT,
      { data }
    ) as { createTimeSlot: TimeSlot };
    return response.createTimeSlot;
  }

  /**
   * Mettre à jour un timeSlot
   */
  async updateTimeSlot(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.UPDATE_TIME_SLOT,
      { timeSlotId, data }
    ) as { updateTimeSlot: TimeSlot };
    return response.updateTimeSlot;
  }

  /**
   * Supprimer un timeSlot
   */
  async deleteTimeSlot(timeSlotId: string): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.DELETE_TIME_SLOT,
      { timeSlotId }
    ) as { deleteTimeSlot: TimeSlot };
    return response.deleteTimeSlot;
  }

  /**
   * Créer des timeSlots en lot
   */
  async createTimeSlotsBatch(data: CreateTimeSlotInput[]): Promise<TimeSlot[]> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.CREATE_TIME_SLOTS_BATCH,
      { data }
    ) as { createTimeSlotsBatch: TimeSlot[] };
    return response.createTimeSlotsBatch;
  }

  /**
   * Assigner un timeSlot à un engagement
   */
  async assignTimeSlotToEngagement(timeSlotId: string, engagementId: string): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.ASSIGN_TIME_SLOT_TO_ENGAGEMENT,
      { timeSlotId, engagementId }
    ) as { assignTimeSlotToEngagement: TimeSlot };
    return response.assignTimeSlotToEngagement;
  }

  /**
   * Assigner un timeSlot à un milestone
   */
  async assignTimeSlotToMilestone(timeSlotId: string, engagementMilestoneId: string): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      timeSlotMutations.ASSIGN_TIME_SLOT_TO_MILESTONE,
      { timeSlotId, engagementMilestoneId }
    ) as { assignTimeSlotToMilestone: TimeSlot };
    return response.assignTimeSlotToMilestone;
  }
}
