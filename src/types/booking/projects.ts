/** Projets internes d'une organisation (mu-command, domaine project). */

export type ProjectActivityType = 'activity' | 'deliverable';
/** Terminer un livrable exige un dépôt et le responsable du projet (`validateActivityDeliverable` fait de même). */
export type ProjectActivityAction = 'start' | 'complete' | 'hold' | 'cancel' | 'reopen';
/** État calculé par le service. */
export type ProjectActivityState = 'ready' | 'in_progress' | 'waiting' | 'late' | 'on_hold' | 'done' | 'cancelled';
export type InternalProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

export type ActivityTimeStatus = 'agreed' | 'proposed' | 'to_fill' | 'countered';
/** `set`, `propose`, `ask` (gestionnaire) · `accept`, `counter` (responsable) · `acceptCounter`, `keep`, `nudge` (gestionnaire). */
export type ProjectActivityTimeAction = 'set' | 'propose' | 'ask' | 'accept' | 'counter' | 'acceptCounter' | 'keep' | 'nudge';
export type ActivityIssueCategory = 'third_party' | 'workload' | 'technical' | 'scope' | 'other';
export type ActivityEventKind = 'status' | 'time' | 'file' | 'issue' | 'comment' | 'date';

/** Temps alloué : `estimatedHours` est la valeur validée ; ceci est la négociation. */
export interface ActivityTime {
  status: ActivityTimeStatus;
  proposedHours?: number | null;
  counterHours?: number | null;
  comment?: string | null;
  initiatedByUserId?: string | null;
  /** Dernière relance du responsable du projet (une par heure et par activité). */
  lastNudgeAt?: string | null;
}

export interface ActivityIssue {
  issueId: string;
  byUserId: string;
  createdAt: string;
  category: ActivityIssueCategory;
  text: string;
  newDueAt?: string | null;
  need?: string | null;
  open: boolean;
  resolvedAt?: string | null;
  resolvedByUserId?: string | null;
  resolvedNote?: string | null;
}

export interface ActivityDeliverable {
  name: string;
  url: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
  depositedByUserId?: string | null;
  depositedVia: 'member' | 'link';
  depositedByLabel?: string | null;
  depositedAt: string;
  validatedByUserId?: string | null;
  validatedAt?: string | null;
}

/** Entrée du journal ; `byUserId` nul = personne extérieure arrivée par un lien de partage. */
export interface ActivityEvent {
  eventId: string;
  at: string;
  byUserId?: string | null;
  kind: ActivityEventKind;
  hours?: number | null;
  text: string;
}

export interface ProjectActivity {
  activityId: string;
  projectId: string;
  title: string;
  description?: string | null;
  type: ProjectActivityType;
  ownerUserId: string;
  startAt?: string | null;
  dueAt?: string | null;
  /** Statut stocké : active, on_hold, completed, cancelled. */
  status: string;
  state: ProjectActivityState;
  dependsOn: string[];
  /** Prérequis pas encore faits. */
  waitingOn: string[];
  /** Activités ouvertes qui attendent celle-ci. */
  blocking: string[];
  estimatedHours?: number | null;
  actualHours: number;
  critical: boolean;
  time: ActivityTime;
  issues: ActivityIssue[];
  deliverable?: ActivityDeliverable | null;
  /** Les 100 dernières entrées, de la plus ancienne à la plus récente. */
  journal: ActivityEvent[];
}

export interface InternalProjectProgress {
  total: number;
  done: number;
  percent: number;
  late: number;
  waiting: number;
  plannedHours: number;
  spentHours: number;
}

export interface InternalProject {
  projectId: string;
  organizationId: string;
  name: string;
  description?: string | null;
  objective?: string | null;
  ownerUserId: string;
  startAt: string;
  dueAt?: string | null;
  status: InternalProjectStatus;
  progress: InternalProjectProgress;
  /** Activités du chemin critique, dans l'ordre. */
  criticalPath: string[];
  activities: ProjectActivity[];
}

export interface CreateInternalProjectInput {
  organizationId: string;
  name: string;
  description?: string;
  objective?: string;
  /** Responsable (membre) ; défaut : l'appelant. */
  ownerUserId?: string;
  startAt?: string;
  dueAt?: string;
}

export interface UpdateInternalProjectInput {
  name?: string;
  description?: string;
  objective?: string;
  ownerUserId?: string;
  dueAt?: string;
  status?: InternalProjectStatus;
}

export interface AddProjectActivityInput {
  projectId: string;
  title: string;
  description?: string;
  type?: ProjectActivityType;
  ownerUserId?: string;
  startAt?: string;
  dueAt?: string;
  estimatedHours?: number;
  /** Prérequis (activités du même projet), 20 au plus, sans cycle. */
  dependsOn?: string[];
}

