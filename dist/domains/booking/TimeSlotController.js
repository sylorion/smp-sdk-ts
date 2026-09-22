import { timeSlotMutations } from '../../api/graphql/booking/mutations.js';
import { timeSlotQueries } from '../../api/graphql/booking/queries.js';
// Re-export des types pour faciliter l'utilisation
export { TimeSlotType, TimeSlotStatus, TimeSlotPriority } from '../../types/communication/index.js';
export class TimeSlotController {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    // ===== QUERIES =====
    async listByServiceId(serviceId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_SERVICE, { serviceId });
        return response.timeSlotsByService;
    }
    async listByEngagementId(engagementId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_ENGAGEMENT, { engagementId });
        return response.timeSlotsByEngagement;
    }
    async listByMilestoneId(engagementMilestoneId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_MILESTONE, { engagementMilestoneId });
        return response.timeSlotsByMilestone;
    }
    async listByUserId(userId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_USER, { userId });
        return response.timeSlotsByUser;
    }
    /**
     * Récupérer les timeSlots par période
     */
    async listTimeSlotsByDateRange(startDate, endDate) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_DATE_RANGE, { startDate, endDate });
        return response.timeSlotsByDateRange;
    }
    async getById(timeSlotId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOT, { timeSlotId });
        return response.timeSlot;
    }
    /**
     * Récupérer les timeSlots disponibles pour booking
     */
    async listAvailableTimeSlots(serviceId, startDate, endDate) {
        const response = await this.apiClient.query(timeSlotQueries.GET_AVAILABLE_TIME_SLOTS, { serviceId, startDate, endDate });
        return response.availableTimeSlots;
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
    /**
     * Créer des timeSlots en lot
     */
    async createTimeSlotsBatch(data) {
        const response = await this.apiClient.mutate(timeSlotMutations.CREATE_TIME_SLOTS_BATCH, { data });
        return response.createTimeSlotsBatch;
    }
    /**
     * Assigner un timeSlot à un engagement
     */
    async assignTimeSlotToEngagement(timeSlotId, engagementId) {
        const response = await this.apiClient.mutate(timeSlotMutations.ASSIGN_TIME_SLOT_TO_ENGAGEMENT, { timeSlotId, engagementId });
        return response.assignTimeSlotToEngagement;
    }
    /**
     * Assigner un timeSlot à un milestone
     */
    async assignTimeSlotToMilestone(timeSlotId, engagementMilestoneId) {
        const response = await this.apiClient.mutate(timeSlotMutations.ASSIGN_TIME_SLOT_TO_MILESTONE, { timeSlotId, engagementMilestoneId });
        return response.assignTimeSlotToMilestone;
    }
}
