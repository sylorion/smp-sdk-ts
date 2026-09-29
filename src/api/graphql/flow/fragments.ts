// =========================================
// Flows de service (mu-command, module service-flow)
// Référence : smp/docs/architecture/workflows-de-service.md §5
// =========================================

export const SERVICE_FLOW_FIELDS = `
  flowId
  organizationId
  name
  description
  status
  publishedVersion
  draftVersion
  hasUnpublishedChanges
  definition
  publishedDefinition
  createdByAgent
  services { serviceId linkedAt runs30d }
  completionRate30d
  createdAt
  updatedAt
`;

export const SERVICE_FLOW_RUN_FIELDS = `
  runId
  number
  flowId
  flowName
  version
  organizationId
  serviceId
  buyerUserId
  buyerOrganizationId
  buyerName
  buyerEmail
  buyerCompany
  status
  currentStepKey
  steps { stepKey type title status data startedAt completedAt }
  definition
  contractId
  orderId
  amount
  currency
  options
  reviewDueAt
  priceHoldUntil
  expiresAt
  submittedAt
  validatedAt
  validatedBy
  refusalReason
  changeRequest
  events { eventId type actorUserId message meta createdAt }
  startedAt
  updatedAt
`;
