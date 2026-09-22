import { APIClient } from '../api/APIClient.js';
import { CreateBookingConfigurationInput, UpdateBookingConfigurationInput, BookingConfiguration, CreateServiceTypeBookingInput, ServiceType } from '../api/graphql/types/command/BookingTypes.js';
export declare class BookingConfigurationController {
    private apiClient;
    constructor(apiClient: APIClient);
    /**
     * Créer une configuration de booking pour un service
     */
    createBookingConfiguration(input: CreateBookingConfigurationInput): Promise<BookingConfiguration>;
    /**
     * Créer une configuration de booking basée sur le type de service
     */
    createServiceTypeBooking(input: CreateServiceTypeBookingInput): Promise<BookingConfiguration>;
    /**
     * Mettre à jour une configuration de booking
     */
    updateBookingConfiguration(id: string, input: UpdateBookingConfigurationInput): Promise<BookingConfiguration>;
    /**
     * Récupérer une configuration de booking par ID
     */
    getBookingConfiguration(id: string): Promise<BookingConfiguration | null>;
    /**
     * Récupérer une configuration de booking par service
     */
    getBookingConfigurationByService(serviceId: string): Promise<BookingConfiguration | null>;
    /**
     * Récupérer toutes les configurations de booking d'un utilisateur
     */
    getBookingConfigurationsByUser(userId: string): Promise<BookingConfiguration[]>;
    /**
     * Créer une configuration automatique basée sur le type de service
     */
    createAutomaticConfiguration(userId: string, serviceId: string, serviceType: ServiceType): Promise<BookingConfiguration>;
    /**
     * Vérifier si une configuration existe pour un service
     */
    hasConfigurationForService(serviceId: string): Promise<boolean>;
    /**
     * Obtenir la configuration par défaut pour un type de service
     */
    getDefaultConfigurationForServiceType(serviceType: ServiceType): {
        defaultSlotDuration: number;
        minBookingDuration: number;
        maxBookingDuration: number;
        dateRangeBookingAllowed: boolean;
    } | {
        defaultSlotDuration: number;
        minBookingDuration: number;
        maxBookingDuration: number;
        dateRangeBookingAllowed: boolean;
    } | {
        defaultSlotDuration: number;
        minBookingDuration: number;
        maxBookingDuration: number;
        dateRangeBookingAllowed: boolean;
    } | {
        defaultSlotDuration: number;
        minBookingDuration: number;
        maxBookingDuration: number;
        dateRangeBookingAllowed: boolean;
    } | {
        defaultSlotDuration: number;
        minBookingDuration: number;
        maxBookingDuration: number;
        dateRangeBookingAllowed: boolean;
    };
    /**
     * Créer une configuration avec gestion des utilisateurs non connectés
     */
    createConfigurationWithUnloggedUsers(input: CreateBookingConfigurationInput & {
        allowUnloggedUsers: boolean;
    }): Promise<BookingConfiguration>;
    /**
     * Vérifier la compatibilité d'une configuration avec les réservations existantes
     */
    validateConfigurationCompatibility(serviceId: string, newConfig: Partial<CreateBookingConfigurationInput>): Promise<{
        compatible: boolean;
        issues: string[];
    }>;
}
