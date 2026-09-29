import { parse, OperationDefinitionNode, FieldNode } from 'graphql';
import { capacityQueries } from '../../src/api/graphql/capacity/queries';
import { capacityMutations } from '../../src/api/graphql/capacity/mutations';
import { CapacityController, MAX_AVAILABILITY_IDS } from '../../src/domains/capacity/CapacityController';
import { CapacityDomain } from '../../src/domains/capacity';

/** Capacité des prestations — contrat avec mu-command (docs/architecture/capacite-prestataire.md §4). */
const rootField = (doc: string) =>
  ((parse(doc).definitions[0] as OperationDefinitionNode).selectionSet.selections[0] as FieldNode).name.value;

describe('capacity — documents GraphQL', () => {
  const expected: Record<string, string> = {
    GET_SERVICE_CAPACITY: 'serviceCapacity',
    GET_ORGANIZATION_CAPACITY: 'organizationCapacity',
    GET_SERVICE_AVAILABILITY: 'serviceAvailability',
    GET_SERVICES_AVAILABILITY: 'servicesAvailability',
    UPSERT_SERVICE_CAPACITY: 'upsertServiceCapacity',
    UPSERT_ORGANIZATION_CAPACITY: 'upsertOrganizationCapacity',
  };
  const all: Record<string, string> = { ...capacityQueries, ...capacityMutations };
  test('toutes les opérations du module sont couvertes', () => expect(Object.keys(all).sort()).toEqual(Object.keys(expected).sort()));
  test.each(Object.entries(expected))('%s cible %s', (name, field) => expect(rootField(all[name])).toBe(field));
  test('la disponibilité publique ne demande aucun volume', () => {
    for (const doc of [capacityQueries.GET_SERVICE_AVAILABILITY, capacityQueries.GET_SERVICES_AVAILABILITY]) {
      expect(doc).not.toMatch(/activeCount|periodCount|maxActive|maxPerPeriod/);
    }
  });
});

describe('CapacityController', () => {
  function build() {
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    return { ctl: new CapacityController(client), client };
  }

  test('exposé sur le domaine capacity', () => {
    expect(new CapacityDomain({} as any).capacity).toBeInstanceOf(CapacityController);
  });

  test('réglages du service et de l’organisation', async () => {
    const { ctl, client } = build();
    client.mutate.mockResolvedValueOnce({ upsertServiceCapacity: { serviceId: 's1', maxActive: 5 } });
    const data = { enabled: true, maxActive: 5, maxPerPeriod: null, period: 'week' as const };
    await ctl.upsertServiceCapacity('s1', data);
    expect(client.mutate).toHaveBeenLastCalledWith(capacityMutations.UPSERT_SERVICE_CAPACITY, { serviceId: 's1', data });
    client.mutate.mockResolvedValueOnce({ upsertOrganizationCapacity: { organizationId: 'o1' } });
    await ctl.upsertOrganizationCapacity('o1', { enabled: true, maxActive: 20 });
    expect(client.mutate).toHaveBeenLastCalledWith(capacityMutations.UPSERT_ORGANIZATION_CAPACITY, { organizationId: 'o1', data: { enabled: true, maxActive: 20 } });
    client.query.mockResolvedValueOnce({ serviceCapacity: { serviceId: 's1', activeCount: 3 } });
    await expect(ctl.getServiceCapacity('s1')).resolves.toEqual({ serviceId: 's1', activeCount: 3 });
  });

  test('availabilities : lots de 100, doublons et vides retirés, ordre conservé', async () => {
    const { ctl, client } = build();
    client.query.mockImplementation(async (_doc: string, v: { serviceIds: string[] }) => ({
      servicesAvailability: v.serviceIds.map((serviceId) => ({ serviceId, available: true })),
    }));
    const ids = Array.from({ length: 150 }, (_, i) => `s${i}`);
    const out = await ctl.availabilities([...ids, 's0', '']);
    expect(client.query).toHaveBeenCalledTimes(2);
    expect(client.query.mock.calls[0][1].serviceIds).toHaveLength(MAX_AVAILABILITY_IDS);
    expect(client.query.mock.calls[1][1].serviceIds).toHaveLength(50);
    expect(out.map((a) => a.serviceId)).toEqual(ids);
    client.query.mockClear();
    await expect(ctl.availabilities([])).resolves.toEqual([]);
    expect(client.query).not.toHaveBeenCalled();
  });
});
