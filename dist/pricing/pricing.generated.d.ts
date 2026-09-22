/** Taux de commission de la plateforme, appliqué au prix HT. */
export declare const PLATFORM_FEE_RATE = 0.08;
/** Part fixe des frais Stripe, en centimes. */
export declare const STRIPE_FIXED_FEE_CENTS = 25;
/** Part variable des frais Stripe pour une carte émise dans l'EEE. */
export declare const STRIPE_RATE_EEA = 0.015;
/** Part variable des frais Stripe hors EEE (Royaume-Uni inclus). */
export declare const STRIPE_RATE_NON_EEA = 0.025;
/** Codes pays ISO-3166-1 alpha-2 de l'Espace Économique Européen. */
export declare const EEA_COUNTRIES: readonly string[];
/** Forme de souscription d'un service, telle que stockée sur le catalogue. */
export type UptakeForm = 'periodic' | 'booking_required' | 'prestation' | 'spontaneous' | 'instant';
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
export declare function isPeriodicUptake(uptakeForm?: string | null): boolean;
/** Part variable des frais Stripe applicable au pays de la carte. */
export declare function stripeRateForCountry(cardCountry?: string | null): number;
/**
 * Frais Stripe pour un montant donné, en centimes.
 *
 * @param amountCents Montant sur lequel Stripe prélève ses frais.
 * @param cardCountry Pays de la carte (ISO-3166-1 alpha-2).
 */
export declare function calculateStripeFees(amountCents: number, cardCountry?: string): number;
/** Commission de la plateforme sur un prix HT, en centimes. */
export declare function calculatePlatformFee(priceHTCents: number): number;
/** Montant de TVA sur un prix HT, en centimes. */
export declare function calculateVat(priceHTCents: number, vatPercent: number): number;
/**
 * Décompose un prix HT en toutes ses composantes.
 *
 * C'est la fonction que doivent appeler le frontend (pour afficher le récap et
 * fixer le montant du PaymentIntent), mu-catalog (pour construire le Stripe
 * Price d'un abonnement) et mu-billing (pour ventiler les frais et bâtir les
 * factures). Toute divergence entre ces trois appelants est un bug.
 */
export declare function computePricing(input: PricingInput): PricingBreakdown;
/**
 * Somme des prix HT d'un panier, puis décomposition.
 *
 * La commission et la TVA sont calculées sur le TOTAL HT, et non ligne par
 * ligne : arrondir chaque ligne séparément puis sommer donne un total qui peut
 * s'écarter de plusieurs centimes du montant réellement débité.
 */
export declare function computeCartPricing(lines: ReadonlyArray<{
    unitPriceHTCents: number;
    quantity?: number;
}>, options?: Omit<PricingInput, 'priceHTCents'>): PricingBreakdown;
/**
 * Reconstitue un prix HT à partir d'un montant total débité.
 *
 * Réservé à la réconciliation de données historiques créées avant l'unification
 * du calcul : les arrondis ne sont pas inversibles exactement, le résultat peut
 * s'écarter de quelques centimes. Ne jamais l'utiliser pour établir une facture
 * ou un mouvement de wallet — utiliser `computePricing` à partir du prix HT de
 * référence.
 */
export declare function estimateHTFromTotal(totalCents: number, options?: {
    vatPercent?: number;
    isPeriodic?: boolean;
    cardCountry?: string;
}): number;
