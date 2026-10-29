/** Espace de travail de l'organisation (mu-command, ex-mu-organization) : types publics. */
export type OrganizationTaskStatus = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type OrganizationTaskPriority = 'low' | 'normal' | 'high' | 'urgent';
export type OrganizationTaskEventKind =
  | 'created' | 'updated' | 'assigned' | 'status_changed' | 'commented' | 'dossier_handed_over' | 'deleted'
  | 'planned' | 'unplanned' | 'deliverable_added' | 'deliverable_provided' | 'deliverable_reopened' | 'deliverable_removed'
  | 'file_added' | 'file_removed' | 'time_logged' | 'time_removed';
export type OrganizationTaskDeliverableStatus = 'expected' | 'provided';
export type OrganizationTaskFileType = 'file' | 'image' | 'link';
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
  /** Temps estimé, en heures. */
  estimatedHours: number | null;
  /** Faux : seule la date de l'échéance compte (affichée sans heure). */
  dueHasTime: boolean;
  /** `iro` : proposée par Iro puis validée par l'utilisateur. */
  origin: string | null;
  /** Créneau d'agenda réservé pour la tâche. */
  planned: OrganizationTaskPlannedSlot | null;
  /** Livrables attendus (ce qui doit être fourni, par qui, pour quand). */
  deliverables: OrganizationTaskDeliverable[];
  /** Livrables déposés (fichier privé, image privée ou lien) ; le chemin de stockage n'est pas lu. */
  files: OrganizationTaskFile[];
}

export interface OrganizationTaskPlannedSlot {
  eventID: string;
  startAt: string;
  endAt: string;
}

export interface OrganizationTaskDeliverable {
  deliverableID: string;
  name: string;
  ownerUserID: string | null;
  dueAt: string | null;
  status: OrganizationTaskDeliverableStatus;
  providedAt: string | null;
  fileID: string | null;
  createdAt: string;
}

export interface OrganizationTaskFile {
  fileID: string;
  type: OrganizationTaskFileType;
  name: string;
  description: string | null;
  /** Lien externe (https) ; vide pour un fichier privé (adresse signée par la webapp). */
  url: string | null;
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  uploadedByUserID: string;
  uploadedAt: string;
  deliverableID: string | null;
}

/** Saisie de la feuille de temps d'une tâche. */
export interface OrganizationTaskTimeEntry {
  timeEntryID: string;
  taskID: string;
  userID: string;
  startAt: string;
  endAt: string;
  minutes: number;
  note: string | null;
  createdAt: string;
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
  estimatedHours?: number;
  /** Faux : seule la date compte. */
  dueHasTime?: boolean;
  /** `iro` : tâche proposée par Iro. */
  origin?: 'iro';
  /** Livrables attendus créés avec la tâche (30 au plus). */
  deliverables?: OrganizationTaskDeliverableDraft[];
}

export interface OrganizationTaskDeliverableDraft {
  name: string;
  ownerUserID?: string;
  dueAt?: string;
}

export interface UpdateOrganizationTaskInput {
  title?: string;
  description?: string;
  priority?: OrganizationTaskPriority;
  dueAt?: string;
  labels?: string[];
  position?: number;
  dueHasTime?: boolean;
  estimatedHours?: number;
  /** Retire l'échéance. */
  clearDueAt?: boolean;
  /** Retire le temps estimé. */
  clearEstimatedHours?: boolean;
}

export interface PlanOrganizationTaskInput {
  taskID: string;
  startAt: string;
  endAt: string;
}

export interface AddOrganizationTaskDeliverableInput extends OrganizationTaskDeliverableDraft {
  taskID: string;
}

export interface SetOrganizationTaskDeliverableStatusInput {
  taskID: string;
  deliverableID: string;
  status: OrganizationTaskDeliverableStatus;
}

/**
 * Dépôt d'un livrable : un lien (`type: 'link'`, `url` https) ou un fichier déjà téléversé dans le
 * stockage privé de la tâche (`path`, sous `task-deliverables/<organisation>/<tâche>/`).
 */
export interface AddOrganizationTaskFileInput {
  taskID: string;
  type: OrganizationTaskFileType;
  name: string;
  description?: string;
  url?: string;
  path?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  /** Livrable attendu auquel il répond (marqué fourni). */
  deliverableID?: string;
}

export interface LogOrganizationTaskTimeInput {
  taskID: string;
  startAt: string;
  endAt: string;
  note?: string;
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
