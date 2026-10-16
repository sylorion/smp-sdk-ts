import { APIClient } from '../../api/APIClient.js';
import { agendaMutations, agendaQueries } from '../../api/graphql/booking/agenda.js';
import {
  AgendaEvent,
  AgendaEventsFilter,
  CreateAgendaEventInput,
  UpdateAgendaEventInput,
} from '../../types/booking/agenda.js';

/**
 * Agenda des membres d'une organisation. À utiliser avec un client qui porte l'identité de
 * l'utilisateur (`APIClient.withUserAssertion` côté serveur) : le service refuse un appel anonyme.
 */
export class AgendaController {
  constructor(private readonly client: APIClient) {}

  async listEvents(filter: AgendaEventsFilter): Promise<AgendaEvent[]> {
    const r = await this.client.query<{ agendaEvents: AgendaEvent[] }>(agendaQueries.AGENDA_EVENTS, { filter });
    return r.agendaEvents ?? [];
  }

  async getEvent(eventId: string): Promise<AgendaEvent> {
    return (await this.client.query<{ agendaEvent: AgendaEvent }>(agendaQueries.AGENDA_EVENT, { eventId })).agendaEvent;
  }

  async createEvent(input: CreateAgendaEventInput): Promise<AgendaEvent> {
    return (await this.client.mutate<{ createAgendaEvent: AgendaEvent }>(agendaMutations.CREATE_AGENDA_EVENT, { input })).createAgendaEvent;
  }

  async updateEvent(eventId: string, input: UpdateAgendaEventInput): Promise<AgendaEvent> {
    return (await this.client.mutate<{ updateAgendaEvent: AgendaEvent }>(agendaMutations.UPDATE_AGENDA_EVENT, { eventId, input })).updateAgendaEvent;
  }

  async cancelEvent(eventId: string): Promise<AgendaEvent> {
    return (await this.client.mutate<{ cancelAgendaEvent: AgendaEvent }>(agendaMutations.CANCEL_AGENDA_EVENT, { eventId })).cancelAgendaEvent;
  }

  async respond(eventId: string, status: 'accepted' | 'declined'): Promise<AgendaEvent> {
    return (await this.client.mutate<{ respondAgendaEvent: AgendaEvent }>(agendaMutations.RESPOND_AGENDA_EVENT, { input: { eventId, status } })).respondAgendaEvent;
  }
}
