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
export const centsToEuros = (amountInCents) => {
    return amountInCents / 100;
};
/**
 * Convertit un montant en euros vers centimes pour le backend/Stripe
 */
export const eurosToCents = (amountInEuros) => {
    return Math.round(amountInEuros * 100);
};
/**
 * Formate un montant en centimes pour l'affichage en euros
 */
export const formatCentsToEuros = (amountInCents, currency = 'EUR') => {
    const euros = centsToEuros(amountInCents);
    const safeCurrency = currency ? currency.toUpperCase() : 'EUR';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(euros);
};
/**
 * Formate un montant en euros pour l'affichage
 */
export const formatEuros = (amountInEuros, currency = 'EUR') => {
    const safeCurrency = currency ? currency.toUpperCase() : 'EUR';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: safeCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amountInEuros);
};
/**
 * Formate un montant pour l'affichage (détecte automatiquement si c'est en centimes ou euros)
 */
export const formatAmount = (amount, currency = 'EUR', isInCents = true) => {
    if (isInCents) {
        return formatCentsToEuros(amount, currency);
    }
    else {
        return formatEuros(amount, currency);
    }
};
/**
 * Retourne le symbole de la devise (ex: 'EUR' -> '€', 'USD' -> '$', 'XOF' -> 'CFA')
 */
export const getCurrencySymbol = (currency = 'EUR') => {
    try {
        const safeCurrency = currency ? currency.toUpperCase() : 'EUR';
        const formatter = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: safeCurrency,
            minimumFractionDigits: 0,
        });
        const parts = formatter.formatToParts(0);
        const symbolPart = parts.find(p => p.type === 'currency');
        return symbolPart ? symbolPart.value : currency;
    }
    catch (e) {
        return currency; // Fallback sécuritaire
    }
};
/**
 * Valide qu'un montant est cohérent (pas de valeurs négatives, etc.)
 */
export const validateAmount = (amount) => {
    return amount >= 0 && !isNaN(amount) && isFinite(amount);
};
/**
 * Calcule le montant HT à partir du montant TTC et du taux de TVA
 */
export const calculateHTFromTTC = (amountTTC, vatRate = 20) => {
    return Math.round(amountTTC / (1 + vatRate / 100));
};
/**
 * Calcule le montant TTC à partir du montant HT et du taux de TVA
 */
export const calculateTTCFromHT = (amountHT, vatRate = 20) => {
    return Math.round(amountHT * (1 + vatRate / 100));
};
/**
 * Calcule la TVA à partir du montant HT et du taux de TVA
 */
export const calculateVAT = (amountHT, vatRate = 20) => {
    return Math.round(amountHT * (vatRate / 100));
};
/**
 * Liste des codes pays de l'Espace Économique Européen (EEE)
 */
const EEA_COUNTRIES = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'
];
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
export const calculateStripeFees = (amountInCents, countryCode = 'FR') => {
    const code = countryCode.toUpperCase();
    const stripeFixed = 25; // 0.25€
    let stripePercent = 0.015; // 1.5% par défaut (EEE)
    if (code === 'GB') {
        stripePercent = 0.025; // 2.5% pour UK
    }
    else if (!EEA_COUNTRIES.includes(code)) {
        stripePercent = 0.025;
    }
    const fees = Math.round(amountInCents * stripePercent) + stripeFixed;
    return fees;
};
/**
 * Calcule le montant Total à facturer pour obtenir un montant Net après frais Stripe
 * Formule "Gross-up" : Total = (Net + Fixed) / (1 - Rate)
 *
 * @param netAmountInCents Montant Net souhaité (ex: HT + TVA + Frais Plateforme)
 * @param countryCode Code pays pour déterminer le taux
 */
export const calculateTotalFromNet = (netAmountInCents, countryCode = 'FR') => {
    const code = countryCode.toUpperCase();
    const stripeFixed = 25; // 0.25€
    let stripePercent = 0.015; // 1.5% par défaut (EEE)
    if (code === 'GB') {
        stripePercent = 0.025; // 2.5% pour UK
    }
    else if (!EEA_COUNTRIES.includes(code)) {
        stripePercent = 0.025;
    }
    // Application formule Gross-up
    // T = (N + F) / (1 - P)
    const total = (netAmountInCents + stripeFixed) / (1 - stripePercent);
    return Math.round(total);
};
/**
 * Calcule les frais Stripe exacts à ajouter à un montant Net pour que le Total couvre ces frais
 */
export const calculateStripeFeeForNet = (netAmountInCents, countryCode = 'FR') => {
    const total = calculateTotalFromNet(netAmountInCents, countryCode);
    return total - netAmountInCents;
};
/**
 * Calcule le prix final TTC incluant la TVA, les frais de plateforme (8%) et les frais Stripe.
 * Utiliser pour l'affichage cohérent entre le PriceTag et le résumé de paiement.
 */
export const calculateFinalPrice = (priceInCents, vatPercent = 0) => {
    const vatAmount = Math.round(priceInCents * (vatPercent / 100));
    const platformFee = Math.round(priceInCents * 0.08);
    const intermediateTotal = priceInCents + vatAmount + platformFee;
    const stripeFee = calculateStripeFees(intermediateTotal, 'FR'); // Par défaut FR pour l'affichage général
    return intermediateTotal + stripeFee;
};
