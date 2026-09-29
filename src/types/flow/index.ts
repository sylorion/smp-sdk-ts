/**
 * Flows de service — types alignés sur le schéma GraphQL de mu-command
 * (module service-flow). Référence : smp/docs/architecture/workflows-de-service.md.
 */

// ── Définition (JSON stocké dans ServiceFlowVersion.definition) ─────────

export type ServiceFlowStepType = 'questionnaire' | 'documents' | 'contract' | 'review' | 'condition';

export type ServiceFlowQuestionType = 'text' | 'textarea' | 'number' | 'single' | 'multi' | 'list' | 'date' | 'email';

export interface ServiceFlowQuestion {
  key: string;
  label: string;
  help?: string;
  type: ServiceFlowQuestionType;
  options?: string[];
  required?: boolean;
  /** Un champ « Précision (optionnel) » accompagne la réponse. */
  allowPrecision?: boolean;
  /** Variable du contrat alimentée par cette réponse, ex. `ca_tranche`. */
  contractVariable?: string;
}

export interface ServiceFlowDocumentRequirement {
  key: string;
  label: string;
  help?: string;
  required?: boolean;
  formats?: string[];
  maxSizeMb?: number;
}

export type ServiceFlowVariableSource =
  | { source: 'answer'; key: string }
  | { source: 'buyer'; key: string }
  | { source: 'order'; key: string }
  | { source: 'service'; key: string }
  | { source: 'fixed'; value: string };

export interface ServiceFlowQuestionnaireConfig {
  questions: ServiceFlowQuestion[];
  estimatedMinutes?: number;
}
export interface ServiceFlowDocumentsConfig {
  documents: ServiceFlowDocumentRequirement[];
  estimatedMinutes?: number;
}
export interface ServiceFlowContractConfig {
  templateKind: 'organization' | 'standard';
  templateId: string;
  title?: string;
  variables?: Record<string, ServiceFlowVariableSource>;
  estimatedMinutes?: number;
}
export interface ServiceFlowReviewConfig {
  timing: 'before_payment' | 'after_payment';
  slaHours?: number;
  autoCountersign?: boolean;
}
export interface ServiceFlowConditionConfig {
  questionKey: string;
  operator: 'eq' | 'neq' | 'in' | 'gt' | 'lt';
  value: string | number | Array<string | number>;
  yes: string;
  no: string;
}

interface ServiceFlowStepBase<T extends ServiceFlowStepType, C> {
  key: string;
  type: T;
  title: string;
  subtitle?: string;
  next?: string | null;
  /** Étape proposée par l'agent, pas encore appliquée : refusée à la publication. */
  proposed?: boolean;
  /** Position dans l'éditeur visuel. */
  position?: { x: number; y: number };
  config: C;
}

export type ServiceFlowStep =
  | ServiceFlowStepBase<'questionnaire', ServiceFlowQuestionnaireConfig>
  | ServiceFlowStepBase<'documents', ServiceFlowDocumentsConfig>
  | ServiceFlowStepBase<'contract', ServiceFlowContractConfig>
  | ServiceFlowStepBase<'review', ServiceFlowReviewConfig>
  | ServiceFlowStepBase<'condition', ServiceFlowConditionConfig>;

export interface ServiceFlowDefinition {
  entry?: string | null;
  reviewSlaHours?: number;
  priceHoldDays?: number;
  steps: ServiceFlowStep[];
}

// ── Objets GraphQL ──────────────────────────────────────────────────────

export type ServiceFlowStatus = 'draft' | 'active' | 'archived';

export type ServiceFlowRunStatus =
  | 'in_progress'
  | 'pending_review'
  | 'changes_requested'
  | 'validated'
  | 'refused'
  | 'expired'
  | 'ordered'
  | 'paid'
  | 'awaiting_countersign'
  | 'completed'
  | 'canceled';

export interface ServiceFlowServiceLink {
  serviceId: string;
  linkedAt: string;
  runs30d: number;
}

