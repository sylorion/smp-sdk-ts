/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/pricing/pricing.fixtures.ts
   │  Régénérer        : ./scripts/sync-pricing.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-pricing.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */
export const PRICING_CASES = [
    {
        label: "one-shot standard — 100 € HT, TVA 20 %, carte FR",
        input: { "priceHTCents": 10000, "vatPercent": 20, "cardCountry": "FR" },
        expected: { "vatCents": 2000, "platformFeeCents": 800, "subtotalCents": 12800, "stripeFeeCents": 217, "totalCents": 13017, "netSellerCents": 12000, "isPeriodic": false },
    },
    {
        label: "abonnement — mêmes bases, frais Stripe absorbés par la plateforme",
        input: { "priceHTCents": 10000, "vatPercent": 20, "uptakeForm": "periodic" },
        expected: { "vatCents": 2000, "platformFeeCents": 800, "subtotalCents": 12800, "stripeFeeCents": 0, "totalCents": 12800, "netSellerCents": 12000, "isPeriodic": true },
    },
    {
        label: "TVA à 0 % — prestataire non assujetti",
        input: { "priceHTCents": 10000, "vatPercent": 0, "cardCountry": "FR" },
        expected: { "vatCents": 0, "platformFeeCents": 800, "subtotalCents": 10800, "stripeFeeCents": 187, "totalCents": 10987, "netSellerCents": 10000, "isPeriodic": false },
    },
    {
        label: "TVA dynamique à 5,5 % — taux réduit",
        input: { "priceHTCents": 10000, "vatPercent": 5.5, "cardCountry": "FR" },
        expected: { "vatCents": 550, "platformFeeCents": 800, "subtotalCents": 11350, "stripeFeeCents": 195, "totalCents": 11545, "netSellerCents": 10550, "isPeriodic": false },
    },
    {
        label: "carte britannique — taux Stripe hors EEE",
        input: { "priceHTCents": 10000, "vatPercent": 20, "cardCountry": "GB" },
        expected: { "vatCents": 2000, "platformFeeCents": 800, "subtotalCents": 12800, "stripeFeeCents": 345, "totalCents": 13145, "netSellerCents": 12000, "isPeriodic": false },
    },
    {
        label: "carte hors EEE (US)",
        input: { "priceHTCents": 10000, "vatPercent": 20, "cardCountry": "US" },
        expected: { "vatCents": 2000, "platformFeeCents": 800, "subtotalCents": 12800, "stripeFeeCents": 345, "totalCents": 13145, "netSellerCents": 12000, "isPeriodic": false },
    },
    {
        label: "petit montant — 1 € HT, vérifie les arrondis",
        input: { "priceHTCents": 100, "vatPercent": 20, "cardCountry": "FR" },
        expected: { "vatCents": 20, "platformFeeCents": 8, "subtotalCents": 128, "stripeFeeCents": 27, "totalCents": 155, "netSellerCents": 120, "isPeriodic": false },
    },
    {
        label: "montant impair — vérifie que la somme des composantes fait le total",
        input: { "priceHTCents": 3333, "vatPercent": 20, "cardCountry": "FR" },
        expected: { "vatCents": 667, "platformFeeCents": 267, "subtotalCents": 4267, "stripeFeeCents": 89, "totalCents": 4356, "netSellerCents": 4000, "isPeriodic": false },
    },
    {
        label: "panier vide — aucun frais fixe Stripe",
        input: { "priceHTCents": 0, "vatPercent": 20, "cardCountry": "FR" },
        expected: { "vatCents": 0, "platformFeeCents": 0, "subtotalCents": 0, "stripeFeeCents": 0, "totalCents": 0, "netSellerCents": 0, "isPeriodic": false },
    },
];
