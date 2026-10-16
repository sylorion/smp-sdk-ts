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
});
