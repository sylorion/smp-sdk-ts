import { timeSlotMutations } from '../api/graphql/mutations/timeSlot/timeSlotMutations.js';
import { timeSlotQueries } from '../api/graphql/queries/timeSlot/timeSlotQueries.js';
// Re-export des types pour faciliter l'utilisation
export { TimeSlotType, TimeSlotStatus, TimeSlotPriority } from '../api/graphql/types/engagement/EngagementTypes.js';
export class TimeSlotController {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    // ===== QUERIES =====
    /**
     * Récupérer les timeSlots par service (disponibilités générales)
     */
    async getTimeSlotsByService(serviceId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_SERVICE, { serviceId });
        return response.timeSlotsByService;
    }
    /**
     * Récupérer les timeSlots par engagement
     */
    async getTimeSlotsByEngagement(engagementId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_ENGAGEMENT, { engagementId });
        return response.timeSlotsByEngagement;
    }
    /**
     * Récupérer les timeSlots par milestone
     */
    async getTimeSlotsByMilestone(engagementMilestoneId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_MILESTONE, { engagementMilestoneId });
        return response.timeSlotsByMilestone;
    }
    /**
     * Récupérer les timeSlots par utilisateur
     */
    async getTimeSlotsByUser(userId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_USER, { userId });
        return response.timeSlotsByUser;
    }
    /**
     * Récupérer les timeSlots par période
     */
    async getTimeSlotsByDateRange(startDate, endDate) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOTS_BY_DATE_RANGE, { startDate, endDate });
        return response.timeSlotsByDateRange;
    }
    /**
     * Récupérer un timeSlot spécifique
     */
    async getTimeSlot(timeSlotId) {
        const response = await this.apiClient.query(timeSlotQueries.GET_TIME_SLOT, { timeSlotId });
        return response.timeSlot;
    }
    /**
     * Récupérer les timeSlots disponibles pour booking
     */
    async getAvailableTimeSlots(serviceId, startDate, endDate) {
        const response = await this.apiClient.query(timeSlotQueries.GET_AVAILABLE_TIME_SLOTS, { serviceId, startDate, endDate });
        return response.availableTimeSlots;
    }
    // ===== MUTATIONS =====
    /**
     * Créer un timeSlot
     */
    async createTimeSlot(data) {
        const response = await this.apiClient.mutate(timeSlotMutations.CREATE_TIME_SLOT, { data });
        return response.createTimeSlot;
    }
    /**
     * Mettre à jour un timeSlot
     */
    async updateTimeSlot(timeSlotId, data) {
        const response = await this.apiClient.mutate(timeSlotMutations.UPDATE_TIME_SLOT, { timeSlotId, data });
        return response.updateTimeSlot;
    }
    /**
     * Supprimer un timeSlot
     */
    async deleteTimeSlot(timeSlotId) {
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
