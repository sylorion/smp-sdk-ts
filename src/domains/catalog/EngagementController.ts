import { APIClient } from '../../api/APIClient.js';
import { engagementMutations } from '../../api/graphql/communication/mutations.js';
import { engagementQueries } from '../../api/graphql/communication/queries.js';
import {
  Engagement,
  TimeSlot,
  EngagementReport,
  EngagementClientInfo,
  EngagementMetadata,
  EngagementStatus,
  EngagementPriority,
  TimeSlotType,
  TimeSlotStatus,
  TimeSlotPriority,
  EngagementReportStatus,
  CreateEngagementInput,
  UpdateEngagementInput,
  CreateTimeSlotInput,
  UpdateTimeSlotInput,
  CreateEngagementReportInput,
  UpdateEngagementReportInput,
  SendWorkReportNotificationInput
} from '../../types/communication/index.js';

// Re-export des types pour faciliter l'utilisation
export {
  Engagement,
  TimeSlot,
  EngagementReport,
  EngagementClientInfo,
  EngagementMetadata,
  EngagementStatus,
  EngagementPriority,
  TimeSlotType,
  TimeSlotStatus,
  TimeSlotPriority,
  EngagementReportStatus,
  CreateEngagementInput,
  UpdateEngagementInput,
  CreateTimeSlotInput,
  UpdateTimeSlotInput,
  CreateEngagementReportInput,
  UpdateEngagementReportInput,
  SendWorkReportNotificationInput
} from '../../types/communication/index.js';

export class EngagementController {
  constructor(private apiClient: APIClient) { }

  // ===== ENGAGEMENTS =====

