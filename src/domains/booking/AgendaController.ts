import { APIClient } from '../../api/APIClient.js';
import { agendaMutations, agendaQueries } from '../../api/graphql/booking/agenda.js';
import {
  AgendaEvent,
  AgendaEventsFilter,
  AgendaRemindersFilter,
  AgendaWorkload,
  ContactLastActivitiesFilter,
  ContactLastActivity,
  CreateAgendaEventInput,
  CreateAgendaReminderInput,
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

  // ── Rappels ──

  /** Rappels de l'appelant (auteur ou destinataire), à venir ; `includeSent` : envoyés des 30 derniers jours. */
  async listReminders(filter: AgendaRemindersFilter): Promise<AgendaEvent[]> {
    const r = await this.client.query<{ agendaReminders: AgendaEvent[] }>(agendaQueries.AGENDA_REMINDERS, { filter });
    return r.agendaReminders ?? [];
  }

  /** Programme un rappel (envoyé par e-mail et dans l'application à `remindAt`). */
  async createReminder(input: CreateAgendaReminderInput): Promise<AgendaEvent> {
    return (await this.client.mutate<{ createAgendaReminder: AgendaEvent }>(agendaMutations.CREATE_AGENDA_REMINDER, { input })).createAgendaReminder;
  }

  /** Reporte un rappel, même déjà envoyé. */
  async snoozeReminder(eventId: string, remindAt: string): Promise<AgendaEvent> {
    return (await this.client.mutate<{ snoozeAgendaReminder: AgendaEvent }>(agendaMutations.SNOOZE_AGENDA_REMINDER, { input: { eventId, remindAt } })).snoozeAgendaReminder;
  }

  /** Charge de travail des missions sur la période (agenda v2). */
  async workload(filter: AgendaEventsFilter): Promise<AgendaWorkload> {
    return (await this.client.query<{ agendaWorkload: AgendaWorkload }>(agendaQueries.AGENDA_WORKLOAD, { filter })).agendaWorkload;
  }

  /** Dernier rendez-vous ou tâche lié à chaque contact. */
  async contactLastActivities(filter: ContactLastActivitiesFilter): Promise<ContactLastActivity[]> {
    return (await this.client.query<{ contactLastActivities: ContactLastActivity[] }>(agendaQueries.CONTACT_LAST_ACTIVITIES, { filter })).contactLastActivities ?? [];
  }

  /** « Terminer le point » : l'auteur clôt l'événement avec son compte rendu. */
  async completeEvent(eventId: string, outcome?: string): Promise<AgendaEvent> {
    return (await this.client.mutate<{ completeAgendaEvent: AgendaEvent }>(agendaMutations.COMPLETE_AGENDA_EVENT, { input: { eventId, ...(outcome ? { outcome } : {}) } })).completeAgendaEvent;
  }
}
