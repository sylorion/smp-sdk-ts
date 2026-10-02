/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/pricing/rental-pricing.spec.ts
   │  Régénérer        : ./scripts/sync-pricing.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-pricing.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

import { cheapestBreakdown, normalizeRateCard, quoteRental, rentalDays, rentalProfileOf, RentalPricingError } from './rental-pricing.generated';

/** Grille de l'exemple : 100 € / jour, 500 € / semaine, 1 800 € / mois (unités mineures). */
const card = { day: 10000, week: 50000, month: 180000 };

describe('rentalDays', () => {
  it('jours entamés, minimum 1, refus des périodes inversées ou invalides', () => {
    expect(rentalDays('2026-11-01', '2026-11-04')).toBe(3);
    expect(rentalDays('2026-11-01', '2026-11-01')).toBe(1);
    expect(rentalDays('2026-11-01T09:00:00Z', '2026-11-02T10:00:00Z')).toBe(2);
    expect(() => rentalDays('2026-11-04', '2026-11-01')).toThrow(RentalPricingError);
    expect(() => rentalDays('nope', '2026-11-01')).toThrow(/invalides/);
  });
});

describe('normalizeRateCard', () => {
  it('accepte entiers et chaînes numériques, refuse zéro, flottant, grille vide', () => {
    expect(normalizeRateCard({ day: '10000', week: 50000 })).toEqual({ day: 10000, week: 50000 });
    expect(() => normalizeRateCard({ day: 99.5 })).toThrow(/entier positif/);
    expect(() => normalizeRateCard({ day: 0 })).toThrow(RentalPricingError);
    expect(() => normalizeRateCard({})).toThrow(/vide/);
    expect(() => normalizeRateCard(null)).toThrow(/vide/);
  });
});

describe('cheapestBreakdown / quoteRental — l’exemple 100 / 500 / 1 800', () => {
  it('3 jours : 3 × jour = 300 €', () => {
    const q = quoteRental({ rateCard: card }, '2026-11-01', '2026-11-04');
    expect(q.lines).toEqual([{ unit: 'day', quantity: 3, unitRate: 10000, amount: 30000 }]);
    expect(q.total).toBe(30000);
    expect(q.dailyRate).toBe(10000);
  });

  it('6 jours : la semaine (500 €) est moins chère que 6 jours (600 €) → arrondi à la semaine', () => {
    expect(cheapestBreakdown(6, card)).toEqual([{ unit: 'week', quantity: 1, unitRate: 50000, amount: 50000 }]);
  });

  it('12 jours : 1 semaine + 5 jours = 1 000 € ; 10 jours : 1 semaine + 3 jours = 800 €', () => {
    expect(cheapestBreakdown(12, card)).toEqual([
      { unit: 'week', quantity: 1, unitRate: 50000, amount: 50000 },
      { unit: 'day', quantity: 5, unitRate: 10000, amount: 50000 },
    ]);
    expect(cheapestBreakdown(10, card).reduce((a, l) => a + l.amount, 0)).toBe(80000);
  });

  it('26 jours : le mois (1 800 €) bat 3 semaines + 5 jours (2 000 €) ; 45 jours : 1 mois + 2 semaines + 1 jour', () => {
    expect(cheapestBreakdown(26, card)).toEqual([{ unit: 'month', quantity: 1, unitRate: 180000, amount: 180000 }]);
    const q45 = cheapestBreakdown(45, card);
    expect(q45.map((l) => `${l.quantity}×${l.unit}`)).toEqual(['1×month', '2×week', '1×day']);
    expect(q45.reduce((a, l) => a + l.amount, 0)).toBe(290000);
  });

  it('grille partielle : seulement un tarif journalier, ou seulement un mois', () => {
    expect(cheapestBreakdown(10, { day: 10000 })).toEqual([{ unit: 'day', quantity: 10, unitRate: 10000, amount: 100000 }]);
    expect(cheapestBreakdown(3, { month: 180000 })).toEqual([{ unit: 'month', quantity: 1, unitRate: 180000, amount: 180000 }]);
  });

  it('remise par durée : la plus forte applicable, arrondie ; caution et kilométrage hors prix', () => {
    const q = quoteRental({ rateCard: card, deposit: 120000, mileagePerDay: 200, discounts: [{ minDays: 7, percent: 10 }, { minDays: 30, percent: 20 }, { minDays: 3, percent: 5 }] }, '2026-11-01', '2026-11-13');
    expect(q.days).toBe(12);
    expect(q.subtotal).toBe(100000);
    expect(q.discountPercent).toBe(10);
    expect(q.discountAmount).toBe(10000);
    expect(q.total).toBe(90000);
    expect(q.deposit).toBe(120000);
    expect(q.mileageIncluded).toBe(2400);
    expect(q.currency).toBe('EUR');
  });

  it('durée minimale : refus en dessous ; tarif journalier de référence = total / jours sans tarif jour', () => {
    expect(() => quoteRental({ rateCard: card, minDays: 3 }, '2026-11-01', '2026-11-02')).toThrow(/minimale/);
    const q = quoteRental({ rateCard: { week: 50000 }, currency: 'xaf' }, '2026-11-01', '2026-11-05');
    expect(q.dailyRate).toBe(12500);
    expect(q.currency).toBe('XAF');
    expect(q.mileageIncluded).toBeNull();
  });

  it('remises invalides ignorées (pourcentage > 100, minDays nul)', () => {
    const q = quoteRental({ rateCard: card, discounts: [{ minDays: 0, percent: 50 }, { minDays: 1, percent: 150 }] }, '2026-11-01', '2026-11-03');
    expect(q.discountPercent).toBe(0);
  });
});

describe('rentalProfileOf', () => {
  it('tarif jour = prix du service en billingPlan dayly ; paliers, caution, remises et km en attributs ; devise du service', () => {
    expect(rentalProfileOf({ price: 10000, currency: 'EUR', billingPlan: 'dayly', attributes: { rate_week: '50000', rate_month: '180000', deposit_amount: '120000', discount_7_pct: '10', discount_30_pct: '20', mileage_included: '200', min_days: '2' } })).toEqual({
      rateCard: card, currency: 'EUR', discounts: [{ minDays: 7, percent: 10 }, { minDays: 30, percent: 20 }], deposit: 120000, minDays: 2, mileagePerDay: 200,
    });
  });
  it('null sans tarif journalier valide ; un billingPlan horaire ne fait pas une grille ; valeurs non entières ignorées', () => {
    expect(rentalProfileOf({ price: 10000, billingPlan: 'hourly', attributes: {} })).toBeNull();
    expect(rentalProfileOf({ price: 0, billingPlan: 'dayly' })).toBeNull();
    expect(rentalProfileOf({ price: 10000, billingPlan: 'dayly', attributes: { deposit_amount: '12,50', rate_week: 'abc' } })).toEqual({ rateCard: { day: 10000, week: null, month: null }, currency: null, discounts: null, deposit: null, minDays: null, mileagePerDay: null });
    expect(rentalProfileOf(null)).toBeNull();
  });
});
