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
}

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
}
