/** Agenda des membres (mu-command). Dates en ISO 8601. */
export type AgendaVisibility = 'team' | 'private';
export type AgendaAttendeeStatus = 'pending' | 'accepted' | 'declined';

export interface AgendaAttendee {
  userId: string;
  status: AgendaAttendeeStatus;
}

export interface AgendaEvent {
  eventId: string;
  organizationId: string;
  ownerUserId: string;
  /** « Occupé » quand `detailsHidden` (événement privé d'un autre membre). */
  title: string;
  description?: string | null;
  startAt: string;
  endAt: string;
  status: 'active' | 'cancelled' | 'completed';
  location?: string | null;
  contactId?: string | null;
  visibility: AgendaVisibility;
  detailsHidden: boolean;
  attendees: AgendaAttendee[];
  /** `event` (plage occupée) ou `reminder` (rappel à l'instant `startAt`). */
  entry: AgendaEntry;
  /** Objet auquel l'entrée renvoie. */
  subjectType?: AgendaSubjectType | null;
  subjectId?: string | null;
  /** Événement : rappel N minutes avant le début. */
  reminderMinutesBefore?: number | null;
  /** Rappel d'un événement : l'événement rappelé. */
  parentEventId?: string | null;
  /** Événement terminé : compte rendu de l'auteur. */
  outcome?: string | null;
  /** Rappel : date d'envoi (null tant qu'il n'est pas parti). */
  sentAt?: string | null;
}

export type AgendaEntry = 'event' | 'reminder';

/**
 * Objet auquel un rappel ou un événement renvoie : tâche et contact (mu-organization), autre
 * événement de l'agenda, ou document du fil documentaire. Même liste que mu-command
 * (`agenda-reminder-policy.ts`).
 */
export type AgendaSubjectType =
  | 'task' | 'contact' | 'agenda_event'
  | 'estimate_request' | 'estimate' | 'contract' | 'transaction' | 'order' | 'engagement' | 'booking' | 'invoice';

export interface AgendaEventsFilter {
  organizationId: string;
  from: string;
  to: string;
  /** Agendas de ces membres ; absent : toute l'équipe. */
  userIds?: string[];
}

export interface CreateAgendaEventInput {
  organizationId: string;
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  location?: string;
  contactId?: string;
  attendeeUserIds?: string[];
  visibility?: AgendaVisibility;
  allowOverlap?: boolean;
  subjectType?: AgendaSubjectType;
  subjectId?: string;
  /** Rappel N minutes avant (0 à 10 080). */
  reminderMinutesBefore?: number;
}

export interface UpdateAgendaEventInput {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  attendeeUserIds?: string[];
  visibility?: AgendaVisibility;
  allowOverlap?: boolean;
  reminderMinutesBefore?: number;
  /** Retire le rappel de l'événement. */
  clearReminder?: boolean;
}

export interface CreateAgendaReminderInput {
  organizationId: string;
  title: string;
  note?: string;
  /** ISO 8601, dans le futur, un an au plus. */
  remindAt: string;
  subjectType?: AgendaSubjectType;
  subjectId?: string;
  /** Collègues prévenus aussi (membres de l'organisation). */
  recipientUserIds?: string[];
  /** `private` par défaut. */
  visibility?: AgendaVisibility;
}

export interface AgendaRemindersFilter {
  organizationId: string;
  /** Rappels envoyés des 30 derniers jours inclus. */
  includeSent?: boolean;
  subjectType?: AgendaSubjectType;
  subjectId?: string;
}

/** Charge de l'événement RabbitMQ `agenda.reminder.due` (mu-command → mu-notification). */
export interface AgendaReminderDueEvent {
  organizationId: string;
  reminderId: string;
  title: string | null;
  note: string | null;
  remindAt: string;
  subjectType: AgendaSubjectType | null;
  subjectId: string | null;
  eventId: string | null;
  eventStartAt: string | null;
  location: string | null;
  ownerUserId: string;
  recipientUserIds: string[];
}
