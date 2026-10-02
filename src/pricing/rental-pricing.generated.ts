/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/pricing/rental-pricing.ts
   │  Régénérer        : ./scripts/sync-pricing.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-pricing.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

/**
 * Calcul du prix d'une location (service de profil `rental`,
 * docs/architecture/workflows-de-service.md §3.1 et §3.4).
 *
 * Une organisation déclare une grille par unité de temps (jour / semaine / mois),
 * des remises par durée et une caution. Le prix d'une période est le MOINS CHER
 * des découpages possibles, arrondi à l'unité supérieure quand c'est plus
 * avantageux pour le client : 6 jours à 100 € / jour (600 €) coûtent 500 € si la
 * semaine est à 500 €. Programmation dynamique sur le nombre de jours.
 *
 * Montants en unités mineures (entiers), jamais de flottant. Devise explicite.
 * Fonctions pures, sans dépendance : recopiées par scripts/sync-pricing.sh.
 */

export type RentalUnit = 'day' | 'week' | 'month';

export const RENTAL_UNIT_DAYS: Record<RentalUnit, number> = { day: 1, week: 7, month: 30 };

/** Grille tarifaire : montant par unité, en unités mineures. Au moins `day` ou `week` ou `month`. */
export interface RentalRateCard {
  day?: number | null;
  week?: number | null;
  month?: number | null;
}

/** Remise par durée : à partir de `minDays` jours, `percent` % sur le total. La plus forte applicable gagne. */
export interface RentalDurationDiscount {
  minDays: number;
  percent: number;
}

export interface RentalProfile {
  rateCard: RentalRateCard;
  currency?: string | null;
  discounts?: RentalDurationDiscount[] | null;
  /** Caution, hors prix (bloquée ou mentionnée au contrat). */
  deposit?: number | null;
  /** Durée minimale de location, en jours (1 par défaut). */
  minDays?: number | null;
  /** Kilométrage inclus par jour (null = illimité). */
  mileagePerDay?: number | null;
}

export interface RentalQuoteLine {
  unit: RentalUnit;
  quantity: number;
  unitRate: number;
  amount: number;
}

export interface RentalQuote {
  days: number;
  currency: string;
  lines: RentalQuoteLine[];
  /** Somme des lignes avant remise. */
  subtotal: number;
  discountPercent: number;
  discountAmount: number;
  /** Prix de la location (hors caution). */
  total: number;
  /** Tarif de référence à la journée (grille, ou total / jours). */
  dailyRate: number;
  deposit: number;
  /** Kilométrage inclus sur la période (null = illimité). */
  mileageIncluded: number | null;
}

export class RentalPricingError extends Error {
  constructor(public readonly code: 'INVALID_PERIOD' | 'EMPTY_RATE_CARD' | 'INVALID_RATE' | 'BELOW_MIN_DAYS', message: string) {
    super(message);
    this.name = 'RentalPricingError';
  }
}

const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);
const DAY_MS = 86_400_000;

/** Nombre de jours facturés entre deux dates ISO (`YYYY-MM-DD` ou date-heure) : au moins 1, par jour entamé. */
export function rentalDays(start: string | Date, end: string | Date): number {
  const a = typeof start === 'string' ? Date.parse(start) : start.getTime();
  const b = typeof end === 'string' ? Date.parse(end) : end.getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b)) throw new RentalPricingError('INVALID_PERIOD', 'Dates de location invalides.');
  if (b < a) throw new RentalPricingError('INVALID_PERIOD', 'La date de retour précède la date de départ.');
  const days = Math.ceil((b - a) / DAY_MS);
  return Math.max(1, days);
}

/** Grille validée : unités connues, montants entiers positifs, au moins une unité. */
export function normalizeRateCard(raw: unknown): RentalRateCard {
  const src = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const card: RentalRateCard = {};
  for (const unit of ['day', 'week', 'month'] as RentalUnit[]) {
    const v = src[unit];
    if (v === undefined || v === null || v === '') continue;
    const n = typeof v === 'string' ? Number(v) : v;
    if (!isInt(n) || n <= 0) throw new RentalPricingError('INVALID_RATE', `Tarif « ${unit} » invalide : entier positif en unités mineures attendu.`);
    card[unit] = n;
  }
  if (!card.day && !card.week && !card.month) throw new RentalPricingError('EMPTY_RATE_CARD', 'Grille tarifaire vide : indiquez au moins un tarif (jour, semaine ou mois).');
  return card;
}

