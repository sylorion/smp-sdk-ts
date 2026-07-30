// Types pour le système de booking et de commande
import { BillingInformation } from '../accounting/billing.js';

export interface EstimateRequest {
  estimateRequestId: string;
  serviceId: string;
  userId?: string;
  requestedStartDate: Date;
  requestedEndDate?: Date;
  requestedDuration?: number;
  description?: string;
  status: EstimateRequestStatus;
  billingInformation?: BillingInformation;
  additionalRequirements?: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum EstimateRequestStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  QUOTED = 'QUOTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface Booking {
  bookingId: string;
  serviceId: string;
  availabilityId?: string;
  userId?: string; // Peut être null pour les utilisateurs non connectés
  status: BookingStatus;

  // NOUVEAUX CHAMPS pour l'autodétermination des créneaux
  weeklyAvailabilityId?: string;
  slotDate?: Date;
  slotStartTime?: number;
  slotEndTime?: number;
  slotDuration?: number;

  // Détails du client en JSON
  customerDetails?: any;

  engagementId?: string;

  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED'
}

export interface Availability {
  availabilityId: string;
  serviceId: string;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  capacity: number;
  status: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface WeeklyAvailability {
  weeklyAvailabilityId: string;
  userId: string;
  serviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface AvailabilityException {
  availabilityExceptionId: string;
  userId: string;
  serviceId: string;
  exceptionStartDate: Date;
  exceptionEndDate?: Date;
  startTime: string;
  endTime: string;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface AvailableSlot {
  slotId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  availableCapacity: number;
  totalCapacity: number;
  serviceId: string;
  isAvailable: boolean;
  remainingSlots: number;
}

export interface DailySlot {
  slotId: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  capacity: number;
  availableCapacity: number;
  bookedCapacity: number;
  status: SlotStatus;
  serviceId: string;
  weeklyAvailabilityId?: string;
  isRecurring: boolean;
  bookingIds?: string[];
}

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  UNAVAILABLE = 'UNAVAILABLE',
  PAST = 'PAST'
}

export interface CustomRequirementItem {
  label: string;
  mandatory?: boolean;
  type?: 'document' | 'dress_code' | 'equipment' | 'health' | 'info' | 'custom';
  description?: string;
}

export interface CustomRequirements {
  items: CustomRequirementItem[];
  headerTitle?: string;
  headerNote?: string;
}

export interface BookingConfiguration {
  bookingConfigurationId: string;
  userId: string;
  serviceId: string;
  bookingMode: BookingMode;
  defaultSlotDuration: number;
  allowGroupBooking: boolean;
  minBookingDuration: number;
  maxBookingDuration: number;
  dateRangeBookingAllowed: boolean;
  cancellationWindow: number;
  cancellationPolicy?: string;
  advanceBookingLimit?: number;
  maxCapacity: number;
  customRequirements?: CustomRequirements | null;
  postBookingMessageTemplate?: string;
  autoSendPostBookingMessage?: boolean;
  createdAt: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export enum BookingMode {
  TIME_SLOT = 'TIME_SLOT',
  DATE_RANGE = 'DATE_RANGE',
  CONTINUOUS = 'CONTINUOUS' // NOUVEAU
}

export enum ServiceType {
  HOURLY = 'HOURLY',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM = 'CUSTOM'
}

// Types pour les inputs de création
export interface CreateEstimateRequestInput {
  serviceId: string;
  userId?: string;
  requestedStartDate: Date;
  requestedEndDate?: Date;
  requestedDuration?: number;
  description?: string;
  billingInformation?: BillingInformation;
  additionalRequirements?: string;
}

export interface CreateBookingInput {
  availabilityId?: string; // Maintenant optionnel pour les bookings sur disponibilité hebdomadaire
  userId?: string; // Peut être null pour les utilisateurs non connectés
  serviceId: string;

  // NOUVEAUX CHAMPS pour l'autodétermination des créneaux
  weeklyAvailabilityId?: string;
  slotDate?: Date;
  slotStartTime?: number;
  slotEndTime?: number;
  slotDuration?: number;

  // Détails du client en JSON
  customerDetails?: any;

  bookingStartDate?: Date;
  bookingEndDate?: Date;
  engagementId?: string;
}


export interface UpdateBookingInput {
  bookingId: string;
  customerDetails?: string;
}

export interface CreateAvailabilityInput {
  providerId: string;
  serviceId: string;
  startDate: Date;
  endDate: Date;
  startTime: number;
  endTime: number;
  capacity: number;
}

export interface UpdateAvailabilityInput {
  availabilityId: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: number;
  endTime?: number;
  capacity?: number;
  status?: AvailabilityStatus;
}

export enum AvailabilityStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED'
}

export interface CreateWeeklyAvailabilityInput {
  userId: string;
  serviceId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CreateWeeklyAvailabilityBatchInput {
  userId: string;
  serviceId: string;
  slots: WeeklyAvailabilitySlot[];
  replaceExisting: boolean;
}

export interface WeeklyAvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CreateDailySlotsInput {
  userId: string;
  serviceId: string;
  dayOfWeek: number;
  slots: DailyTimeSlot[];
  replaceExisting: boolean;
}

export interface DailyTimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface CreateAvailabilityExceptionInput {
  userId: string;
  serviceId: string;
  exceptionStartDate: Date;
  exceptionEndDate?: Date;
  startTime: string;
  endTime: string;
}

export interface CreateBookingConfigurationInput {
  userId: string;
  serviceId: string;
  bookingMode: string;
  defaultSlotDuration: number;
  allowGroupBooking: boolean;
  minBookingDuration: number;
  maxBookingDuration: number;
  dateRangeBookingAllowed: boolean;
  cancellationWindow?: number;
  cancellationPolicy?: string;
  advanceBookingLimit?: number;
  maxCapacity?: number;
  customRequirements?: CustomRequirements | null;
  postBookingMessageTemplate?: string;
  autoSendPostBookingMessage?: boolean;
}

export interface CreateServiceTypeBookingInput {
  userId: string;
  serviceId: string;
  serviceType: ServiceType;
  allowGroupBooking?: boolean;
  allowUnloggedUsers?: boolean;
  customNotes?: string;
}

export interface UpdateBookingConfigurationInput {
  userId?: string;
  serviceId?: string;
  bookingMode?: string;
  defaultSlotDuration?: number;
  allowGroupBooking?: boolean;
  minBookingDuration?: number;
  maxBookingDuration?: number;
  dateRangeBookingAllowed?: boolean;
  cancellationWindow?: number;
  cancellationPolicy?: string;
  advanceBookingLimit?: number;
  maxCapacity?: number;
  customRequirements?: CustomRequirements | null;
  postBookingMessageTemplate?: string;
  autoSendPostBookingMessage?: boolean;
}

// NOUVELLE INTERFACE pour les données du calendrier
export interface CalendarData {
  weeklyAvailabilities: WeeklyAvailability[];
  exceptions: AvailabilityException[];
  bookings: Booking[];
  dailySlots: DailySlot[];
  configuration?: {
    defaultSlotDuration: number;
    allowGroupBooking: boolean;
    minBookingDuration: number;
    maxBookingDuration: number;
  };
}

// Types pour les inputs de recherche
export interface SearchAvailabilityInput {
  serviceId: string;
  startDate: Date;
  endDate: Date;
  userId?: string;
  minDuration?: number;
  maxDuration?: number;
}

export interface AvailableSlotsInput {
  serviceId: string;
  date: Date;
  userId?: string;
  slotDuration?: number;
  maxSlots?: number;
}

export interface SearchDailySlotsInput {
  serviceId: string;
  date: Date;
  userId?: string;
  slotDuration?: number;
  maxSlots?: number;
  includeBookedSlots: boolean;
}
