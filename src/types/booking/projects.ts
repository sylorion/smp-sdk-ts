/** Projets internes d'une organisation (mu-command, domaine project). */

export type ProjectActivityType = 'activity' | 'deliverable';
export type ProjectActivityAction = 'start' | 'complete' | 'hold' | 'cancel' | 'reopen';
/** État calculé par le service. */
export type ProjectActivityState = 'ready' | 'in_progress' | 'waiting' | 'late' | 'on_hold' | 'done' | 'cancelled';
export type InternalProjectStatus = 'active' | 'on_hold' | 'completed' | 'cancelled';

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

/** Charge utile commune des événements `project.activity.assigned | unblocked | awaited`. */
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
  actorUserId: string;
  recipientUserIds: string[];
  /** `unblocked` : le prérequis terminé. */
  unblockedByActivityId?: string;
  unblockedByTitle?: string;
  /** `awaited` : l'activité qui attend et son responsable. */
  waitingActivityId?: string;
  waitingTitle?: string;
  waitingOwnerUserId?: string;
}
