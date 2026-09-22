import { APIClient } from '../api/APIClient.js';
import { Engagement, TimeSlot, EngagementReport, CreateEngagementInput, UpdateEngagementInput, CreateTimeSlotInput, UpdateTimeSlotInput, CreateEngagementReportInput, UpdateEngagementReportInput } from '../api/graphql/types/engagement/EngagementTypes.js';
export { Engagement, TimeSlot, EngagementReport, EngagementStatus, EngagementPriority, TimeSlotType, TimeSlotStatus, TimeSlotPriority, EngagementReportStatus, CreateEngagementInput, UpdateEngagementInput, CreateTimeSlotInput, UpdateTimeSlotInput, CreateEngagementReportInput, UpdateEngagementReportInput } from '../api/graphql/types/engagement/EngagementTypes.js';
export declare class EngagementController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * Récupérer les engagements par service
     */
    getEngagementsByService(serviceId: string): Promise<Engagement[]>;
    /**
     * Récupérer les engagements par consultant
     */
    getEngagementsByConsultant(consultantUserId: string): Promise<Engagement[]>;
    /**
     * Récupérer les engagements par organisation
     */
    getEngagementsByOrganization(organizationId: string): Promise<Engagement[]>;
    /**
     * Récupérer un engagement spécifique
     */
    getEngagement(engagementId: string): Promise<Engagement>;
    /**
     * Récupérer les engagements par estimate
     */
    getEngagementsByEstimate(estimateId: string): Promise<Engagement[]>;
    /**
     * Créer un engagement
     */
    createEngagement(data: CreateEngagementInput): Promise<Engagement>;
    /**
     * Mettre à jour un engagement
     */
    updateEngagement(engagementId: string, data: UpdateEngagementInput): Promise<Engagement>;
    /**
     * Supprimer un engagement
     */
    deleteEngagement(engagementId: string): Promise<Engagement>;
    /**
     * Créer un créneau temporel
     */
    createTimeSlot(data: CreateTimeSlotInput): Promise<TimeSlot>;
    /**
     * Mettre à jour un créneau temporel
     */
    updateTimeSlot(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot>;
    /**
     * Supprimer un créneau temporel
     */
    deleteTimeSlot(timeSlotId: string): Promise<TimeSlot>;
    /**
     * Récupérer un rapport d'engagement par token
     */
    getEngagementReportByToken(token: string): Promise<EngagementReport>;
    /**
     * Récupérer les rapports d'engagement par engagement
     */
    getEngagementReportsByEngagement(engagementId: string): Promise<EngagementReport[]>;
    /**
     * Récupérer les rapports d'engagement par consultant
     */
    getEngagementReportsByConsultant(consultantUserId: string): Promise<EngagementReport[]>;
    /**
     * Récupérer les rapports d'engagement par organisation
     */
    getEngagementReportsByOrganization(organizationId: string): Promise<EngagementReport[]>;
    /**
     * Récupérer les rapports d'engagement par période
     */
    getEngagementReportsByPeriod(year: number, periodType: string, periodValue: number): Promise<EngagementReport[]>;
    /**
     * Créer un rapport d'engagement
     */
    createEngagementReport(data: CreateEngagementReportInput): Promise<EngagementReport>;
    /**
     * Mettre à jour un rapport d'engagement
     */
    updateEngagementReport(engagementReportId: string, data: UpdateEngagementReportInput): Promise<EngagementReport>;
    /**
     * Supprimer un rapport d'engagement
     */
    deleteEngagementReport(engagementReportId: string): Promise<EngagementReport>;
    /**
     * Créer un rapport pour une nouvelle période
     */
    createReportForNewPeriod(engagementId: string, periodType: string, periodValue: number, year: number): Promise<EngagementReport>;
}
