// Types pour les engagements

/**
 * Informations client liées à un engagement.
 * Stockées dans `metadata.clientInfo`.
 */
export interface EngagementClientInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  siret?: string;
  address?: {
    street?: string;
    city?: string;
    zip?: string;
    country?: string;
  };
}

/**
 * Métadonnées structurées d'un engagement.
 * Stockées dans le champ JSON `metadata`.
 */
export interface EngagementMetadata {
  /** Coordonnées du client (extraites de billingInformation ou saisies manuellement) */
  clientInfo?: EngagementClientInfo;
  /** Référence facture associée */
  invoiceId?: string;
  /** Référence commande d'origine */
  orderId?: string;
  /** Référence devis lié */
  quoteRef?: string;
  /** Champs libres supplémentaires */
  [key: string]: unknown;
}

export interface Engagement {
  engagementId: string;
  consultantUserId: string;
  organizationId: string;
  buyerUserId?: string;
  estimateId?: string;
  serviceId: string;
  projectName: string;
  projectDescription?: string;
  startDate: string;
  endDate?: string;
  hourlyRate: number;
  estimatedHours?: number;
  actualHours: number;
  status: EngagementStatus;
  priority: EngagementPriority;
  notes?: string;
  attachments?: Record<string, unknown>;
  deliverables?: Record<string, unknown>;
  metadata?: EngagementMetadata;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  // Relations optionnelles
  timeSlots?: TimeSlot[];
  reports?: EngagementReport[];
}

// Types pour les créneaux temporels
export interface TimeSlot {
  timeSlotId: string;
  slotType: TimeSlotType;
  engagementId?: string;
  engagementReportId?: string;
  engagementMilestoneId?: string;
  serviceId?: string;
  startDateTime: string;
  endDateTime?: string;
  duration?: number;
  title?: string;
  description?: string;
  status: TimeSlotStatus;
  priority: TimeSlotPriority;
  capacity: number;
  maxParticipants: number;
  currentParticipants: number;
  isPublic: boolean;
  requiresApproval: boolean;
  parentSlotId?: string;
  dependentSlotIds?: Record<string, any>;
  estimatedHours?: number;
  actualHours?: number;
  hourlyRate?: number;
  qualityScore?: number;
  clientFeedback?: string;
  internalNotes?: string;
  deliverables?: Record<string, any>;
  codeCommits?: Record<string, any>;
  documentation?: Record<string, any>;
  participants?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
}

// Types pour les rapports d'engagement
export interface EngagementReport {
  engagementReportId: string;
  engagementId: string;
  consultantUserId: string;
  organizationId: string;
  serviceId: string;
  periodType: string;
  periodValue: number;
  month?: number;
  year: number;
  hourlyRate: number;
  totalHours: number;
  totalAmount: number;
  status: EngagementReportStatus;
  submittedAt?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  invoiceId?: string;
  token: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
  deletedAt?: string;
  timeSlots?: TimeSlot[];
}

// Enums
export enum EngagementStatus {
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum EngagementPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TimeSlotType {
  TIMESHEET_ENTRY = 'timesheet_entry',
  AVAILABILITY_SLOT = 'availability_slot'
}

export enum TimeSlotStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold'
}

export enum TimeSlotPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
  CRITICAL = 'critical'
}

export enum EngagementReportStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  PAID = 'paid',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

// Input types
export interface CreateEngagementInput {
  consultantUserId: string;
  organizationId: string;
  buyerUserId?: string;
  estimateId?: string;
  serviceId: string;
  projectName: string;
  projectDescription?: string;
  startDate: string;
  endDate?: string;
  hourlyRate: number;
  estimatedHours?: number;
  status?: EngagementStatus;
  priority?: EngagementPriority;
  notes?: string;
  metadata?: EngagementMetadata;
}

export interface UpdateEngagementInput {
  projectName?: string;
  projectDescription?: string;
  startDate?: string;
  endDate?: string;
  hourlyRate?: number;
  estimatedHours?: number;
  status?: EngagementStatus;
  priority?: EngagementPriority;
  notes?: string;
  deliverables?: Record<string, unknown>;
  metadata?: EngagementMetadata;
}

export interface CreateTimeSlotInput {
  slotType: TimeSlotType;
  engagementId?: string;
  engagementReportId?: string; // ⭐ Lien optionnel avec un rapport mensuel
  engagementMilestoneId?: string;
  serviceId?: string;
  startDateTime: string;
  endDateTime?: string;
  duration?: number;
  title?: string;
  description?: string;
  status?: TimeSlotStatus;
  priority?: TimeSlotPriority;
  capacity?: number;
  maxParticipants?: number;
  isPublic?: boolean;
  requiresApproval?: boolean;
  parentSlotId?: string;
  dependentSlotIds?: Record<string, any>;
  estimatedHours?: number;
  actualHours?: number;
  hourlyRate?: number;
  qualityScore?: number;
  clientFeedback?: string;
  internalNotes?: string;
  deliverables?: Record<string, any>;
  codeCommits?: Record<string, any>;
  documentation?: Record<string, any>;
  participants?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: Record<string, any>;
}

export interface UpdateTimeSlotInput {
  slotType?: TimeSlotType;
  engagementId?: string;
  engagementReportId?: string; // ⭐ Lien optionnel avec un rapport mensuel
  engagementMilestoneId?: string;
  serviceId?: string;
  startDateTime?: string;
  endDateTime?: string;
  duration?: number;
  title?: string;
  description?: string;
  status?: TimeSlotStatus;
  priority?: TimeSlotPriority;
  capacity?: number;
  maxParticipants?: number;
  isPublic?: boolean;
  requiresApproval?: boolean;
  parentSlotId?: string;
  dependentSlotIds?: Record<string, any>;
  estimatedHours?: number;
  actualHours?: number;
  hourlyRate?: number;
  qualityScore?: number;
  clientFeedback?: string;
  internalNotes?: string;
  deliverables?: Record<string, any>;
  codeCommits?: Record<string, any>;
  documentation?: Record<string, any>;
  participants?: Record<string, any>;
  metadata?: Record<string, any>;
  tags?: Record<string, any>;
}

export interface CreateEngagementReportInput {
  engagementId: string;
  consultantUserId: string;
  organizationId: string;
  serviceId: string;
  month: number;
  year: number;
  hourlyRate: number;
  totalHours: number;
  totalAmount: number;
  status?: EngagementReportStatus;
  notes?: string;
}

export interface UpdateEngagementReportInput {
  month?: number;
  year?: number;
  hourlyRate?: number;
  totalHours?: number;
  totalAmount?: number;
  status?: EngagementReportStatus;
  notes?: string;
}

