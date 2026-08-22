/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/pricing/pricing.ts
   │  Régénérer        : ./scripts/sync-pricing.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-pricing.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

/* ────────────────────────────────────────────────────────────────────────────
 * SOURCE DE VÉRITÉ DU CALCUL DE PRIX DE LA PLATEFORME
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Ce fichier est LE seul endroit où l'on modifie le taux de commission, les
 * frais Stripe ou la composition du prix. Il est recopié à l'identique dans les
 * projets qui en ont besoin par `scripts/sync-pricing.sh`, parce que les images
 * Docker des microservices sont construites avec un contexte limité à leur
 * propre dossier (`docker-compose.yml` : `context: ./apps/back/api/<service>`)
 * et ne peuvent donc pas importer `libs/`.
 *
 * Après toute modification ici :  ./scripts/sync-pricing.sh
 * Contrôle de dérive (CI)      :  ./scripts/sync-pricing.sh --check
 *
 * ── Modèle économique ──────────────────────────────────────────────────────
 *
 * Le prestataire définit un prix HT et un taux de TVA (`legalVatPercent`).
 * La commission de la plateforme est AJOUTÉE AU-DESSUS et supportée par
 * l'acheteur — elle n'est pas prélevée sur le revenu du prestataire.
 *
 *     acheteur paie   = HT + TVA + commission plateforme (+ frais Stripe)
 *     prestataire reçoit = HT + TVA
 *     plateforme garde   = commission plateforme
 *
 * Les frais Stripe sont refacturés à l'acheteur sur les paiements one-shot,
 * mais absorbés par la plateforme sur les abonnements (`periodic`) : le prix
 * d'un abonnement est figé dans un Stripe Price à la création du service, et le
 * pays de la carte n'est pas connu à ce moment-là.
 *
 * ── Unités ─────────────────────────────────────────────────────────────────
 *
 * TOUS les montants sont des ENTIERS EN CENTIMES. Aucun flottant ne doit sortir
 * de ce module : chaque composante est arrondie individuellement, de sorte que
 * la somme des composantes est toujours exactement égale au total.
 * ──────────────────────────────────────────────────────────────────────────── */

/** Taux de commission de la plateforme, appliqué au prix HT. */
export const PLATFORM_FEE_RATE = 0.08;

/** Part fixe des frais Stripe, en centimes. */
export const STRIPE_FIXED_FEE_CENTS = 25;

/** Part variable des frais Stripe pour une carte émise dans l'EEE. */
export const STRIPE_RATE_EEA = 0.015;

/** Part variable des frais Stripe hors EEE (Royaume-Uni inclus). */
export const STRIPE_RATE_NON_EEA = 0.025;

/** Codes pays ISO-3166-1 alpha-2 de l'Espace Économique Européen. */
export const EEA_COUNTRIES: readonly string[] = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL',
  'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
];

/** Forme de souscription d'un service, telle que stockée sur le catalogue. */
export type UptakeForm =
  | 'periodic'
  | 'booking_required'
  | 'prestation'
  | 'spontaneous'
  | 'instant';

export interface PricingInput {
  /** Prix hors taxes défini par le prestataire, en centimes. */
  priceHTCents: number;
  /** Taux de TVA défini par le prestataire (ex. 20 pour 20 %). Défaut : 0. */
  vatPercent?: number;
  /**
   * Forme de souscription. Sert uniquement à déterminer si les frais Stripe
   * sont refacturés. Passer `isPeriodic` directement est équivalent.
   */
  uptakeForm?: UptakeForm | string | null;
  /** Force le traitement « abonnement ». Prioritaire sur `uptakeForm`. */
  isPeriodic?: boolean;
  /** Pays de la carte (ISO-3166-1 alpha-2). Défaut : 'FR'. */
  cardCountry?: string;
}

export interface PricingBreakdown {
  /** Prix hors taxes, en centimes. */
  priceHTCents: number;
  /** Taux de TVA appliqué (ex. 20). */
  vatPercent: number;
  /** Montant de TVA, en centimes. */
  vatCents: number;
  /** Commission de la plateforme, en centimes. */
  platformFeeCents: number;
  /** Frais Stripe refacturés à l'acheteur, en centimes (0 si abonnement). */
  stripeFeeCents: number;
  /** HT + TVA + commission : ce qui doit arriver sur le compte Stripe plateforme. */
  subtotalCents: number;
  /** Montant total débité à l'acheteur, en centimes. */
  totalCents: number;
  /** Ce qui revient au prestataire : HT + TVA, en centimes. */
  netSellerCents: number;
  /** Vrai si le calcul a suivi la règle « abonnement ». */
  isPeriodic: boolean;
}

/** Indique si une forme de souscription correspond à un abonnement récurrent. */
export function isPeriodicUptake(uptakeForm?: string | null): boolean {
  return typeof uptakeForm === 'string' && uptakeForm.trim().toLowerCase() === 'periodic';
}

