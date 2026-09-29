import { APIClient } from '../../api/APIClient.js';
import {
  EstimateRequest,
  Booking,
  Availability,
  WeeklyAvailability,
  AvailabilityException,
  AvailableSlot,
  CreateEstimateRequestInput,
  CreateBookingInput,
  CreateAvailabilityInput,
  UpdateBookingInput,
  CreateWeeklyAvailabilityBatchInput,
  CreateAvailabilityExceptionInput,
  AvailableSlotsInput
} from '../../types/booking/index.js';
import { bookingMutations } from '../../api/graphql/booking/mutations.js';
import { bookingQueries } from '../../api/graphql/booking/queries.js';

export class BookingController {
  constructor(private apiClient: APIClient) { }

  // ===== DEMANDES DE DEVIS =====

  /**
   * ⚠️ `createEstimateRequest` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
   * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
   * smp-webapp (`app/api/booking/estimate-requests/route.ts`) et smp-mobile (`features/booking/booking.service.ts`) l'utilise ; le parcours devis passe par `accounting.estimate.create`.
   */
  async createEstimateRequest(input: CreateEstimateRequestInput): Promise<EstimateRequest> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_ESTIMATE_REQUEST,
      { input }
    ) as { createEstimateRequest: EstimateRequest };
    return response.createEstimateRequest;
  }

  /**
   * ⚠️ `estimateRequests` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
   * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
   * smp-webapp (`app/api/booking/estimate-requests/route.ts`) et smp-mobile (`features/booking/booking.service.ts`) l'utilise.
   */
  async listEstimateRequests(serviceId: string, userId?: string): Promise<EstimateRequest[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_ESTIMATE_REQUESTS,
      { serviceId, userId }
    ) as { estimateRequests: EstimateRequest[] };
    return response.estimateRequests;
  }

  // ===== RÉSERVATIONS =====

  async create(input: CreateBookingInput): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_BOOKING,
      { input }
    ) as { createBooking: Booking };
    return response.createBooking;
  }

  async listByServiceId(serviceId: string): Promise<Booking[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKINGS_BY_SERVICE,
      { serviceId }
    ) as { bookingsByService: Booking[] };
    return response.bookingsByService;
  }

  async listByUserId(userId: string): Promise<Booking[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKINGS_BY_USER,
      { userId }
    ) as { bookingsByUser: Booking[] };
    return response.bookingsByUser;
  }

  async createWithSlot(input: CreateBookingInput): Promise<Booking> {
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

  async cancel(bookingId: string, message?: string): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.CANCEL_BOOKING,
      { bookingId, message }
    ) as { cancelBooking: Booking };
    return response.cancelBooking;
  }

  async update(input: UpdateBookingInput): Promise<Booking> {
    const response = await this.apiClient.mutate(
      bookingMutations.UPDATE_BOOKING,
      { input }
    ) as { updateBooking: Booking };
    return response.updateBooking;
  }

  async getById(bookingId: string): Promise<Booking | null> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKING,
      { bookingId }
    ) as { booking: Booking | null };
    return response.booking;
  }

  // ===== DISPONIBILITÉS =====

  /**
   * ⚠️ `createAvailability` n'existe dans aucun service (mu-command n'expose pas les demandes de devis
   * ni les disponibilités ponctuelles) : l'appel échoue à l'exécution. Conservé tant que
   * smp-webapp (`app/api/booking/bookings/route.ts`) l'utilise ; les disponibilités réelles sont hebdomadaires (`createWeeklyAvailabilityBatch`) ou des exceptions (`createAvailabilityException`).
   */
  async createAvailability(input: CreateAvailabilityInput): Promise<Availability> {
    const response = await this.apiClient.mutate(
      bookingMutations.CREATE_AVAILABILITY,
      { input }
    ) as { createAvailability: Availability };
    return response.createAvailability;
  }

  // ===== DISPONIBILITÉS HEBDOMADAIRES =====

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
