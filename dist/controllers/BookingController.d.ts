import { APIClient } from '../api/APIClient.js';
import { EstimateRequest, Booking, Availability, WeeklyAvailability, AvailabilityException, AvailableSlot, DailySlot, CreateEstimateRequestInput, CreateBookingInput, CreateAvailabilityInput, UpdateAvailabilityInput, UpdateBookingInput, CreateWeeklyAvailabilityInput, CreateWeeklyAvailabilityBatchInput, CreateDailySlotsInput, CreateAvailabilityExceptionInput, SearchAvailabilityInput, AvailableSlotsInput, SearchDailySlotsInput } from '../api/graphql/types/command/BookingTypes.js';
export declare class BookingController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * Créer une demande de devis
     */
    createEstimateRequest(input: CreateEstimateRequestInput): Promise<EstimateRequest>;
    /**
     * Récupérer les demandes de devis d'un service
     */
    getEstimateRequests(serviceId: string, userId?: string): Promise<EstimateRequest[]>;
    /**
     * Récupérer une demande de devis spécifique
     */
    getEstimateRequest(estimateRequestId: string): Promise<EstimateRequest | null>;
    /**
     * Créer une réservation
     */
    createBooking(input: CreateBookingInput): Promise<Booking>;
    /**
     * Récupérer les réservations d'un service
     */
    getBookingsByService(serviceId: string): Promise<Booking[]>;
    /**
     * Récupérer les réservations d'un utilisateur
     */
    getBookingsByUser(userId: string): Promise<Booking[]>;
    /**
     * Créer une réservation avec créneau auto-déterminé
     */
    createBookingWithSlot(input: CreateBookingInput): Promise<Booking>;
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
    getBookingsByAvailability(availabilityId: string): Promise<Booking[]>;
    /**
     * Annuler une réservation
     */
    cancelBooking(bookingId: string, message?: string): Promise<Booking>;
    /**
     * Mettre à jour une réservation
     */
    updateBooking(input: UpdateBookingInput): Promise<Booking>;
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
    getWeeklyAvailabilities(serviceId: string, userId: string): Promise<WeeklyAvailability[]>;
    /**
     * Créer des créneaux quotidiens
     */
    createDailySlots(input: CreateDailySlotsInput): Promise<DailySlot[]>;
    /**
     * Récupérer les créneaux quotidiens
     */
    getDailySlots(input: SearchDailySlotsInput): Promise<DailySlot[]>;
    /**
     * Récupérer les créneaux disponibles
     */
    getAvailableSlots(input: AvailableSlotsInput): Promise<AvailableSlot[]>;
    /**
     * Récupérer les créneaux du calendrier
     */
    getCalendarSlots(serviceId: string, startDate: Date, endDate: Date, userId?: string): Promise<AvailableSlot[]>;
    /**
     * Créer une exception de disponibilité
     */
    createAvailabilityException(input: CreateAvailabilityExceptionInput): Promise<AvailabilityException>;
    /**
     * Récupérer les exceptions de disponibilité
     */
    getAvailabilityExceptions(serviceId: string, userId: string, startDate: Date, endDate: Date): Promise<AvailabilityException[]>;
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
