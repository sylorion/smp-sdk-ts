import { APIClient } from '../../api/APIClient.js';
import { EstimateRequest, Booking, Availability, WeeklyAvailability, AvailabilityException, AvailableSlot, DailySlot, CreateEstimateRequestInput, CreateBookingInput, CreateAvailabilityInput, UpdateAvailabilityInput, UpdateBookingInput, CreateWeeklyAvailabilityInput, CreateWeeklyAvailabilityBatchInput, CreateDailySlotsInput, CreateAvailabilityExceptionInput, SearchAvailabilityInput, AvailableSlotsInput, SearchDailySlotsInput } from '../../types/booking/index.js';
export declare class BookingController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * Créer une demande de devis
     */
    createEstimateRequest(input: CreateEstimateRequestInput): Promise<EstimateRequest>;
    listEstimateRequests(serviceId: string, userId?: string): Promise<EstimateRequest[]>;
    getEstimateRequestById(estimateRequestId: string): Promise<EstimateRequest | null>;
    create(input: CreateBookingInput): Promise<Booking>;
    listByServiceId(serviceId: string): Promise<Booking[]>;
    listByUserId(userId: string): Promise<Booking[]>;
    createWithSlot(input: CreateBookingInput): Promise<Booking>;
    /**
     * Récupérer les données complètes du calendrier pour un service
     */
    getCalendarData(serviceId: string, startDate: Date, endDate: Date): Promise<{
        weeklyAvailabilities: WeeklyAvailability[];
        availabilityExceptions: AvailabilityException[];
        bookings: Booking[];
        calendarSlots: AvailableSlot[];
    }>;
    /**
     * Récupérer les réservations d'une disponibilité
     */
    listByAvailabilityId(availabilityId: string): Promise<Booking[]>;
    cancel(bookingId: string, message?: string): Promise<Booking>;
    update(input: UpdateBookingInput): Promise<Booking>;
    getById(bookingId: string): Promise<Booking | null>;
    /**
     * Créer une disponibilité
     */
    createAvailability(input: CreateAvailabilityInput): Promise<Availability>;
    /**
     * Mettre à jour une disponibilité
     */
    updateAvailability(id: string, input: UpdateAvailabilityInput): Promise<Availability>;
    /**
     * Annuler une disponibilité
     */
    cancelAvailability(id: string): Promise<Availability>;
    /**
     * Rechercher des disponibilités
     */
    searchAvailabilities(input: SearchAvailabilityInput): Promise<Availability[]>;
    /**
     * Créer une disponibilité hebdomadaire
     */
    createWeeklyAvailability(input: CreateWeeklyAvailabilityInput): Promise<WeeklyAvailability>;
    /**
     * Créer des disponibilités hebdomadaires en lot
     */
    createWeeklyAvailabilityBatch(input: CreateWeeklyAvailabilityBatchInput): Promise<WeeklyAvailability[]>;
    /**
     * Récupérer les disponibilités hebdomadaires d'un service
     */
    listWeeklyAvailabilities(serviceId: string, userId: string): Promise<WeeklyAvailability[]>;
    /**
     * Créer des créneaux quotidiens
     */
    createDailySlots(input: CreateDailySlotsInput): Promise<DailySlot[]>;
    /**
     * Récupérer les créneaux quotidiens
     */
    listDailySlots(input: SearchDailySlotsInput): Promise<DailySlot[]>;
    /**
     * Récupérer les créneaux disponibles
     */
    listAvailableSlots(input: AvailableSlotsInput): Promise<AvailableSlot[]>;
    /**
     * Récupérer les créneaux du calendrier
     */
    listCalendarSlots(serviceId: string, startDate: Date, endDate: Date, userId?: string): Promise<AvailableSlot[]>;
    /**
     * Créer une exception de disponibilité
     */
    createAvailabilityException(input: CreateAvailabilityExceptionInput): Promise<AvailabilityException>;
    /**
     * Récupérer les exceptions de disponibilité
     */
    listAvailabilityExceptions(serviceId: string, userId: string, startDate: Date, endDate: Date): Promise<AvailabilityException[]>;
    /**
     * Vérifier si un créneau est disponible
     */
    isSlotAvailable(serviceId: string, date: Date, startTime: string, endTime: string): Promise<boolean>;
    /**
     * Obtenir la prochaine disponibilité pour un service
     */
    getNextAvailableSlot(serviceId: string, fromDate: Date): Promise<AvailableSlot | null>;
    /**
     * Calculer la durée d'un créneau en minutes
     */
    calculateSlotDuration(startTime: string, endTime: string): number;
    /**
     * Formater une heure pour l'affichage
     */
    formatTime(minutes: number): string;
}
