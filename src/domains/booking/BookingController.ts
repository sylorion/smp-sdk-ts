import { APIClient } from '../../api/APIClient.js';
import {
  EstimateRequest,
  Booking,
  Availability,
  WeeklyAvailability,
  AvailabilityException,
  AvailableSlot,
  DailySlot,
  CreateEstimateRequestInput,
  CreateBookingInput,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  UpdateBookingInput,
  CreateWeeklyAvailabilityInput,
  CreateWeeklyAvailabilityBatchInput,
  CreateDailySlotsInput,
  CreateAvailabilityExceptionInput,
  SearchAvailabilityInput,
  AvailableSlotsInput,
  SearchDailySlotsInput
} from '../../types/booking/index.js';
import { bookingMutations } from '../../api/graphql/booking/mutations.js';
import { bookingQueries } from '../../api/graphql/booking/queries.js';

export class BookingController {
  constructor(private apiClient: APIClient) { }

  // ===== DEMANDES DE DEVIS =====

  /**
   * Créer une demande de devis
   */
  async createEstimateRequest(input: CreateEstimateRequestInput): Promise<EstimateRequest> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_ESTIMATE_REQUEST,
      { input }
    ) as { createEstimateRequest: EstimateRequest };
    return response.createEstimateRequest;
  }

  /**
   * Récupérer les demandes de devis d'un service
   */
  async listEstimateRequests(serviceId: string, userId?: string): Promise<EstimateRequest[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_ESTIMATE_REQUESTS,
      { serviceId, userId }
    ) as { estimateRequests: EstimateRequest[] };
    return response.estimateRequests;
  }

  /**
   * Récupérer une demande de devis spécifique
   */
  async getEstimateRequestById(estimateRequestId: string): Promise<EstimateRequest | null> {
    const response = await this.apiClient.query(
      bookingQueries.GET_ESTIMATE_REQUEST,
      { estimateRequestId }
    ) as { estimateRequest: EstimateRequest | null };
    return response.estimateRequest;
  }

  // ===== RÉSERVATIONS =====

  /**
   * Créer une réservation
   */
  async createBooking(input: CreateBookingInput): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_BOOKING,
      { input }
    ) as { createBooking: Booking };
    return response.createBooking;
  }

  /**
   * Récupérer les réservations d'un service
   */
  async listBookingsByService(serviceId: string): Promise<Booking[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKINGS_BY_SERVICE,
      { serviceId }
    ) as { bookingsByService: Booking[] };
    return response.bookingsByService;
  }

  /**
   * Récupérer les réservations d'un utilisateur
   */
  async listBookingsByUser(userId: string): Promise<Booking[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKINGS_BY_USER,
      { userId }
    ) as { bookingsByUser: Booking[] };
    return response.bookingsByUser;
  }

  /**
   * Créer une réservation avec créneau auto-déterminé
   */
  async createBookingWithSlot(input: CreateBookingInput): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_BOOKING_WITH_SLOT,
      { input }
    ) as { createBooking: Booking };
    return response.createBooking;
  }

  /**
   * Récupérer les données complètes du calendrier pour un service
   */
  async getCalendarData(serviceId: string, startDate: Date, endDate: Date): Promise<{
    weeklyAvailabilities: WeeklyAvailability[];
    availabilityExceptions: AvailabilityException[];
    bookings: Booking[];
    calendarSlots: AvailableSlot[];
  }> {
    const response = await this.apiClient.query(
      bookingQueries.GET_CALENDAR_DATA,
      { serviceId, startDate, endDate }
    ) as {
      weeklyAvailabilities: WeeklyAvailability[];
      availabilityExceptions: AvailabilityException[];
      bookings: Booking[];
      calendarSlots: AvailableSlot[];
    };
    return response;
  }

  /**
   * Récupérer les réservations d'une disponibilité
   */
  async listBookingsByAvailability(availabilityId: string): Promise<Booking[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKINGS_BY_AVAILABILITY,
      { availabilityId }
    ) as { bookingsByAvailability: Booking[] };
    return response.bookingsByAvailability;
  }

  /**
   * Annuler une réservation
   */
  async cancelBooking(bookingId: string, message?: string): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.CANCEL_BOOKING,
      { bookingId, message }
    ) as { cancelBooking: Booking };
    return response.cancelBooking;
  }

  /**
   * Mettre à jour une réservation
   */
  async updateBooking(input: UpdateBookingInput): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.UPDATE_BOOKING,
      { input }
    ) as { updateBooking: Booking };
    return response.updateBooking;
  }

  // ===== DISPONIBILITÉS =====

  /**
   * Créer une disponibilité
   */
  async createAvailability(input: CreateAvailabilityInput): Promise<Availability> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_AVAILABILITY,
      { input }
    ) as { createAvailability: Availability };
    return response.createAvailability;
  }

  /**
   * Mettre à jour une disponibilité
   */
  async updateAvailability(id: string, input: UpdateAvailabilityInput): Promise<Availability> {
    const response = await this.apiClient.mutate(
      bookingMutations.UPDATE_AVAILABILITY,
      { id, input }
    ) as { updateAvailability: Availability };
    return response.updateAvailability;
  }

  /**
   * Annuler une disponibilité
   */
  async cancelAvailability(id: string): Promise<Availability> {
    const response = await this.apiClient.mutate(
      bookingMutations.CANCEL_AVAILABILITY,
      { id }
    ) as { cancelAvailability: Availability };
    return response.cancelAvailability;
  }

  /**
   * Rechercher des disponibilités
   */
  async searchAvailabilities(input: SearchAvailabilityInput): Promise<Availability[]> {
    const response = await this.apiClient.query(
      bookingQueries.SEARCH_AVAILABILITIES,
      { input }
    ) as { searchAvailabilities: Availability[] };
    return response.searchAvailabilities;
  }

  // ===== DISPONIBILITÉS HEBDOMADAIRES =====

  /**
   * Créer une disponibilité hebdomadaire
   */
  async createWeeklyAvailability(input: CreateWeeklyAvailabilityInput): Promise<WeeklyAvailability> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_WEEKLY_AVAILABILITY,
      { input }
    ) as { createWeeklyAvailability: WeeklyAvailability };
    return response.createWeeklyAvailability;
  }

  /**
   * Créer des disponibilités hebdomadaires en lot
   */
  async createWeeklyAvailabilityBatch(input: CreateWeeklyAvailabilityBatchInput): Promise<WeeklyAvailability[]> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_WEEKLY_AVAILABILITY_BATCH,
      { input }
    ) as { createWeeklyAvailabilityBatch: WeeklyAvailability[] };
    return response.createWeeklyAvailabilityBatch;
  }

  /**
   * Récupérer les disponibilités hebdomadaires d'un service
   */
  async listWeeklyAvailabilities(serviceId: string, userId: string): Promise<WeeklyAvailability[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_WEEKLY_AVAILABILITIES,
      { serviceId, userId }
    ) as { weeklyAvailabilities: WeeklyAvailability[] };
    return response.weeklyAvailabilities;
  }

  // ===== CRÉNEAUX QUOTIDIENS =====

  /**
   * Créer des créneaux quotidiens
   */
  async createDailySlots(input: CreateDailySlotsInput): Promise<DailySlot[]> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_DAILY_SLOTS,
      { input }
    ) as { createDailySlots: DailySlot[] };
    return response.createDailySlots;
  }

  /**
   * Récupérer les créneaux quotidiens
   */
  async listDailySlots(input: SearchDailySlotsInput): Promise<DailySlot[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_DAILY_SLOTS,
      { input }
    ) as { dailySlots: DailySlot[] };
    return response.dailySlots;
  }

  // ===== CRÉNEAUX DISPONIBLES =====

  /**
   * Récupérer les créneaux disponibles
   */
  async listAvailableSlots(input: AvailableSlotsInput): Promise<AvailableSlot[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_AVAILABLE_SLOTS,
      { input }
    ) as { availableSlots: AvailableSlot[] };
    return response.availableSlots;
  }

  /**
   * Récupérer les créneaux du calendrier
   */
  async listCalendarSlots(
    serviceId: string,
    startDate: Date,
    endDate: Date,
    userId?: string
  ): Promise<AvailableSlot[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_CALENDAR_SLOTS,
      { serviceId, startDate, endDate, userId }
    ) as { calendarSlots: AvailableSlot[] };
    return response.calendarSlots;
  }

  // ===== EXCEPTIONS DE DISPONIBILITÉ =====

  /**
   * Créer une exception de disponibilité
   */
  async createAvailabilityException(input: CreateAvailabilityExceptionInput): Promise<AvailabilityException> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_AVAILABILITY_EXCEPTION,
      { input }
    ) as { createAvailabilityException: AvailabilityException };
    return response.createAvailabilityException;
  }

  /**
   * Récupérer les exceptions de disponibilité
   */
  async listAvailabilityExceptions(
    serviceId: string,
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AvailabilityException[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_AVAILABILITY_EXCEPTIONS,
      { serviceId, userId, startDate, endDate }
    ) as { availabilityExceptions: AvailabilityException[] };
    return response.availabilityExceptions;
  }

  // ===== MÉTHODES UTILITAIRES =====

  /**
   * Vérifier si un créneau est disponible
   */
  async isSlotAvailable(
    serviceId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const input: AvailableSlotsInput = {
      serviceId,
      date,
      slotDuration: 60
    };

    const slots = await this.listAvailableSlots(input);
    return slots.some((slot: any) =>
      slot.isAvailable &&
      slot.startTime <= new Date(`${date.toISOString().split('T')[0]}T${startTime}`) &&
      slot.endTime >= new Date(`${date.toISOString().split('T')[0]}T${endTime}`)
    );
  }

  /**
   * Obtenir la prochaine disponibilité pour un service
   */
  async getNextAvailableSlot(serviceId: string, fromDate: Date): Promise<AvailableSlot | null> {
    const endDate = new Date(fromDate);
    endDate.setDate(endDate.getDate() + 30); // Chercher sur les 30 prochains jours

    const input: AvailableSlotsInput = {
      serviceId,
      date: fromDate,
      maxSlots: 1
    };

    const slots = await this.listAvailableSlots(input);
    return slots.find((slot: any) => slot.isAvailable && slot.startTime >= fromDate) || null;
  }

  /**
   * Calculer la durée d'un créneau en minutes
   */
  calculateSlotDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }

  /**
   * Formater une heure pour l'affichage
   */
  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
