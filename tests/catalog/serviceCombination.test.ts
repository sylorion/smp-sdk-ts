/**
 * Verrou des combinaisons modalité × facturation × canal dans le SDK : typage
 * (`ServiceCombination`) et refus local avant tout appel réseau, même règle que mu-catalog.
 */
import { Service, ServiceCombinationError, assertServiceCombination } from '../../src/domains/catalog/ServiceController';
import type { ServiceCombination } from '../../src/service-profiles/service-profiles.generated';

function serviceWithMock() {
  const mutate = jest.fn().mockResolvedValue({ createService: { serviceID: 's1' }, updateService: { serviceID: 's1' } });
  const service = new Service({ mutate, query: jest.fn() } as never);
  return { service, mutate };
}

const base = { authorID: 'u', title: 'T', description: 'd', organizationID: 'o', locationID: 'l', price: 10, legalVatPercent: 20, lowerPrice: 10, upperPrice: 10, state: 'online' };

describe('Service.create / update — combinaisons', () => {
  it('refuse localement instantané + mixte, sans appel réseau', async () => {
    const { service, mutate } = serviceWithMock();
    const bad = { ...base, uptakeForm: 'instant', billingPlan: 'mixed', supplyType: 'mixed' } as unknown as Parameters<Service['create']>[0];
    await expect(service.create(bad)).rejects.toBeInstanceOf(ServiceCombinationError);
    await expect(service.create(bad)).rejects.toMatchObject({ code: 'SERVICE_COMBINATION_INVALID', issue: { field: 'billingPlan' } });
    expect(mutate).not.toHaveBeenCalled();
  });

  it('laisse passer une combinaison exécutable, ou aucun réglage (défauts de la base)', async () => {
    const { service, mutate } = serviceWithMock();
    await service.create({ ...base, uptakeForm: 'periodic', billingPlan: 'semestrial', supplyType: 'irl' });
    await service.create(base);
    await service.update('s1', { title: 'x' });
    expect(mutate).toHaveBeenCalledTimes(3);
  });

  it('update : réglages partiels vérifiés sur ce qui est fourni (le reste est vérifié par mu-catalog)', () => {
    expect(() => assertServiceCombination({ uptakeForm: 'periodic', billingPlan: 'direct' })).toThrow(ServiceCombinationError);
    expect(() => assertServiceCombination({ billingPlan: 'weekly' })).toThrow(ServiceCombinationError);
    expect(() => assertServiceCombination({})).not.toThrow();
  });

  it('typage : une combinaison non exécutable ou partielle ne compile pas', () => {
    const { service } = serviceWithMock();
    const ok: ServiceCombination = { uptakeForm: 'booking_required', billingPlan: 'minute', supplyType: 'online' };
    // @ts-expect-error — l'instantané n'a pas de tarif mensuel
    const ko: ServiceCombination = { uptakeForm: 'instant', billingPlan: 'mensual', supplyType: 'irl' };
    // @ts-expect-error — les trois réglages vont ensemble
    void (() => service.create({ ...base, billingPlan: 'direct' }));
    expect([ok, ko]).toHaveLength(2);
  });
});