/** Découpage le moins cher d'une durée en unités de la grille (arrondi à l'unité supérieure si moins cher). */
export function cheapestBreakdown(days: number, card: RentalRateCard): RentalQuoteLine[] {
  // À prix égal, la plus petite unité gagne (moins de jours « offerts » par arrondi, découpage lisible).
  const units = (['day', 'week', 'month'] as RentalUnit[]).filter((u) => isInt(card[u]) && (card[u] as number) > 0);
  // cost[n] : coût minimal pour couvrir AU MOINS n jours ; choice[n] : unité ajoutée.
  const cost: number[] = new Array(days + 1).fill(Number.POSITIVE_INFINITY);
  const choice: Array<RentalUnit | null> = new Array(days + 1).fill(null);
  cost[0] = 0;
  for (let n = 1; n <= days; n++) {
    for (const u of units) {
      const prev = Math.max(0, n - RENTAL_UNIT_DAYS[u]);
      const c = cost[prev] + (card[u] as number);
      if (c < cost[n]) { cost[n] = c; choice[n] = u; }
    }
  }
  const counts: Partial<Record<RentalUnit, number>> = {};
  for (let n = days; n > 0;) {
    const u = choice[n]!;
    counts[u] = (counts[u] ?? 0) + 1;
    n = Math.max(0, n - RENTAL_UNIT_DAYS[u]);
  }
  return (['month', 'week', 'day'] as RentalUnit[])
    .filter((u) => counts[u])
    .map((u) => ({ unit: u, quantity: counts[u]!, unitRate: card[u] as number, amount: counts[u]! * (card[u] as number) }));
}

/** Devis d'une location pour une période. */
export function quoteRental(profile: RentalProfile, start: string | Date, end: string | Date): RentalQuote {
  const card = normalizeRateCard(profile.rateCard);
  const days = rentalDays(start, end);
  const minDays = isInt(profile.minDays) && profile.minDays! > 0 ? profile.minDays! : 1;
  if (days < minDays) throw new RentalPricingError('BELOW_MIN_DAYS', `Durée minimale de location : ${minDays} jour${minDays > 1 ? 's' : ''}.`);
  const lines = cheapestBreakdown(days, card);
  const subtotal = lines.reduce((a, l) => a + l.amount, 0);
  const discount = (profile.discounts ?? [])
    .filter((d) => isInt(d?.minDays) && d.minDays > 0 && typeof d?.percent === 'number' && d.percent > 0 && d.percent <= 100 && days >= d.minDays)
    .reduce((best, d) => (d.percent > best ? d.percent : best), 0);
  const discountAmount = Math.round((subtotal * discount) / 100);
  const total = subtotal - discountAmount;
  const dailyRate = card.day ?? Math.round(total / days);
  const deposit = isInt(profile.deposit) && profile.deposit! >= 0 ? profile.deposit! : 0;
  const mileageIncluded = isInt(profile.mileagePerDay) && profile.mileagePerDay! > 0 ? profile.mileagePerDay! * days : null;
  return {
    days,
    currency: (profile.currency ?? 'EUR').toUpperCase(),
    lines,
    subtotal,
    discountPercent: discount,
    discountAmount,
    total,
    dailyRate,
    deposit,
    mileageIncluded,
  };
}

/**
 * Profil `rental` d'un service, à partir de ce que porte DÉJÀ le catalogue
 * (docs/architecture/workflows-de-service.md §3.2) : le prix du service et son
 * `billingPlan` donnent le tarif de base (`dayly` → jour, `hourly` → non géré ici),
 * les paliers et la caution sont des attributs de l'objet (`ServiceAttribute` :
 * `rate_week`, `rate_month`, `deposit_amount`, `min_days`, `mileage_included`,
 * `discount_<jours>_pct`), la devise est celle du service (recopiée de
 * l'organisation). Jamais lu dans un JSON libre. Null sans tarif journalier valide.
 */
export interface RentalServiceShape {
  price?: number | null;
  currency?: string | null;
  billingPlan?: string | null;
  attributes?: Readonly<Record<string, string>> | null;
}

const attrInt = (attrs: Readonly<Record<string, string>> | null | undefined, key: string): number | null => {
  const v = attrs?.[key];
  return typeof v === 'string' && /^\d{1,15}$/.test(v.trim()) ? Number(v.trim()) : null;
};

export function rentalProfileOf(service: RentalServiceShape | null | undefined): RentalProfile | null {
  if (!service || typeof service !== 'object') return null;
  const attrs = service.attributes ?? null;
  const plan = String(service.billingPlan ?? '').toLowerCase();
  const day = plan === 'dayly' && isInt(service.price) && (service.price as number) > 0 ? (service.price as number) : attrInt(attrs, 'rate_day');
  const rateCard: RentalRateCard = { day, week: attrInt(attrs, 'rate_week'), month: attrInt(attrs, 'rate_month') };
  try { normalizeRateCard(rateCard); } catch { return null; }
  const discounts: RentalDurationDiscount[] = [];
  for (const [k, v] of Object.entries(attrs ?? {})) {
    const m = /^discount_(\d+)_pct$/.exec(k);
    if (m && /^\d{1,3}$/.test(String(v).trim())) discounts.push({ minDays: Number(m[1]), percent: Number(String(v).trim()) });
  }
  return {
    rateCard,
    currency: service.currency ?? null,
    discounts: discounts.length ? discounts.sort((a, b) => a.minDays - b.minDays) : null,
    deposit: attrInt(attrs, 'deposit_amount'),
    minDays: attrInt(attrs, 'min_days'),
    mileagePerDay: attrInt(attrs, 'mileage_included'),
  };
}
