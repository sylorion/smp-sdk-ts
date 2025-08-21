import { APIClient } from '../api/APIClient.js';
import { 
  CreateBookingConfigurationInput, 
  UpdateBookingConfigurationInput,
  BookingConfiguration,
  CreateServiceTypeBookingInput,
  ServiceType
} from '../api/graphql/types/command/BookingTypes.js';
import { 
  bookingConfigurationMutations 
} from '../api/graphql/mutations/command/bookingConfigurationMutations.js';
import { 
  bookingQueries 
} from '../api/graphql/queries/command/bookingQueries.js';

export class BookingConfigurationController {
  constructor(private apiClient: APIClient) {}

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
  async getBookingConfiguration(id: string): Promise<BookingConfiguration | null> {
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
}
