/**
 * Agenda des membres d'une organisation (mu-command, domaine agenda) : réunions, rendez-vous avec
 * un contact du CRM, indisponibilités — sans prestation derrière. L'appelant est TOUJOURS
 * l'identité signée de la requête : aucun document ne transmet de propriétaire.
 */
const EVENT_FIELDS = `eventId organizationId ownerUserId title description startAt endAt status location contactId
  visibility detailsHidden attendees { userId status }
  entry subjectType subjectId reminderMinutesBefore parentEventId outcome sentAt autoReason origin`;
/** Charge de travail des missions (agenda v2) : missions, créneaux, réservations, heures de travail. */
const WORKLOAD_FIELDS = `missions { missionId ownerUserId title clientLabel serviceId startAt endAt status estimatedHours actualHours hourlyRate currency internal }
  slots { slotId missionId ownerUserId title startAt endAt status }
  bookings { bookingId missionId ownerUserId serviceId day startMinute endMinute status }
  workingHours { userId isoDay startMinute endMinute }
  truncated`;

export const agendaQueries = {
  AGENDA_EVENTS: `query AgendaEvents($filter: AgendaEventsFilter!) { agendaEvents(filter: $filter) { ${EVENT_FIELDS} } }`,
  AGENDA_EVENT: `query AgendaEvent($eventId: ID!) { agendaEvent(eventId: $eventId) { ${EVENT_FIELDS} } }`,
  /** Rappels de l'appelant (auteur ou destinataire). */
  AGENDA_REMINDERS: `query AgendaReminders($filter: AgendaRemindersFilter!) { agendaReminders(filter: $filter) { ${EVENT_FIELDS} } }`,
  /** Missions, créneaux de travail, réservations et heures de travail sur la période (taux selon les droits). */
  AGENDA_WORKLOAD: `query AgendaWorkload($filter: AgendaEventsFilter!) { agendaWorkload(filter: $filter) { ${WORKLOAD_FIELDS} } }`,
  /** Dernier rendez-vous ou tâche lié à chaque contact (colonne « Dernier échange »). */
  CONTACT_LAST_ACTIVITIES: `query ContactLastActivities($filter: ContactLastActivitiesFilter!) { contactLastActivities(filter: $filter) { contactId lastActivityAt } }`,
};

export const agendaMutations = {
  CREATE_AGENDA_EVENT: `mutation CreateAgendaEvent($input: CreateAgendaEventInput!) { createAgendaEvent(input: $input) { ${EVENT_FIELDS} } }`,
  UPDATE_AGENDA_EVENT: `mutation UpdateAgendaEvent($eventId: ID!, $input: UpdateAgendaEventInput!) { updateAgendaEvent(eventId: $eventId, input: $input) { ${EVENT_FIELDS} } }`,
  CANCEL_AGENDA_EVENT: `mutation CancelAgendaEvent($eventId: ID!) { cancelAgendaEvent(eventId: $eventId) { ${EVENT_FIELDS} } }`,
  RESPOND_AGENDA_EVENT: `mutation RespondAgendaEvent($input: RespondAgendaEventInput!) { respondAgendaEvent(input: $input) { ${EVENT_FIELDS} } }`,
  CREATE_AGENDA_REMINDER: `mutation CreateAgendaReminder($input: CreateAgendaReminderInput!) { createAgendaReminder(input: $input) { ${EVENT_FIELDS} } }`,
  SNOOZE_AGENDA_REMINDER: `mutation SnoozeAgendaReminder($input: SnoozeAgendaReminderInput!) { snoozeAgendaReminder(input: $input) { ${EVENT_FIELDS} } }`,
  /** « Terminer le point » : clôt un événement avec son compte rendu. */
  COMPLETE_AGENDA_EVENT: `mutation CompleteAgendaEvent($input: CompleteAgendaEventInput!) { completeAgendaEvent(input: $input) { ${EVENT_FIELDS} } }`,
};
