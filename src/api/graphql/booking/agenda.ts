/**
 * Agenda des membres d'une organisation (mu-command, domaine agenda) : réunions, rendez-vous avec
 * un contact du CRM, indisponibilités — sans prestation derrière. L'appelant est TOUJOURS
 * l'identité signée de la requête : aucun document ne transmet de propriétaire.
 */
const EVENT_FIELDS = `eventId organizationId ownerUserId title description startAt endAt status location contactId
  visibility detailsHidden attendees { userId status }`;

export const agendaQueries = {
  AGENDA_EVENTS: `query AgendaEvents($filter: AgendaEventsFilter!) { agendaEvents(filter: $filter) { ${EVENT_FIELDS} } }`,
  AGENDA_EVENT: `query AgendaEvent($eventId: ID!) { agendaEvent(eventId: $eventId) { ${EVENT_FIELDS} } }`,
};

export const agendaMutations = {
  CREATE_AGENDA_EVENT: `mutation CreateAgendaEvent($input: CreateAgendaEventInput!) { createAgendaEvent(input: $input) { ${EVENT_FIELDS} } }`,
  UPDATE_AGENDA_EVENT: `mutation UpdateAgendaEvent($eventId: ID!, $input: UpdateAgendaEventInput!) { updateAgendaEvent(eventId: $eventId, input: $input) { ${EVENT_FIELDS} } }`,
  CANCEL_AGENDA_EVENT: `mutation CancelAgendaEvent($eventId: ID!) { cancelAgendaEvent(eventId: $eventId) { ${EVENT_FIELDS} } }`,
  RESPOND_AGENDA_EVENT: `mutation RespondAgendaEvent($input: RespondAgendaEventInput!) { respondAgendaEvent(input: $input) { ${EVENT_FIELDS} } }`,
};