export type UpdateProjectActivityInput = Partial<Omit<AddProjectActivityInput, 'projectId'>>;

export interface ShiftProjectActivityInput {
  activityId: string;
  /** -60 à 365, hors 0. */
  deltaDays: number;
}

export interface ProjectActivityTimeInput {
  activityId: string;
  action: ProjectActivityTimeAction;
  /** 0 < heures ≤ 10 000 (actions `set`, `propose`, `counter`). */
  hours?: number;
  comment?: string;
}

export interface ReportActivityIssueInput {
  activityId: string;
  category: ActivityIssueCategory;
  text: string;
  newDueAt?: string;
  need?: string;
}

export interface ResolveActivityIssueInput {
  activityId: string;
  issueId: string;
  /** Décale l'échéance à `newDueAt` de la difficulté (avec la cascade) avant de résoudre. */
  acceptNewDue?: boolean;
  note?: string;
}

export interface DepositActivityDeliverableInput {
  activityId: string;
  name: string;
  /** Chemin de stockage sous `project-deliverables/<organisation>/<activité>/`, ou URL https. */
  url: string;
  mimeType?: string;
  sizeBytes?: number;
}

export type ProjectShareTargetType = 'project' | 'activity';
export type ProjectShareLinkState = 'active' | 'expired' | 'revoked';

export interface CreateProjectShareLinkInput {
  targetType: ProjectShareTargetType;
  targetId: string;
  /** 1 à 8760 ; absent : sans limite. */
  validityHours?: number;
  /** Dépôt par une personne extérieure : lien d'une activité de type livrable ouvert. */
  allowUpload?: boolean;
}

/** Le jeton n'est renvoyé qu'à la création. */
export interface ProjectShareLinkCreated {
  linkId: string;
  token: string;
  expiresAt?: string | null;
  allowUpload: boolean;
  targetType: ProjectShareTargetType;
  targetId: string;
}

export interface ProjectShareLink {
  linkId: string;
  targetType: ProjectShareTargetType;
  targetId: string;
  createdAt: string;
  expiresAt?: string | null;
  allowUpload: boolean;
  revokedAt?: string | null;
  state: ProjectShareLinkState;
}

export interface SharedActivity {
  activityId: string;
  title: string;
  type: ProjectActivityType;
  ownerUserId: string;
  startAt?: string | null;
  dueAt?: string | null;
  state: ProjectActivityState;
  critical: boolean;
}

/** Vue publique en lecture seule. Hors `ok`, aucun autre champ n'est renseigné. */
export interface SharedProjectView {
  state: 'ok' | 'expired' | 'revoked' | 'invalid';
  allowUpload: boolean;
  targetType?: ProjectShareTargetType | null;
  projectName?: string | null;
  objective?: string | null;
  organizationId?: string | null;
  progress?: InternalProjectProgress | null;
  activities: SharedActivity[];
  prerequisiteTitles: string[];
  focusActivityId?: string | null;
  focusDescription?: string | null;
  deliverableReceived: boolean;
}

export interface SharedDepositInput {
  token: string;
  name: string;
  /** Chemin de stockage sous `project-deliverables/<organisation>/<activité>/` (jamais d'URL). */
  url: string;
  mimeType?: string;
  sizeBytes?: number;
  /** Nom affiché dans le journal (« Déposé par … via lien »). */
  depositorLabel?: string;
}

export type ProjectAttentionReason =
  | 'time_proposed' | 'time_requested' | 'time_countered' | 'time_agreed'
  | 'issue_reported' | 'issue_resolved' | 'deliverable_deposited' | 'deliverable_validated' | 'due_shifted';

/** Charge utile commune des événements `project.activity.assigned | unblocked | awaited | attention`. */
export interface ProjectActivityEvent {
  /** Clé de rejeu : un même message redélivré garde le même identifiant. */
  eventId: string;
  organizationId: string;
  projectId: string;
  projectName: string;
  activityId: string;
  title: string;
  type: ProjectActivityType;
  dueAt: string | null;
  /** Nul : dépôt par une personne extérieure (lien de partage). */
  actorUserId: string | null;
  recipientUserIds: string[];
  /** `unblocked` : le prérequis terminé. */
  unblockedByActivityId?: string;
  unblockedByTitle?: string;
  /** `awaited` : l'activité qui attend et son responsable. */
  waitingActivityId?: string;
  waitingTitle?: string;
  waitingOwnerUserId?: string;
  /** `attention` : motif et détail court (heures, catégorie, nom du livrable, date). */
  reason?: ProjectAttentionReason;
  detail?: string | null;
}
