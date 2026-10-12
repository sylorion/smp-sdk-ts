/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/currency/currency.ts
   │  Régénérer        : ./scripts/sync-currency.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-currency.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

/* ────────────────────────────────────────────────────────────────────────────
 * SOURCE DE VÉRITÉ DE LA DEVISE DE LA PLATEFORME
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Une organisation choisit sa devise dans ses paramètres
 * (`Organization.currency`, enum `ServicesAcceptedDevise` de mu-organization :
 * eur, usd, gbp, chf, xaf, xof, credit, unknw). Cette devise doit se propager
 * aux services, aux commandes, au paiement Stripe, aux factures, aux devis et
 * au wallet. Chaque maillon passe par CE module pour lire une devise.
 *
 * Recopié à l'identique dans chaque projet par `scripts/sync-currency.sh`
 * (même raison que libs/shared/pricing : contexte Docker limité au service).
 *
 * ── Conventions ────────────────────────────────────────────────────────────
 *
 * - Une devise circule TOUJOURS en code ISO-4217 MAJUSCULE ("EUR", "USD"…).
 *   Stripe veut des minuscules : utiliser `toStripeCurrency`.
 * - `credit` et `unknw` ne sont pas des devises : ils sont traités comme la
 *   devise par défaut (EUR). Même chose pour une valeur vide ou inconnue.
 * - Les montants internes sont TOUJOURS des entiers ×100 (« centimes »), quelle
 *   que soit la devise — y compris XAF/XOF, qui n'ont pas de subdivision.
 *   Stripe, lui, attend pour XAF/XOF un montant en unités entières :
 *   `toStripeAmount` / `fromStripeAmount` font la conversion à la frontière.
 * ──────────────────────────────────────────────────────────────────────────── */

export const SUPPORTED_CURRENCIES = ['EUR', 'USD', 'GBP', 'CHF', 'XAF', 'XOF'] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export const DEFAULT_CURRENCY: SupportedCurrency = 'EUR';

/** Devises que Stripe traite sans subdivision (montant en unités entières). */
export const ZERO_DECIMAL_CURRENCIES: readonly SupportedCurrency[] = ['XAF', 'XOF'];

/** Vrai si `value` désigne une devise réellement acceptée (casse indifférente). */
export function isSupportedCurrency(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value.trim().toUpperCase());
}

/**
 * Ramène n'importe quelle valeur de devise (enum org en minuscule, code ISO,
 * valeur vide, `credit`, `unknw`…) à un code ISO supporté, en majuscules.
 * Toute valeur non supportée retombe sur `fallback` (EUR par défaut).
 */
export function normalizeCurrency(
  value: unknown,
  fallback: SupportedCurrency = DEFAULT_CURRENCY,
): SupportedCurrency {
  if (isSupportedCurrency(value)) {
    return value.trim().toUpperCase() as SupportedCurrency;
  }
  return fallback;
}

/** Code devise au format attendu par l'API Stripe (minuscules). */
export function toStripeCurrency(value: unknown): string {
  return normalizeCurrency(value).toLowerCase();
}

export function isZeroDecimalCurrency(value: unknown): boolean {
  return ZERO_DECIMAL_CURRENCIES.includes(normalizeCurrency(value));
}

/** Montant interne (×100) → montant attendu par Stripe pour cette devise. */
export function toStripeAmount(amountCents: number, currency: unknown): number {
  const cents = Math.round(amountCents);
  return isZeroDecimalCurrency(currency) ? Math.round(cents / 100) : cents;
}

/** Montant reçu de Stripe → montant interne (×100) pour cette devise. */
export function fromStripeAmount(stripeAmount: number, currency: unknown): number {
  const amount = Math.round(stripeAmount);
  return isZeroDecimalCurrency(currency) ? amount * 100 : amount;
}

/** Compare deux devises après normalisation (« eur » === « EUR »). */
export function sameCurrency(a: unknown, b: unknown): boolean {
  return normalizeCurrency(a) === normalizeCurrency(b);
}
