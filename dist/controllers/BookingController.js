import { bookingMutations } from '../api/graphql/mutations/command/bookingMutations.js';
import { bookingQueries } from '../api/graphql/queries/command/bookingQueries.js';
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
    /**
     * Récupérer les demandes de devis d'un service
     */
    async getEstimateRequests(serviceId, userId) {
        const response = await this.apiClient.query(bookingQueries.GET_ESTIMATE_REQUESTS, { serviceId, userId });
        return response.estimateRequests;
    }
    /**
     * Récupérer une demande de devis spécifique
     */
    async getEstimateRequest(estimateRequestId) {
        const response = await this.apiClient.query(bookingQueries.GET_ESTIMATE_REQUEST, { estimateRequestId });
        return response.estimateRequest;
    }
    // ===== RÉSERVATIONS =====
    /**
     * Créer une réservation
     */
    async createBooking(input) {
        const response = await this.apiClient.mutate(bookingMutations.CREATE_BOOKING, { input });
        return response.createBooking;
    }
    /**
     * Récupérer les réservations d'un service
     */
    async getBookingsByService(serviceId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKINGS_BY_SERVICE, { serviceId });
        return response.bookingsByService;
    }
    /**
     * Récupérer les réservations d'un utilisateur
     */
    async getBookingsByUser(userId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKINGS_BY_USER, { userId });
        return response.bookingsByUser;
    }
    /**
     * Créer une réservation avec créneau auto-déterminé
     */
    async createBookingWithSlot(input) {
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
    async getBookingsByAvailability(availabilityId) {
        const response = await this.apiClient.query(bookingQueries.GET_BOOKINGS_BY_AVAILABILITY, { availabilityId });
        return response.bookingsByAvailability;
    }
    /**
     * Annuler une réservation
     */
    async cancelBooking(bookingId, message) {
        const response = await this.apiClient.mutate(bookingMutations.CANCEL_BOOKING, { bookingId, message });
        return response.cancelBooking;
    }
    /**
     * Mettre à jour une réservation
     */
    async updateBooking(input) {
        const response = await this.apiClient.mutate(bookingMutations.UPDATE_BOOKING, { input });
        return response.updateBooking;
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
    async getWeeklyAvailabilities(serviceId, userId) {
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
    async getDailySlots(input) {
        const response = await this.apiClient.query(bookingQueries.GET_DAILY_SLOTS, { input });
        return response.dailySlots;
    }
    // ===== CRÉNEAUX DISPONIBLES =====
    /**
     * Récupérer les créneaux disponibles
     */
    async getAvailableSlots(input) {
        const response = await this.apiClient.query(bookingQueries.GET_AVAILABLE_SLOTS, { input });
        return response.availableSlots;
    }
    /**
     * Récupérer les créneaux du calendrier
     */
    async getCalendarSlots(serviceId, startDate, endDate, userId) {
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
    async getAvailabilityExceptions(serviceId, userId, startDate, endDate) {
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
        const slots = await this.getAvailableSlots(input);
        return slots.some(slot => slot.isAvailable &&
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
        const slots = await this.getAvailableSlots(input);
        return slots.find(slot => slot.isAvailable && slot.startTime >= fromDate) || null;
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