/** Part variable des frais Stripe applicable au pays de la carte. */
export function stripeRateForCountry(cardCountry?: string | null): number {
  const code = (cardCountry || 'FR').toUpperCase();
  return EEA_COUNTRIES.includes(code) ? STRIPE_RATE_EEA : STRIPE_RATE_NON_EEA;
}

/**
 * Frais Stripe pour un montant donné, en centimes.
 *
 * @param amountCents Montant sur lequel Stripe prélève ses frais.
 * @param cardCountry Pays de la carte (ISO-3166-1 alpha-2).
 */
export function calculateStripeFees(amountCents: number, cardCountry: string = 'FR'): number {
  return Math.round(amountCents * stripeRateForCountry(cardCountry)) + STRIPE_FIXED_FEE_CENTS;
}

/** Commission de la plateforme sur un prix HT, en centimes. */
export function calculatePlatformFee(priceHTCents: number): number {
  return Math.round(priceHTCents * PLATFORM_FEE_RATE);
}

/** Montant de TVA sur un prix HT, en centimes. */
export function calculateVat(priceHTCents: number, vatPercent: number): number {
  return Math.round(priceHTCents * (vatPercent / 100));
}

function assertValidCents(value: number, label: string): void {
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < 0) {
    throw new RangeError(
      `${label} doit être un entier positif en centimes (reçu : ${String(value)})`,
    );
  }
}

/**
 * Décompose un prix HT en toutes ses composantes.
 *
 * C'est la fonction que doivent appeler le frontend (pour afficher le récap et
 * fixer le montant du PaymentIntent), mu-catalog (pour construire le Stripe
 * Price d'un abonnement) et mu-billing (pour ventiler les frais et bâtir les
 * factures). Toute divergence entre ces trois appelants est un bug.
 */
export function computePricing(input: PricingInput): PricingBreakdown {
  const priceHTCents = Math.round(input.priceHTCents ?? 0);
  assertValidCents(priceHTCents, 'priceHTCents');

  const vatPercent = Number.isFinite(input.vatPercent as number) ? (input.vatPercent as number) : 0;
  if (vatPercent < 0 || vatPercent > 100) {
    throw new RangeError(`vatPercent doit être compris entre 0 et 100 (reçu : ${vatPercent})`);
  }

  const isPeriodic = input.isPeriodic ?? isPeriodicUptake(input.uptakeForm);

  const vatCents = calculateVat(priceHTCents, vatPercent);
  const platformFeeCents = calculatePlatformFee(priceHTCents);
  const subtotalCents = priceHTCents + vatCents + platformFeeCents;
  // Pas de frais Stripe sur un abonnement (voir en-tête), ni sur un montant nul :
  // la part fixe de 0,25 € ne doit pas apparaître sur un panier vide.
  const stripeFeeCents =
    isPeriodic || subtotalCents === 0 ? 0 : calculateStripeFees(subtotalCents, input.cardCountry);

  return {
    priceHTCents,
    vatPercent,
    vatCents,
    platformFeeCents,
    stripeFeeCents,
    subtotalCents,
    totalCents: subtotalCents + stripeFeeCents,
    netSellerCents: priceHTCents + vatCents,
    isPeriodic,
  };
}

/**
 * Somme des prix HT d'un panier, puis décomposition.
 *
 * La commission et la TVA sont calculées sur le TOTAL HT, et non ligne par
 * ligne : arrondir chaque ligne séparément puis sommer donne un total qui peut
 * s'écarter de plusieurs centimes du montant réellement débité.
 */
export function computeCartPricing(
  lines: ReadonlyArray<{ unitPriceHTCents: number; quantity?: number }>,
  options: Omit<PricingInput, 'priceHTCents'> = {},
): PricingBreakdown {
  const priceHTCents = lines.reduce(
    (sum, line) => sum + Math.round(line.unitPriceHTCents) * (line.quantity ?? 1),
    0,
  );
  return computePricing({ ...options, priceHTCents });
}

/**
 * Reconstitue un prix HT à partir d'un montant total débité.
 *
 * Réservé à la réconciliation de données historiques créées avant l'unification
 * du calcul : les arrondis ne sont pas inversibles exactement, le résultat peut
 * s'écarter de quelques centimes. Ne jamais l'utiliser pour établir une facture
 * ou un mouvement de wallet — utiliser `computePricing` à partir du prix HT de
 * référence.
 */
export function estimateHTFromTotal(
  totalCents: number,
  options: { vatPercent?: number; isPeriodic?: boolean; cardCountry?: string } = {},
): number {
  const vatPercent = options.vatPercent ?? 0;
  const multiplier = 1 + vatPercent / 100 + PLATFORM_FEE_RATE;

  if (options.isPeriodic) {
    return Math.round(totalCents / multiplier);
  }

  const rate = stripeRateForCountry(options.cardCountry);
  const subtotal = (totalCents - STRIPE_FIXED_FEE_CENTS) / (1 + rate);
  return Math.round(subtotal / multiplier);
}
