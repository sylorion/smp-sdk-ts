import { statusByServices } from './api/graphql/queries/index.js';
import { serviceQueries } from "./api/graphql/queries/index.js";
import { logger } from "./utils/Logger.js";
import { APIClient } from "./api/APIClient.js"
import { SMPClient } from "./SMPClient.js"
import { Persistence } from './config/Persistence.js';
import { defaultLanguage } from './i18n/languages.js';

// Export types
export type { 
  EstimateDetails, 
  Negotiation, 
  CreateNegotiationInput, 
  NegotiationResponse,
  NegotiationStatus 
} from './types/Estimate';

export type {
  ContractResponse,
  CreateContractInput,
  UpdateContractInput,
  SignContractInput,
  SendContractInput,
  ContractStatus,
  SignerRole,
  SignatureType
} from './types/Contract';

// Export booking types
export type {
  EstimateRequest,
  EstimateRequestStatus,
  Booking,
  BookingStatus,
  Availability,
  WeeklyAvailability,
  AvailabilityException,
  AvailableSlot,
  DailySlot,
  SlotStatus,
  BookingConfiguration,
  BookingMode,
  ServiceType,
  CreateEstimateRequestInput,
  CreateBookingInput,
  CreateAvailabilityInput,
  UpdateAvailabilityInput,
  CreateWeeklyAvailabilityInput,
  CreateWeeklyAvailabilityBatchInput,
  CreateDailySlotsInput,
  CreateAvailabilityExceptionInput,
  CreateBookingConfigurationInput,
  CreateServiceTypeBookingInput,
  UpdateBookingConfigurationInput,
  SearchAvailabilityInput,
  AvailableSlotsInput,
  SearchDailySlotsInput,
  AvailabilityStatus
} from './api/graphql/types/command/BookingTypes';

// Export controllers
export * from './controllers';

export { SMPClient, APIClient, serviceQueries, statusByServices } ;
export { Persistence, defaultLanguage, logger };
