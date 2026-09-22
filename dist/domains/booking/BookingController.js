import { bookingMutations } from '../../api/graphql/booking/mutations.js';
import { bookingQueries } from '../../api/graphql/booking/queries.js';
export class BookingController {
    constructor(apiClient) {
        this.apiClient = apiClient;
    }
    // ===== DEMANDES DE DEVIS =====
    /**
     * Créer une demande de devis
     */
    async createEstimateRequest(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_ESTIMATE_REQUEST, { input });
        return response.createEstimateRequest;
    }
    async listEstimateRequests(serviceId, userId) {
        const response = await this.apiClient.query(bookingQueries.GET_ESTIMATE_REQUESTS, { serviceId, userId });
        return response.estimateRequests;
    }
    async getEstimateRequestById(estimateRequestId) {
        const response = await this.apiClient.query(bookingQueries.GET_ESTIMATE_REQUEST, { estimateRequestId });
        return response.estimateRequest;
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
    /**
     * Récupérer les réservations d'une disponibilité
     */
    async listByAvailabilityId(availabilityId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKINGS_BY_AVAILABILITY, { availabilityId });
        return response.bookingsByAvailability;
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
     * Créer une disponibilité
     */
    async createAvailability(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_AVAILABILITY, { input });
        return response.createAvailability;
    }
    /**
     * Mettre à jour une disponibilité
     */
    async updateAvailability(id, input) {
        const response = await this.apiClient.mutate(bookingMutations.UPDATE_AVAILABILITY, { id, input });
        return response.updateAvailability;
    }
    /**
     * Annuler une disponibilité
     */
    async cancelAvailability(id) {
        const response = await this.apiClient.mutate(bookingMutations.CANCEL_AVAILABILITY, { id });
        return response.cancelAvailability;
    }
    /**
     * Rechercher des disponibilités
     */
    async searchAvailabilities(input) {
        const response = await this.apiClient.query(bookingQueries.SEARCH_AVAILABILITIES, { input });
        return response.searchAvailabilities;
    }
    // ===== DISPONIBILITÉS HEBDOMADAIRES =====
    /**
     * Créer une disponibilité hebdomadaire
     */
    async createWeeklyAvailability(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_WEEKLY_AVAILABILITY, { input });
        return response.createWeeklyAvailability;
    }
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
    /**
     * Créer des créneaux quotidiens
     */
    async createDailySlots(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_DAILY_SLOTS, { input });
        return response.createDailySlots;
    }
    /**
     * Récupérer les créneaux quotidiens
     */
    async listDailySlots(input) {
        const response = await this.apiClient.query(bookingQueries.GET_DAILY_SLOTS, { input });
        return response.dailySlots;
    }
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
