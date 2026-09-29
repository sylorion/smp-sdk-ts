import { APIClient } from '../../api/APIClient.js';
import { EstimateRequest, Booking, Availability, WeeklyAvailability, AvailabilityException, AvailableSlot, CreateEstimateRequestInput, CreateBookingInput, CreateAvailabilityInput, UpdateBookingInput, CreateWeeklyAvailabilityBatchInput, CreateAvailabilityExceptionInput, AvailableSlotsInput } from '../../types/booking/index.js';
export declare class BookingController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * ⚠️ `createEstimateRequest` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
     * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
     * smp-webapp (`app/api/booking/estimate-requests/route.ts`) et smp-mobile (`features/booking/booking.service.ts`) l'utilise ; le parcours devis passe par `accounting.estimate.create`.
     */
    createEstimateRequest(input: CreateEstimateRequestInput): Promise<EstimateRequest>;
    /**
     * ⚠️ `estimateRequests` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
     * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
     * smp-webapp (`app/api/booking/estimate-requests/route.ts`) et smp-mobile (`features/booking/booking.service.ts`) l'utilise.
     */
    listEstimateRequests(serviceId: string, userId?: string): Promise<EstimateRequest[]>;
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
    cancel(bookingId: string, message?: string): Promise<Booking>;
    update(input: UpdateBookingInput): Promise<Booking>;
    getById(bookingId: string): Promise<Booking | null>;
    /**
     * ⚠️ `createAvailability` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
     * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
     * smp-webapp (`app/api/booking/bookings/route.ts`) l'utilise ; les disponibilités réelles sont hebdomadaires (`createWeeklyAvailabilityBatch`) ou des exceptions (`createAvailabilityException`).
     */
    createAvailability(input: CreateAvailabilityInput): Promise<Availability>;
    /**
     * Créer des disponibilités hebdomadaires en lot
     */
    createWeeklyAvailabilityBatch(input: CreateWeeklyAvailabilityBatchInput): Promise<WeeklyAvailability[]>;
    /**
     * Récupérer les disponibilités hebdomadaires d'un service
     */
    listWeeklyAvailabilities(serviceId: string, userId: string): Promise<WeeklyAvailability[]>;
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
