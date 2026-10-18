/** Espace de travail de l'organisation (mu-command, ex-mu-organization) : types publics. */
export type OrganizationTaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type OrganizationTaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type OrganizationTaskEventKind = 'created' | 'updated' | 'assigned' | 'status_changed' | 'commented' | 'dossier_handed_over' | 'deleted';
/** Type de document du fil documentaire (`libs/shared/document-link`). */
export type OrganizationTaskDocumentType = 'estimate_request' | 'estimate' | 'contract' | 'transaction' | 'order' | 'engagement' | 'booking' | 'invoice';

export interface OrganizationTask {
  taskID: string;
  organizationID: string;
  title: string;
  description: string | null;
  status: OrganizationTaskStatus;
  priority: OrganizationTaskPriority;
  creatorUserID: string;
  assigneeUserID: string | null;
  dueAt: string | null;
  blockedReason: string | null;
  blockedByTaskID: string | null;
  documentType: OrganizationTaskDocumentType | null;
  documentID: string | null;
  labels: string[];
  position: number;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationTaskComment {
  commentID: string;
  taskID: string | null;
  documentType: OrganizationTaskDocumentType | null;
  documentID: string | null;
  authorUserID: string;
  content: string;
  createdAt: string;
}

export interface OrganizationTaskEvent {
  eventID: string;
  actorUserID: string;
  kind: OrganizationTaskEventKind;
  /** Détail de l'événement, déjà décodé (le service le renvoie en JSON texte). */
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface OrganizationTasksFilter {
  organizationID: string;
  /** `mine` (défaut) : créées ou assignées ; `team` : tout pour un gestionnaire, sinon les siennes et celles à prendre. */
  scope?: 'mine' | 'team';
  statuses?: OrganizationTaskStatus[];
  assigneeUserID?: string;
  documentType?: OrganizationTaskDocumentType;
  documentID?: string;
  limit?: number;
}

export interface CreateOrganizationTaskInput {
  organizationID: string;
  title: string;
  description?: string;
  priority?: OrganizationTaskPriority;
  assigneeUserID?: string;
  dueAt?: string;
  documentType?: OrganizationTaskDocumentType;
  documentID?: string;
  labels?: string[];
}

export interface UpdateOrganizationTaskInput {
  title?: string;
  description?: string;
  priority?: OrganizationTaskPriority;
  dueAt?: string;
  labels?: string[];
  position?: number;
}

export interface ChangeOrganizationTaskStatusInput {
  taskID: string;
  status: OrganizationTaskStatus;
  /** Requis pour `blocked`, sauf si `blockedByTaskID` est donné. */
  blockedReason?: string;
  blockedByTaskID?: string;
}

export interface AddOrganizationTaskCommentInput {
  organizationID: string;
  /** Sur une tâche… */
  taskID?: string;
  /** …ou directement sur un document du dossier. */
  documentType?: OrganizationTaskDocumentType;
  documentID?: string;
  content: string;
}

export interface HandOverDossierInput {
  organizationID: string;
  documentType: OrganizationTaskDocumentType;
  documentID: string;
  toUserID: string;
  title?: string;
  message?: string;
  priority?: OrganizationTaskPriority;
  dueAt?: string;
}
