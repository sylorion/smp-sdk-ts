import { APIClient } from '../../api/APIClient.js';
import { Engagement, TimeSlot, EngagementReport, CreateEngagementInput, UpdateEngagementInput, CreateTimeSlotInput, UpdateTimeSlotInput, CreateEngagementReportInput, UpdateEngagementReportInput, SendWorkReportNotificationInput } from '../../types/communication/index.js';
export { Engagement, TimeSlot, EngagementReport, EngagementClientInfo, EngagementMetadata, EngagementStatus, EngagementPriority, TimeSlotType, TimeSlotStatus, TimeSlotPriority, EngagementReportStatus, CreateEngagementInput, UpdateEngagementInput, CreateTimeSlotInput, UpdateTimeSlotInput, CreateEngagementReportInput, UpdateEngagementReportInput, SendWorkReportNotificationInput } from '../../types/communication/index.js';
export declare class EngagementController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * Récupérer les engagements par service
     */
    listByServiceId(serviceId: string, organizationId?: string): Promise<Engagement[]>;
    /**
     * Récupérer les engagements par consultant
     */
    listByConsultantUserId(consultantUserId: string): Promise<Engagement[]>;
    /**
     * Récupérer les engagements par acheteur
     */
    listByBuyerUserId(buyerUserId: string): Promise<Engagement[]>;
    /**
     * Récupérer les engagements par organisation
     */
    listByOrganizationId(organizationId: string): Promise<Engagement[]>;
    /**
     * Récupérer un engagement spécifique
     */
    getById(engagementId: string): Promise<Engagement>;
    /**
     * Récupérer les engagements par estimate
     */
    listByEstimateId(estimateId: string): Promise<Engagement[]>;
    /**
     * Créer un engagement
     */
    create(data: CreateEngagementInput): Promise<Engagement>;
    /**
     * Mettre à jour un engagement
     */
    update(engagementId: string, data: UpdateEngagementInput): Promise<Engagement>;
    /**
     * Supprimer un engagement
     */
    delete(engagementId: string): Promise<Engagement>;
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
    getReportByToken(token: string): Promise<EngagementReport>;
    /**
     * Récupérer les rapports d'engagement par engagement
     */
    listReportsByEngagementId(engagementId: string): Promise<EngagementReport[]>;
    /**
     * Récupérer les rapports d'engagement par consultant
     */
    listReportsByConsultantUserId(consultantUserId: string): Promise<EngagementReport[]>;
    /**
     * Récupérer les rapports d'engagement par organisation
     */
    listReportsByOrganizationId(organizationId: string): Promise<EngagementReport[]>;
    /**
     * Récupérer les rapports d'engagement par période
     */
    listReportsByPeriod(year: number, periodType: string, periodValue: number): Promise<EngagementReport[]>;
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
    /**
     * Envoyer une notification de rapport de travail par email
     */
    sendWorkReportNotification(data: SendWorkReportNotificationInput): Promise<boolean>;
}
