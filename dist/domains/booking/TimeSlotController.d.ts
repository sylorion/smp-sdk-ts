import { APIClient } from '../../api/APIClient.js';
import { TimeSlot, CreateTimeSlotInput, UpdateTimeSlotInput } from '../../types/communication/index.js';
export { TimeSlot, TimeSlotType, TimeSlotStatus, TimeSlotPriority, CreateTimeSlotInput, UpdateTimeSlotInput } from '../../types/communication/index.js';
export declare class TimeSlotController {
    private apiClient;
    constructor(apiClient: APIClient);
    listByServiceId(serviceId: string): Promise<TimeSlot[]>;
    listByEngagementId(engagementId: string): Promise<TimeSlot[]>;
    listByMilestoneId(engagementMilestoneId: string): Promise<TimeSlot[]>;
    listByUserId(userId: string): Promise<TimeSlot[]>;
    /**
     * Récupérer les timeSlots par période
     */
    listTimeSlotsByDateRange(startDate: string, endDate: string): Promise<TimeSlot[]>;
    getById(timeSlotId: string): Promise<TimeSlot>;
    /**
     * Récupérer les timeSlots disponibles pour booking
     */
    listAvailableTimeSlots(serviceId: string, startDate: string, endDate: string): Promise<TimeSlot[]>;
    create(data: CreateTimeSlotInput): Promise<TimeSlot>;
    update(timeSlotId: string, data: UpdateTimeSlotInput): Promise<TimeSlot>;
    delete(timeSlotId: string): Promise<TimeSlot>;
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
