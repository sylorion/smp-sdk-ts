/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/pricing/pricing.spec.ts
   │  Régénérer        : ./scripts/sync-pricing.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-pricing.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

import {
  PLATFORM_FEE_RATE,
  calculatePlatformFee,
  calculateStripeFees,
  calculateVat,
  computeCartPricing,
  computePricing,
  estimateHTFromTotal,
  isPeriodicUptake,
} from './pricing.generated';
import { PRICING_CASES } from './pricing.fixtures';

/* ────────────────────────────────────────────────────────────────────────────
 * Suite partagée du calcul de prix.
 * Recopiée à l'identique dans chaque projet par `scripts/sync-pricing.sh`.
 * Ne pas modifier ailleurs que dans libs/shared/pricing/.
 * ──────────────────────────────────────────────────────────────────────────── */

describe('computePricing — vecteurs partagés', () => {
  it.each(PRICING_CASES.map((c) => [c.label, c] as const))('%s', (_label, testCase) => {
    const result = computePricing(testCase.input);
    expect({
      vatCents: result.vatCents,
      platformFeeCents: result.platformFeeCents,
      subtotalCents: result.subtotalCents,
      stripeFeeCents: result.stripeFeeCents,
      totalCents: result.totalCents,
      netSellerCents: result.netSellerCents,
      isPeriodic: result.isPeriodic,
    }).toEqual(testCase.expected);
  });
});

describe('computePricing — invariants', () => {
  it('la somme des composantes est toujours exactement le total', () => {
    for (let ht = 0; ht <= 500000; ht += 997) {
      for (const vatPercent of [0, 5.5, 10, 20]) {
        const p = computePricing({ priceHTCents: ht, vatPercent });
        expect(p.priceHTCents + p.vatCents + p.platformFeeCents + p.stripeFeeCents).toBe(p.totalCents);
        expect(p.netSellerCents + p.platformFeeCents).toBe(p.subtotalCents);
      }
    }
  });

  it('ne produit que des entiers — jamais de flottant en centimes', () => {
    for (const ht of [1, 7, 33, 333, 3333, 99999]) {
      const p = computePricing({ priceHTCents: ht, vatPercent: 5.5 });
      for (const [key, value] of Object.entries(p)) {
        if (typeof value === 'number' && key !== 'vatPercent') {
          expect(Number.isInteger(value)).toBe(true);
        }
      }
    }
  });

  it("la commission porte sur le HT, jamais sur le TTC", () => {
    // Régression : mu-billing calculait `platformFee = round(amount * 0.08)` où
    // `amount` était le total TTC, ce qui surfacturait la commission de ~28 %.
    const p = computePricing({ priceHTCents: 10000, vatPercent: 20 });
    expect(p.platformFeeCents).toBe(Math.round(10000 * PLATFORM_FEE_RATE));
    expect(p.platformFeeCents).not.toBe(Math.round(p.totalCents * PLATFORM_FEE_RATE));
  });

  it('un abonnement ne refacture jamais les frais Stripe', () => {
    const p = computePricing({ priceHTCents: 12345, vatPercent: 20, uptakeForm: 'periodic' });
    expect(p.stripeFeeCents).toBe(0);
    expect(p.totalCents).toBe(p.subtotalCents);
  });

  it('rejette les entrées invalides plutôt que de produire un montant faux', () => {
    expect(() => computePricing({ priceHTCents: -1 })).toThrow(RangeError);
    expect(() => computePricing({ priceHTCents: NaN })).toThrow(RangeError);
    expect(() => computePricing({ priceHTCents: 100, vatPercent: 120 })).toThrow(RangeError);
  });
});

describe('computeCartPricing', () => {
  it('applique TVA et commission sur le total HT, pas ligne par ligne', () => {
    const lines = [
      { unitPriceHTCents: 3333, quantity: 1 },
      { unitPriceHTCents: 3333, quantity: 2 },
    ];
    const cart = computeCartPricing(lines, { vatPercent: 20 });
    expect(cart.priceHTCents).toBe(9999);
    // Ligne par ligne on obtiendrait round(3333*0.08)=267 puis 267*2=534, soit 801.
    // Sur le total : round(9999*0.08) = 800. C'est cette valeur qui doit être retenue.
    expect(cart.platformFeeCents).toBe(800);
  });

  it('quantité par défaut à 1', () => {
    expect(computeCartPricing([{ unitPriceHTCents: 500 }]).priceHTCents).toBe(500);
  });
});

describe('helpers', () => {
  it('isPeriodicUptake tolère casse et espaces', () => {
    expect(isPeriodicUptake('periodic')).toBe(true);
    expect(isPeriodicUptake(' Periodic ')).toBe(true);
    expect(isPeriodicUptake('booking_required')).toBe(false);
    expect(isPeriodicUptake(undefined)).toBe(false);
  });

  it('calculateStripeFees distingue EEE et hors EEE', () => {
    expect(calculateStripeFees(10000, 'FR')).toBe(175);
    expect(calculateStripeFees(10000, 'GB')).toBe(275);
    expect(calculateStripeFees(10000, 'US')).toBe(275);
    expect(calculateStripeFees(10000)).toBe(175);
  });

  it('calculateVat et calculatePlatformFee sont cohérents avec computePricing', () => {
    const p = computePricing({ priceHTCents: 7777, vatPercent: 10 });
    expect(p.vatCents).toBe(calculateVat(7777, 10));
    expect(p.platformFeeCents).toBe(calculatePlatformFee(7777));
  });
});

describe('estimateHTFromTotal — réconciliation de données historiques', () => {
  it('retrouve le HT à quelques centimes près', () => {
    for (const ht of [1000, 10000, 45500, 123456]) {
      for (const isPeriodic of [true, false]) {
        const total = computePricing({ priceHTCents: ht, vatPercent: 20, isPeriodic }).totalCents;
        expect(Math.abs(estimateHTFromTotal(total, { vatPercent: 20, isPeriodic }) - ht)).toBeLessThanOrEqual(2);
      }
    }
  });
});
