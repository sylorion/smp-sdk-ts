import { APIClient } from '../api/APIClient.js';
import { TimeSlot, CreateTimeSlotInput, UpdateTimeSlotInput } from '../api/graphql/types/engagement/EngagementTypes.js';
export { TimeSlot, TimeSlotType, TimeSlotStatus, TimeSlotPriority, CreateTimeSlotInput, UpdateTimeSlotInput } from '../api/graphql/types/engagement/EngagementTypes.js';
export declare class TimeSlotController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * Récupérer les timeSlots par service (disponibilités générales)
     */
    getTimeSlotsByService(serviceId: string): Promise<TimeSlot[]>;
    /**
     * Récupérer les timeSlots par engagement
     */
    getTimeSlotsByEngagement(engagementId: string): Promise<TimeSlot[]>;
    /**
     * Récupérer les timeSlots par milestone
     */
    getTimeSlotsByMilestone(engagementMilestoneId: string): Promise<TimeSlot[]>;
    /**
     * Récupérer les timeSlots par utilisateur
     */
    getTimeSlotsByUser(userId: string): Promise<TimeSlot[]>;
    /**
     * Récupérer les timeSlots par période
     */
    getTimeSlotsByDateRange(startDate: string, endDate: string): Promise<TimeSlot[]>;
    /**
     * Récupérer un timeSlot spécifique
     */
    getTimeSlot(timeSlotId: string): Promise<TimeSlot>;
    /**
     * Récupérer les timeSlots disponibles pour booking
     */
    getAvailableTimeSlots(serviceId: string, startDate: string, endDate: string): Promise<TimeSlot[]>;
    /**
     * Créer un timeSlot
     */
    createTimeSlot(data: CreateTimeSlotInput): Promise<TimeSlot>;
    /**
     * Mettre à jour un timeSlot
     */
    updateTimeSlot(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot>;
    /**
     * Supprimer un timeSlot
     */
    deleteTimeSlot(timeSlotId: string): Promise<TimeSlot>;
    /**
     * Créer des timeSlots en lot
     */
    createTimeSlotsBatch(data: CreateTimeSlotInput[]): Promise<TimeSlot[]>;
    /**
     * Assigner un timeSlot à un engagement
     */
    assignTimeSlotToEngagement(timeSlotId: string, engagementId: string): Promise<TimeSlot>;
    /**
     * Assigner un timeSlot à un milestone
     */
    assignTimeSlotToMilestone(timeSlotId: string, engagementMilestoneId: string): Promise<TimeSlot>;
}