export interface ServiceFlow {
  flowId: string;
  organizationId: string;
  name: string;
  description?: string | null;
  status: ServiceFlowStatus;
  publishedVersion?: number | null;
  draftVersion: number;
  hasUnpublishedChanges: boolean;
  definition: ServiceFlowDefinition;
  publishedDefinition?: ServiceFlowDefinition | null;
  createdByAgent: boolean;
  services: ServiceFlowServiceLink[];
  completionRate30d?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceFlowVersion {
  versionId: string;
  flowId: string;
  version: number;
  definition: ServiceFlowDefinition;
  publishedAt: string;
  publishedBy?: string | null;
  runs: number;
}

export interface ServiceFlowPublicStep {
  key: string;
  type: ServiceFlowStepType | string;
  title: string;
  summary?: string | null;
  count?: number | null;
  estimatedMinutes: number;
  items: string[];
}

export interface ServiceFlowPublic {
  flowId: string;
  serviceId: string;
  version: number;
  steps: ServiceFlowPublicStep[];
  estimatedMinutes: number;
  requiresReview: boolean;
  reviewTiming?: 'before_payment' | 'after_payment' | string | null;
  medianValidationMinutes?: number | null;
  priceHoldDays: number;
}

export interface ServiceFlowStats {
  pendingRuns: number;
  pendingOverSla: number;
  started30d: number;
  completed30d: number;
  completionRate30d?: number | null;
  medianValidationMinutes?: number | null;
  flowsCount: number;
  activeCount: number;
  draftCount: number;
  servicesCovered: number;
}

export interface ServiceFlowFunnelStep {
  stepKey: string;
  type: ServiceFlowStepType | string;
  title: string;
  reached: number;
}

export interface ServiceFlowLoss {
  stepKey: string;
  title: string;
  lost: number;
  itemKey?: string | null;
  itemLabel?: string | null;
  itemAbandons?: number | null;
}

export type ServiceFlowStepRunStatus = 'in_progress' | 'completed' | 'changes_requested';

/** Fichier déposé pour une pièce (stocké par la webapp, référencé par `fileId`). */
export interface ServiceFlowFile {
  fileId?: string;
  documentId?: string;
  url?: string;
  name: string;
  format?: string | null;
  sizeBytes?: number | null;
  mimeType?: string;
  uploadedAt?: string;
}

/** Données d'une étape : réponses du questionnaire, pièces, ou état du contrat. */
export interface ServiceFlowStepData {
  answers?: Record<string, string | number | string[]>;
  precisions?: Record<string, string>;
  documents?: Record<string, ServiceFlowFile[]>;
  contractId?: string;
  clientSignedAt?: string;
  pdfHash?: string | null;
  [key: string]: unknown;
}

export interface ServiceFlowStepRun {
  stepKey: string;
  type: ServiceFlowStepType | string;
  title: string;
  status: ServiceFlowStepRunStatus;
  data?: ServiceFlowStepData | null;
  startedAt?: string | null;
  completedAt?: string | null;
}

export interface ServiceFlowEvent {
  eventId: string;
  type: string;
  actorUserId?: string | null;
  message?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt: string;
}

export interface ServiceFlowChangeRequest {
  stepKey: string;
  stepTitle?: string;
  itemKey?: string | null;
  itemLabel?: string | null;
  message: string;
  requestedAt?: string;
  requestedBy?: string;
}

export interface ServiceFlowRun {
  runId: string;
  number: number;
  flowId: string;
  flowName: string;
  version: number;
  organizationId: string;
  serviceId: string;
  buyerUserId: string;
  buyerOrganizationId?: string | null;
  buyerName?: string | null;
  buyerEmail?: string | null;
  buyerCompany?: string | null;
  status: ServiceFlowRunStatus;
  currentStepKey?: string | null;
  steps: ServiceFlowStepRun[];
  definition: ServiceFlowDefinition;
  contractId?: string | null;
  orderId?: string | null;
  amount?: number | null;
  currency: string;
  options?: Record<string, unknown> | null;
  reviewDueAt?: string | null;
  priceHoldUntil?: string | null;
  expiresAt?: string | null;
  submittedAt?: string | null;
  validatedAt?: string | null;
  validatedBy?: string | null;
  refusalReason?: string | null;
  changeRequest?: ServiceFlowChangeRequest | null;
  events: ServiceFlowEvent[];
  startedAt: string;
  updatedAt: string;
}

export interface ServiceFlowUsage {
  flowId: string;
  days: number;
  started: number;
  funnel: ServiceFlowFunnelStep[];
  biggestLoss?: ServiceFlowLoss | null;
  services: ServiceFlowServiceLink[];
  pending: ServiceFlowRun[];
}

export interface ServiceFlowContractPreparation {
  contractId: string;
  invitationToken: string;
}

// ── Entrées ─────────────────────────────────────────────────────────────

export interface CreateServiceFlowInput {
  organizationId: string;
  name: string;
  description?: string;
  definition?: ServiceFlowDefinition;
  createdByAgent?: boolean;
}

export interface UpdateServiceFlowInput {
  name?: string;
  description?: string;
  definition?: ServiceFlowDefinition;
}

export interface StartServiceFlowRunInput {
  serviceId: string;
  amount?: number;
  currency?: string;
  options?: Record<string, unknown>;
  buyerName?: string;
  buyerEmail?: string;
  buyerCompany?: string;
  buyerOrganizationId?: string;
}

export interface ValidateServiceFlowRunInput {
  signerUserId?: string;
  applyStamp?: boolean;
}

export interface RequestServiceFlowChangesInput {
  stepKey: string;
  itemKey?: string;
  message: string;
}

export interface ServiceFlowRunsFilter {
  organizationId: string;
  flowId?: string;
  status?: ServiceFlowRunStatus[];
  limit?: number;
  offset?: number;
}

/** Codes d'erreur GraphQL (`extensions.code`) renvoyés par le moteur (mu-command service-flow.errors.ts). */
export type ServiceFlowErrorCode =
  | 'FLOW_NOT_FOUND'
  | 'RUN_NOT_FOUND'
  | 'FLOW_INCOMPLETE'
  | 'FLOW_NOT_PUBLISHED'
  | 'FLOW_HAS_RUNS'
  | 'FLOW_ARCHIVED'
  | 'INVALID_DEFINITION'
  | 'INVALID_INPUT'
  | 'SERVICE_HAS_NO_FLOW'
  | 'SERVICE_NOT_FOUND'
  | 'SERVICE_NOT_IN_ORGANIZATION'
  | 'INVALID_TRANSITION'
  | 'RUN_ALREADY_ACTIVE'
  | 'STEP_NOT_AVAILABLE'
  | 'STEP_INVALID'
  | 'STEP_DATA_TOO_LARGE'
  | 'CONTRACT_NOT_READY'
  | 'CONTRACT_NOT_SIGNED'
  | 'CONTRACT_UNAVAILABLE'
  | 'NO_SAVED_SIGNATURE'
  | 'NO_STAMP'
  | 'COUNTERSIGN_FAILED'
  | 'FLOW_NOT_VALIDATED'
  /** Modalité du service incompatible (prestation sur devis ; abonnement avec validation après paiement). */
  | 'SERVICE_FLOW_UNSUPPORTED'
  /** Capacité du service ou de l'organisation atteinte (`extensions.reason`, `extensions.nextAvailableAt`). */
  | 'SERVICE_CAPACITY_REACHED';

/** Erreur de validation d'une étape (`extensions.errors` de STEP_INVALID). */
export interface ServiceFlowStepFieldError {
  key: string;
  code: 'required' | 'invalid_type' | 'unknown_option' | 'invalid_email' | 'invalid_date' | 'out_of_range' | 'too_long' | 'format' | 'size' | 'too_many_files' | 'invalid_file' | string;
  message: string;
}
