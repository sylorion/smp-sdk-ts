import { BookingDomain, AgendaController } from '../../src/domains/booking';
import { agendaMutations, agendaQueries } from '../../src/api/graphql/booking/agenda';

describe('AgendaController', () => {
  const ev = { eventId: 'e1', title: 'RDV' };
  const client = () => ({
    query: jest.fn(async () => ({ agendaEvents: [ev] })),
    mutate: jest.fn(async () => ({ createAgendaEvent: ev, respondAgendaEvent: ev, cancelAgendaEvent: ev })),
  });

  it('est exposé sur le domaine booking', () => {
    expect(new BookingDomain(client() as any).agenda).toBeInstanceOf(AgendaController);
  });

  it('liste avec le filtre tel quel', async () => {
    const c = client();
    const out = await new AgendaController(c as any).listEvents({ organizationId: 'o1', from: '2026-10-19T00:00:00Z', to: '2026-10-26T00:00:00Z', userIds: ['u1'] });
    expect(c.query).toHaveBeenCalledWith(agendaQueries.AGENDA_EVENTS, { filter: { organizationId: 'o1', from: '2026-10-19T00:00:00Z', to: '2026-10-26T00:00:00Z', userIds: ['u1'] } });
    expect(out).toEqual([ev]);
  });

  it('créer, répondre, annuler : aucun propriétaire dans les variables', async () => {
    const c = client();
    const a = new AgendaController(c as any);
    await a.createEvent({ organizationId: 'o1', title: 'RDV', startAt: 'a', endAt: 'b', attendeeUserIds: ['u2'] });
    await a.respond('e1', 'accepted');
    await a.cancelEvent('e1');
    expect(c.mutate.mock.calls.map(([d, v]) => [d, v])).toEqual([
      [agendaMutations.CREATE_AGENDA_EVENT, { input: { organizationId: 'o1', title: 'RDV', startAt: 'a', endAt: 'b', attendeeUserIds: ['u2'] } }],
      [agendaMutations.RESPOND_AGENDA_EVENT, { input: { eventId: 'e1', status: 'accepted' } }],
      [agendaMutations.CANCEL_AGENDA_EVENT, { eventId: 'e1' }],
    ]);
    for (const doc of Object.values(agendaMutations)) expect(doc).not.toMatch(/ownerUserId:\s*\$/);
  });

  it('rappels et « Terminer le point » : documents et variables tels quels, sans auteur', async () => {
    const c = {
      query: jest.fn(async () => ({ agendaReminders: [ev] })),
      mutate: jest.fn(async () => ({ createAgendaReminder: ev, snoozeAgendaReminder: ev, completeAgendaEvent: ev })),
    };
    const a = new AgendaController(c as any);
    expect(await a.listReminders({ organizationId: 'o1', subjectType: 'invoice', subjectId: 'inv-1' })).toEqual([ev]);
    expect(c.query).toHaveBeenCalledWith(agendaQueries.AGENDA_REMINDERS, { filter: { organizationId: 'o1', subjectType: 'invoice', subjectId: 'inv-1' } });
    await a.createReminder({ organizationId: 'o1', title: 'Relancer', remindAt: '2027-01-10T08:00:00Z', subjectType: 'contact', subjectId: 'c1' });
    await a.snoozeReminder('e1', '2027-01-11T08:00:00Z');
    await a.completeEvent('e1', 'Devis à revoir');
    await a.completeEvent('e1');
    expect(c.mutate.mock.calls.map(([d, v]) => [d, v])).toEqual([
      [agendaMutations.CREATE_AGENDA_REMINDER, { input: { organizationId: 'o1', title: 'Relancer', remindAt: '2027-01-10T08:00:00Z', subjectType: 'contact', subjectId: 'c1' } }],
      [agendaMutations.SNOOZE_AGENDA_REMINDER, { input: { eventId: 'e1', remindAt: '2027-01-11T08:00:00Z' } }],
      [agendaMutations.COMPLETE_AGENDA_EVENT, { input: { eventId: 'e1', outcome: 'Devis à revoir' } }],
      [agendaMutations.COMPLETE_AGENDA_EVENT, { input: { eventId: 'e1' } }],
    ]);
    for (const doc of Object.values(agendaMutations)) expect(doc).not.toMatch(/ownerUserId:\s*\$/);
  });
});

describe('AgendaController — charge de travail et derniers échanges (agenda v2)', () => {
  it('workload et contactLastActivities : filtre transmis tel quel', async () => {
    const workload = { missions: [], slots: [], bookings: [], workingHours: [], truncated: false };
    const c = { query: jest.fn(async (doc: string) => (doc === agendaQueries.AGENDA_WORKLOAD ? { agendaWorkload: workload } : { contactLastActivities: [{ contactId: 'c1', lastActivityAt: 'x' }] })), mutate: jest.fn() };
    const a = new AgendaController(c as any);
    expect(await a.workload({ organizationId: 'o1', from: 'a', to: 'b', userIds: ['u1'] })).toEqual(workload);
    expect(c.query).toHaveBeenCalledWith(agendaQueries.AGENDA_WORKLOAD, { filter: { organizationId: 'o1', from: 'a', to: 'b', userIds: ['u1'] } });
    expect(await a.contactLastActivities({ organizationId: 'o1' })).toEqual([{ contactId: 'c1', lastActivityAt: 'x' }]);
    expect(agendaQueries.AGENDA_EVENTS).toMatch(/autoReason origin/);
  });
});