  /**
   * Récupérer les engagements par service
   */
  async listByServiceId(serviceId: string, organizationId?: string): Promise<Engagement[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENTS_BY_SERVICE_ID,
      { serviceId, organizationId }
    ) as { engagementsByService: Engagement[] };
    return response.engagementsByService;
  }

  /**
   * Récupérer les engagements par consultant
   */
  async listByConsultantUserId(consultantUserId: string): Promise<Engagement[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENTS_BY_CONSULTANT,
      { consultantUserId }
    ) as { engagementsByConsultant: Engagement[] };
    return response.engagementsByConsultant;
  }

  /**
   * Récupérer les engagements par acheteur
   */
  async listByBuyerUserId(buyerUserId: string): Promise<Engagement[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENTS_BY_BUYER,
      { buyerUserId }
    ) as { engagementsByBuyer: Engagement[] };
    return response.engagementsByBuyer;
  }

  /**
   * Récupérer les engagements par organisation
   */
  async listByOrganizationId(organizationId: string): Promise<Engagement[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENTS_BY_ORGANIZATION,
      { organizationId }
    ) as { engagementsByOrganization: Engagement[] };
    return response.engagementsByOrganization;
  }

  /**
   * Récupérer un engagement spécifique
   */
  async getById(engagementId: string): Promise<Engagement> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENT,
      { engagementId }
    ) as { engagement: Engagement };
    return response.engagement;
  }

  /**
   * Récupérer les engagements par estimate
   */
  async listByEstimateId(estimateId: string): Promise<Engagement[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENTS_BY_ESTIMATE,
      { estimateId }
    ) as { engagementsByEstimate: Engagement[] };
    return response.engagementsByEstimate;
  }


  /**
   * Créer un engagement
   */
  async create(data: CreateEngagementInput): Promise<Engagement> {
    const response = await this.apiClient.mutate(
      engagementMutations.CREATE_ENGAGEMENT,
      { data }
    ) as { createEngagement: Engagement };
    return response.createEngagement;
  }

  /**
   * Mettre à jour un engagement
   */
  async update(engagementId: string, data: UpdateEngagementInput): Promise<Engagement> {
    const response = await this.apiClient.mutate(
      engagementMutations.UPDATE_ENGAGEMENT,
      { engagementId, data }
    ) as { updateEngagement: Engagement };
    return response.updateEngagement;
  }

  /**
   * Supprimer un engagement
   */
  async delete(engagementId: string): Promise<Engagement> {
    const response = await this.apiClient.mutate(
      engagementMutations.DELETE_ENGAGEMENT,
      { engagementId }
    ) as { deleteEngagement: Engagement };
    return response.deleteEngagement;
  }

  // ===== CRÉNEAUX TEMPORELS =====

  /**
   * Créer un créneau temporel
   */
  async createTimeSlot(data: CreateTimeSlotInput): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      engagementMutations.CREATE_TIME_SLOT,
      { data }
    ) as { createTimeSlot: TimeSlot };
    return response.createTimeSlot;
  }

  /**
   * Mettre à jour un créneau temporel
   */
  async updateTimeSlot(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      engagementMutations.UPDATE_TIME_SLOT,
      { timeSlotId, data }
    ) as { updateTimeSlot: TimeSlot };
    return response.updateTimeSlot;
  }

  /**
   * Supprimer un créneau temporel
   */
  async deleteTimeSlot(timeSlotId: string): Promise<TimeSlot> {
    const response = await this.apiClient.mutate(
      engagementMutations.DELETE_TIME_SLOT,
      { timeSlotId }
    ) as { deleteTimeSlot: TimeSlot };
    return response.deleteTimeSlot;
  }

  // ===== RAPPORTS D'ENGAGEMENT =====

  /**
   * Récupérer un rapport d'engagement par token
   */
  async getReportByToken(token: string): Promise<EngagementReport> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENT_REPORT_BY_TOKEN,
      { token }
    ) as { engagementReportByToken: EngagementReport };
    return response.engagementReportByToken;
  }

  /**
   * Récupérer les rapports d'engagement par engagement
   */
  async listReportsByEngagementId(engagementId: string): Promise<EngagementReport[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENT_REPORTS_BY_ENGAGEMENT,
      { engagementId }
    ) as { engagementReportsByEngagement: EngagementReport[] };
    return response.engagementReportsByEngagement;
  }

  /**
   * Récupérer les rapports d'engagement par consultant
   */
  async listReportsByConsultantUserId(consultantUserId: string): Promise<EngagementReport[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENT_REPORTS_BY_CONSULTANT,
      { consultantUserId }
    ) as { engagementReportsByConsultant: EngagementReport[] };
    return response.engagementReportsByConsultant;
  }

  /**
   * Récupérer les rapports d'engagement par organisation
   */
  async listReportsByOrganizationId(organizationId: string): Promise<EngagementReport[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENT_REPORTS_BY_ORGANIZATION,
      { organizationId }
    ) as { engagementReportsByOrganization: EngagementReport[] };
    return response.engagementReportsByOrganization;
  }

  /**
   * Récupérer les rapports d'engagement par période
   */
  async listReportsByPeriod(year: number, periodType: string, periodValue: number): Promise<EngagementReport[]> {
    const response = await this.apiClient.query(
      engagementQueries.GET_ENGAGEMENT_REPORTS_BY_PERIOD,
      { year, periodType, periodValue }
    ) as { engagementReportsByPeriod: EngagementReport[] };
    return response.engagementReportsByPeriod;
  }

  /**
   * Créer un rapport d'engagement
   */
  async createEngagementReport(data: CreateEngagementReportInput): Promise<EngagementReport> {
    const response = await this.apiClient.mutate(
      engagementMutations.CREATE_ENGAGEMENT_REPORT,
      { data }
    ) as { createEngagementReport: EngagementReport };
    return response.createEngagementReport;
  }

  /**
   * Mettre à jour un rapport d'engagement
   */
  async updateEngagementReport(engagementReportId: string, data: UpdateEngagementReportInput): Promise<EngagementReport> {
    const response = await this.apiClient.mutate(
      engagementMutations.UPDATE_ENGAGEMENT_REPORT,
      { engagementReportId, data }
    ) as { updateEngagementReport: EngagementReport };
    return response.updateEngagementReport;
  }

  /**
   * Supprimer un rapport d'engagement
   */
  async deleteEngagementReport(engagementReportId: string): Promise<EngagementReport> {
    const response = await this.apiClient.mutate(
      engagementMutations.DELETE_ENGAGEMENT_REPORT,
      { engagementReportId }
    ) as { deleteEngagementReport: EngagementReport };
    return response.deleteEngagementReport;
  }

  /**
   * Créer un rapport pour une nouvelle période
   */
  async createReportForNewPeriod(
    engagementId: string,
    periodType: string,
    periodValue: number,
    year: number
  ): Promise<EngagementReport> {
    const response = await this.apiClient.mutate(
      engagementMutations.CREATE_REPORT_FOR_NEW_PERIOD,
      { engagementId, periodType, periodValue, year }
    ) as { createReportForNewPeriod: EngagementReport };
    return response.createReportForNewPeriod;
  }

  /**
   * Envoyer une notification de rapport de travail par email
   */
  async sendWorkReportNotification(data: SendWorkReportNotificationInput): Promise<boolean> {
    const response = await this.apiClient.mutate(
      engagementMutations.SEND_WORK_REPORT_NOTIFICATION,
      { data }
    ) as { sendWorkReportNotification: boolean };
    return response.sendWorkReportNotification;
  }
}
