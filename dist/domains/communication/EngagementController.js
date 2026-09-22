import { engagementMutations } from '../../api/graphql/communication/mutations.js';
import { engagementQueries } from '../../api/graphql/communication/queries.js';
// Re-export des types pour faciliter l'utilisation
export { EngagementStatus, EngagementPriority, TimeSlotType, TimeSlotStatus, TimeSlotPriority, EngagementReportStatus } from '../../types/communication/index.js';
export class EngagementController {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    // ===== ENGAGEMENTS =====
    /**
     * Récupérer les engagements par service
     */
    async listByServiceId(serviceId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENTS_BY_SERVICE_ID, { serviceId });
        return response.engagementsByService;
    }
    /**
     * Récupérer les engagements par consultant
     */
    async listByConsultantUserId(consultantUserId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENTS_BY_CONSULTANT, { consultantUserId });
        return response.engagementsByConsultant;
    }
    /**
     * Récupérer les engagements par organisation
     */
    async listByOrganizationId(organizationId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENTS_BY_ORGANIZATION, { organizationId });
        return response.engagementsByOrganization;
    }
    /**
     * Récupérer un engagement spécifique
     */
    async getById(engagementId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENT, { engagementId });
        return response.engagement;
    }
    /**
     * Récupérer les engagements par estimate
     */
    async listByEstimateId(estimateId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENTS_BY_ESTIMATE, { estimateId });
        return response.engagementsByEstimate;
    }
    /**
     * Créer un engagement
     */
    async create(data) {
        const response = await this.apiClient.mutate(engagementMutations.CREATE_ENGAGEMENT, { data });
        return response.createEngagement;
    }
    /**
     * Mettre à jour un engagement
     */
    async update(engagementId, data) {
        const response = await this.apiClient.mutate(engagementMutations.UPDATE_ENGAGEMENT, { engagementId, data });
        return response.updateEngagement;
    }
    /**
     * Supprimer un engagement
     */
    async delete(engagementId) {
        const response = await this.apiClient.mutate(engagementMutations.DELETE_ENGAGEMENT, { engagementId });
        return response.deleteEngagement;
    }
    // ===== CRÉNEAUX TEMPORELS =====
    /**
     * Créer un créneau temporel
     */
    async createTimeSlot(data) {
        const response = await this.apiClient.mutate(engagementMutations.CREATE_TIME_SLOT, { data });
        return response.createTimeSlot;
    }
    /**
     * Mettre à jour un créneau temporel
     */
    async updateTimeSlot(timeSlotId, data) {
        const response = await this.apiClient.mutate(engagementMutations.UPDATE_TIME_SLOT, { timeSlotId, data });
        return response.updateTimeSlot;
    }
    /**
     * Supprimer un créneau temporel
     */
    async deleteTimeSlot(timeSlotId) {
        const response = await this.apiClient.mutate(engagementMutations.DELETE_TIME_SLOT, { timeSlotId });
        return response.deleteTimeSlot;
    }
    // ===== RAPPORTS D'ENGAGEMENT =====
    /**
     * Récupérer un rapport d'engagement par token
     */
    async getReportByToken(token) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENT_REPORT_BY_TOKEN, { token });
        return response.engagementReportByToken;
    }
    /**
     * Récupérer les rapports d'engagement par engagement
     */
    async listReportsByEngagementId(engagementId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENT_REPORTS_BY_ENGAGEMENT, { engagementId });
        return response.engagementReportsByEngagement;
    }
    /**
     * Récupérer les rapports d'engagement par consultant
     */
    async listReportsByConsultantUserId(consultantUserId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENT_REPORTS_BY_CONSULTANT, { consultantUserId });
        return response.engagementReportsByConsultant;
    }
    /**
     * Récupérer les rapports d'engagement par organisation
     */
    async listReportsByOrganizationId(organizationId) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENT_REPORTS_BY_ORGANIZATION, { organizationId });
        return response.engagementReportsByOrganization;
    }
    /**
     * Récupérer les rapports d'engagement par période
     */
    async listReportsByPeriod(year, periodType, periodValue) {
        const response = await this.apiClient.query(engagementQueries.GET_ENGAGEMENT_REPORTS_BY_PERIOD, { year, periodType, periodValue });
        return response.engagementReportsByPeriod;
    }
    /**
     * Créer un rapport d'engagement
     */
    async createEngagementReport(data) {
        const response = await this.apiClient.mutate(engagementMutations.CREATE_ENGAGEMENT_REPORT, { data });
        return response.createEngagementReport;
    }
    /**
     * Mettre à jour un rapport d'engagement
     */
    async updateEngagementReport(engagementReportId, data) {
        const response = await this.apiClient.mutate(engagementMutations.UPDATE_ENGAGEMENT_REPORT, { engagementReportId, data });
        return response.updateEngagementReport;
    }
    /**
     * Supprimer un rapport d'engagement
     */
    async deleteEngagementReport(engagementReportId) {
        const response = await this.apiClient.mutate(engagementMutations.DELETE_ENGAGEMENT_REPORT, { engagementReportId });
        return response.deleteEngagementReport;
    }
    /**
     * Créer un rapport pour une nouvelle période
     */
    async createReportForNewPeriod(engagementId, periodType, periodValue, year) {
        const response = await this.apiClient.mutate(engagementMutations.CREATE_REPORT_FOR_NEW_PERIOD, { engagementId, periodType, periodValue, year });
        return response.createReportForNewPeriod;
    }
}
