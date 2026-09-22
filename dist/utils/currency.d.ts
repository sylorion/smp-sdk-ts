/**
 * Utilitaires pour la gestion des devises (SDK Centralisé)
 *
 * Convention :
 * - Backend : Montants stockés en centimes (1111 = 11,11€)
 * - Frontend : Affichage en euros avec conversion automatique
 * - Stripe : Montants en centimes
 */
/**
 * Convertit un montant en centimes vers euros pour l'affichage
 */
export declare const centsToEuros: (amountInCents: number) => number;
/**
 * Convertit un montant en euros vers centimes pour le backend/Stripe
 */
export declare const eurosToCents: (amountInEuros: number) => number;
/**
 * Formate un montant en centimes pour l'affichage en euros
 */
export declare const formatCentsToEuros: (amountInCents: number, currency?: string) => string;
/**
 * Formate un montant en euros pour l'affichage
 */
export declare const formatEuros: (amountInEuros: number, currency?: string) => string;
/**
 * Formate un montant pour l'affichage (détecte automatiquement si c'est en centimes ou euros)
 */
export declare const formatAmount: (amount: number, currency?: string, isInCents?: boolean) => string;
/**
 * Retourne le symbole de la devise (ex: 'EUR' -> '€', 'USD' -> '$', 'XOF' -> 'CFA')
 */
export declare const getCurrencySymbol: (currency?: string) => string;
/**
 * Valide qu'un montant est cohérent (pas de valeurs négatives, etc.)
 */
export declare const validateAmount: (amount: number) => boolean;
/**
 * Calcule le montant HT à partir du montant TTC et du taux de TVA
 */
export declare const calculateHTFromTTC: (amountTTC: number, vatRate?: number) => number;
/**
 * Calcule le montant TTC à partir du montant HT et du taux de TVA
 */
export declare const calculateTTCFromHT: (amountHT: number, vatRate?: number) => number;
/**
 * Calcule la TVA à partir du montant HT et du taux de TVA
 */
export declare const calculateVAT: (amountHT: number, vatRate?: number) => number;
/**
 * Calcule les frais Stripe estimés
 *
 * Tarification Stripe (approx) :
 * - Cartes standard EEE : 1.5% + 0.25€
 * - Cartes UK : 2.5% + 0.25€
 * - Cartes internationales : 2.5% + 0.25€ (souvent 3.25% hors Europe)
 *
 * @param amountInCents Montant de base en centimes
 * @param countryCode Code pays de la carte/client (ISO 2 lettres, ex: 'FR', 'GB')
 */
export declare const calculateStripeFees: (amountInCents: number, countryCode?: string) => number;
/**
 * Calcule le montant Total à facturer pour obtenir un montant Net après frais Stripe
 * Formule "Gross-up" : Total = (Net + Fixed) / (1 - Rate)
 *
 * @param netAmountInCents Montant Net souhaité (ex: HT + TVA + Frais Plateforme)
 * @param countryCode Code pays pour déterminer le taux
 */
export declare const calculateTotalFromNet: (netAmountInCents: number, countryCode?: string) => number;
/**
 * Calcule les frais Stripe exacts à ajouter à un montant Net pour que le Total couvre ces frais
 */
export declare const calculateStripeFeeForNet: (netAmountInCents: number, countryCode?: string) => number;
/**
 * Calcule le prix final TTC incluant la TVA, les frais de plateforme (8%) et les frais Stripe.
 * Utiliser pour l'affichage cohérent entre le PriceTag et le résumé de paiement.
 */
export declare const calculateFinalPrice: (priceInCents: number, vatPercent?: number) => number;
