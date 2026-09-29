import { bookingMutations } from '../../api/graphql/booking/mutations.js';
import { bookingQueries } from '../../api/graphql/booking/queries.js';
export class BookingController {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    // ===== DEMANDES DE DEVIS =====
    /**
     * ⚠️ `createEstimateRequest` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
     * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
     * smp-webapp (`app/api/booking/estimate-requests/route.ts`) et smp-mobile (`features/booking/booking.service.ts`) l'utilise ; le parcours devis passe par `accounting.estimate.create`.
     */
    async createEstimateRequest(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_ESTIMATE_REQUEST, { input });
        return response.createEstimateRequest;
    }
    /**
     * ⚠️ `estimateRequests` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
     * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
     * smp-webapp (`app/api/booking/estimate-requests/route.ts`) et smp-mobile (`features/booking/booking.service.ts`) l'utilise.
     */
    async listEstimateRequests(serviceId, userId) {
        const response = await this.apiClient.query(bookingQueries.GET_ESTIMATE_REQUESTS, { serviceId, userId });
        return response.estimateRequests;
    }
    // ===== RÉSERVATIONS =====
    async create(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_BOOKING, { input });
        return response.createBooking;
    }
    async listByServiceId(serviceId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKINGS_BY_SERVICE, { serviceId });
        return response.bookingsByService;
    }
    async listByUserId(userId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKINGS_BY_USER, { userId });
        return response.bookingsByUser;
    }
    async createWithSlot(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_BOOKING_WITH_SLOT, { input });
        return response.createBooking;
    }
    /**
     * Récupérer les données complètes du calendrier pour un service
     */
    async getCalendarData(serviceId, startDate, endDate) {
        const response = await this.apiClient.query(bookingQueries.GET_CALENDAR_DATA, { serviceId, startDate, endDate });
        return response;
    }
    async cancel(bookingId, message) {
        const response = await this.apiClient.mutate(bookingMutations.CANCEL_BOOKING, { bookingId, message });
        return response.cancelBooking;
    }
    async update(input) {
        const response = await this.apiClient.mutate(bookingMutations.UPDATE_BOOKING, { input });
        return response.updateBooking;
    }
    async getById(bookingId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKING, { bookingId });
        return response.booking;
    }
    // ===== DISPONIBILITÉS =====
    /**
     * ⚠️ `createAvailability` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
     * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
     * smp-webapp (`app/api/booking/bookings/route.ts`) l'utilise ; les disponibilités réelles sont hebdomadaires (`createWeeklyAvailabilityBatch`) ou des exceptions (`createAvailabilityException`).
     */
    async createAvailability(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_AVAILABILITY, { input });
        return response.createAvailability;
    }
    // ===== DISPONIBILITÉS HEBDOMADAIRES =====
    /**
     * Créer des disponibilités hebdomadaires en lot
     */
    async createWeeklyAvailabilityBatch(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_WEEKLY_AVAILABILITY_BATCH, { input });
        return response.createWeeklyAvailabilityBatch;
    }
    /**
     * Récupérer les disponibilités hebdomadaires d'un service
     */
    async listWeeklyAvailabilities(serviceId, userId) {
        const response = await this.apiClient.query(bookingQueries.GET_WEEKLY_AVAILABILITIES, { serviceId, userId });
        return response.weeklyAvailabilities;
    }
    // ===== CRÉNEAUX QUOTIDIENS =====
    // ===== CRÉNEAUX DISPONIBLES =====
    /**
     * Récupérer les créneaux disponibles
     */
    async listAvailableSlots(input) {
        const response = await this.apiClient.query(bookingQueries.GET_AVAILABLE_SLOTS, { input });
        return response.availableSlots;
    }
    /**
     * Récupérer les créneaux du calendrier
     */
    async listCalendarSlots(serviceId, startDate, endDate, userId) {
        const response = await this.apiClient.query(bookingQueries.GET_CALENDAR_SLOTS, { serviceId, startDate, endDate, userId });
        return response.calendarSlots;
    }
    // ===== EXCEPTIONS DE DISPONIBILITÉ =====
    /**
     * Créer une exception de disponibilité
     */
    async createAvailabilityException(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_AVAILABILITY_EXCEPTION, { input });
        return response.createAvailabilityException;
    }
    /**
     * Récupérer les exceptions de disponibilité
     */
    async listAvailabilityExceptions(serviceId, userId, startDate, endDate) {
        const response = await this.apiClient.query(bookingQueries.GET_AVAILABILITY_EXCEPTIONS, { serviceId, userId, startDate, endDate });
        return response.availabilityExceptions;
    }
    // ===== MÉTHODES UTILITAIRES =====
    /**
     * Vérifier si un créneau est disponible
     */
    async isSlotAvailable(serviceId, date, startTime, endTime) {
        const input = {
            serviceId,
            date,
            slotDuration: 60
        };
        const slots = await this.listAvailableSlots(input);
        return slots.some((slot) => slot.isAvailable &&
            slot.startTime <= new Date(`${date.toISOString().split('T')[0]}T${startTime}`) &&
            slot.endTime >= new Date(`${date.toISOString().split('T')[0]}T${endTime}`));
    }
    /**
     * Obtenir la prochaine disponibilité pour un service
     */
    async getNextAvailableSlot(serviceId, fromDate) {
        const endDate = new Date(fromDate);
        endDate.setDate(endDate.getDate() + 30); // Chercher sur les 30 prochains jours
        const input = {
            serviceId,
            date: fromDate,
            maxSlots: 1
        };
        const slots = await this.listAvailableSlots(input);
        return slots.find((slot) => slot.isAvailable && slot.startTime >= fromDate) || null;
    }
    /**
     * Calculer la durée d'un créneau en minutes
     */
    calculateSlotDuration(startTime, endTime) {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
    }
    /**
     * Formater une heure pour l'affichage
     */
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
}
