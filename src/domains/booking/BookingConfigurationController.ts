import { APIClient } from '../../api/APIClient.js';
import {
  CreateBookingConfigurationInput,
  UpdateBookingConfigurationInput,
  BookingConfiguration,
  CreateServiceTypeBookingInput,
  ServiceType
} from '../../types/booking/index.js';
import { bookingMutations, bookingConfigurationMutations } from '../../api/graphql/booking/mutations.js';
import { bookingQueries } from '../../api/graphql/booking/queries.js';

export class BookingConfigurationController {
  constructor(private apiClient: APIClient) { }

  /**
   * Créer une configuration de booking pour un service
   */
  async createBookingConfiguration(
    input: CreateBookingConfigurationInput
  ): Promise<BookingConfiguration> {
    const response = await this.apiClient.mutate(
      bookingConfigurationMutations.CREATE_BOOKING_CONFIGURATION,
      { input }
    ) as { createBookingConfiguration: BookingConfiguration };
    return response.createBookingConfiguration;
  }

  /**
   * Créer une configuration de booking basée sur le type de service
   */
  async createServiceTypeBooking(
    input: CreateServiceTypeBookingInput
  ): Promise<BookingConfiguration> {
    const response = await this.apiClient.mutate(
      bookingConfigurationMutations.CREATE_SERVICE_TYPE_BOOKING,
      { input }
    ) as { createServiceTypeBooking: BookingConfiguration };
    return response.createServiceTypeBooking;
  }

  /**
   * Mettre à jour une configuration de booking
   */
  async updateBookingConfiguration(
    id: string,
    input: UpdateBookingConfigurationInput
  ): Promise<BookingConfiguration> {
    const response = await this.apiClient.mutate(
      bookingConfigurationMutations.UPDATE_BOOKING_CONFIGURATION,
      { id, input }
    ) as { updateBookingConfiguration: BookingConfiguration };
    return response.updateBookingConfiguration;
  }

  /**
   * Récupérer une configuration de booking par ID
   */
  async getBookingConfigurationById(id: string): Promise<BookingConfiguration | null> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKING_CONFIGURATION,
      { id }
    ) as { bookingConfiguration: BookingConfiguration | null };
    return response.bookingConfiguration;
  }

  /**
   * Récupérer une configuration de booking par service
   */
  async getBookingConfigurationByService(serviceId: string): Promise<BookingConfiguration | null> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKING_CONFIGURATION_BY_SERVICE,
      { serviceId }
    ) as { bookingConfigurationByService: BookingConfiguration | null };
    return response.bookingConfigurationByService;
  }

  /**
   * Récupérer toutes les configurations de booking d'un utilisateur
   */
  async getBookingConfigurationsByUser(userId: string): Promise<BookingConfiguration[]> {
    const response = await this.apiClient.query(
      bookingQueries.GET_BOOKING_CONFIGURATIONS_BY_USER,
      { userId }
    ) as { bookingConfigurationsByUser: BookingConfiguration[] };
    return response.bookingConfigurationsByUser;
  }



  /**
   * Créer une configuration automatique basée sur le type de service
   */
  async createAutomaticConfiguration(
    userId: string,
    serviceId: string,
    serviceType: ServiceType
  ): Promise<BookingConfiguration> {
    const input: CreateServiceTypeBookingInput = {
      userId,
      serviceId,
      serviceType,
      allowGroupBooking: false,
      allowUnloggedUsers: false
    };

    return this.createServiceTypeBooking(input);
  }

  /**
   * Vérifier si une configuration existe pour un service
   */
  async hasConfigurationForService(serviceId: string): Promise<boolean> {
    const config = await this.getBookingConfigurationByService(serviceId);
    return config !== null;
  }

  /**
   * Obtenir la configuration par défaut pour un type de service
   */
  getDefaultConfigurationForServiceType(serviceType: ServiceType) {
    const defaults = {
      HOURLY: {
        defaultSlotDuration: 60,
        minBookingDuration: 30,
        maxBookingDuration: 480,
        dateRangeBookingAllowed: false
      },
      DAILY: {
        defaultSlotDuration: 1440, // 24h en minutes
        minBookingDuration: 1440,
        maxBookingDuration: 10080, // 7 jours
        dateRangeBookingAllowed: true
      },
      WEEKLY: {
        defaultSlotDuration: 10080, // 7 jours en minutes
        minBookingDuration: 10080,
        maxBookingDuration: 43200, // 30 jours
        dateRangeBookingAllowed: true
      },
      MONTHLY: {
        defaultSlotDuration: 43200, // 30 jours en minutes
        minBookingDuration: 43200,
        maxBookingDuration: 129600, // 90 jours
        dateRangeBookingAllowed: true
      },
      CUSTOM: {
        defaultSlotDuration: 60,
        minBookingDuration: 15,
        maxBookingDuration: 1440,
        dateRangeBookingAllowed: true
      }
    };

    return defaults[serviceType];
  }

  /**
   * Créer une configuration avec gestion des utilisateurs non connectés
   */
  async createConfigurationWithUnloggedUsers(
    input: CreateBookingConfigurationInput & { allowUnloggedUsers: boolean }
  ): Promise<BookingConfiguration> {
    // Créer la configuration de base
    const baseConfig = await this.createBookingConfiguration(input);

    // Logique supplémentaire pour gérer les utilisateurs non connectés
    // (peut être étendue selon les besoins)

    return baseConfig;
  }

  /**
   * Vérifier la compatibilité d'une configuration avec les réservations existantes
   */
  async validateConfigurationCompatibility(
    serviceId: string,
    newConfig: Partial<CreateBookingConfigurationInput>
  ): Promise<{ compatible: boolean; issues: string[] }> {
    const existingBookings = await this.apiClient.query(
      'query GetBookingsCount($serviceId: String!) { bookingsByService(serviceId: $serviceId) { bookingId, quantity } }',
      { serviceId }
    ) as { bookingsByService: { bookingId: string; quantity?: string }[] };

    const issues: string[] = [];

    if (existingBookings.bookingsByService.length > 0) {
      // Vérifier la compatibilité avec les réservations existantes
      if (newConfig.defaultSlotDuration && newConfig.defaultSlotDuration < 30) {
        issues.push('La durée minimale ne peut pas être inférieure à 30 minutes avec des réservations existantes');
      }

      if (newConfig.allowGroupBooking === false && existingBookings.bookingsByService.some(b => b.quantity && parseInt(b.quantity) > 1)) {
        issues.push('Impossible de désactiver les réservations de groupe avec des réservations de groupe existantes');
      }
    }

    return {
      compatible: issues.length === 0,
      issues
    };
  }
}
