/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/currency/currency.spec.ts
   │  Régénérer        : ./scripts/sync-currency.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-currency.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

import {
  DEFAULT_CURRENCY,
  fromStripeAmount,
  isSupportedCurrency,
  isZeroDecimalCurrency,
  normalizeCurrency,
  sameCurrency,
  toStripeAmount,
  toStripeCurrency,
} from './currency.generated';

describe('devise partagée', () => {
  it('normalise les valeurs de l\'enum organisation en ISO majuscule', () => {
    expect(normalizeCurrency('eur')).toBe('EUR');
    expect(normalizeCurrency('usd')).toBe('USD');
    expect(normalizeCurrency(' chf ')).toBe('CHF');
    expect(normalizeCurrency('XOF')).toBe('XOF');
  });

  it('traite credit, unknw, vide et inconnu comme la devise par défaut', () => {
    for (const v of ['credit', 'unknw', '', null, undefined, 'JPY', 42]) {
      expect(normalizeCurrency(v)).toBe(DEFAULT_CURRENCY);
    }
    expect(normalizeCurrency('credit', 'USD')).toBe('USD');
  });

  it('distingue une devise supportée d\'une valeur à rejeter', () => {
    expect(isSupportedCurrency('gbp')).toBe(true);
    expect(isSupportedCurrency('credit')).toBe(false);
    expect(isSupportedCurrency(undefined)).toBe(false);
  });

  it('formate pour Stripe en minuscules', () => {
    expect(toStripeCurrency('USD')).toBe('usd');
    expect(toStripeCurrency('unknw')).toBe('eur');
  });

  it('convertit les montants des devises sans décimale à la frontière Stripe', () => {
    expect(isZeroDecimalCurrency('xof')).toBe(true);
    expect(isZeroDecimalCurrency('EUR')).toBe(false);
    // 1 500 XOF stockés ×100
    expect(toStripeAmount(150000, 'XOF')).toBe(1500);
    expect(fromStripeAmount(1500, 'xof')).toBe(150000);
    // devise décimale : inchangé
    expect(toStripeAmount(12345, 'USD')).toBe(12345);
    expect(fromStripeAmount(12345, 'usd')).toBe(12345);
    // arrondi à l'unité pour XAF
    expect(toStripeAmount(150049, 'XAF')).toBe(1500);
    expect(toStripeAmount(150050, 'XAF')).toBe(1501);
  });

  it('compare deux devises sans tenir compte de la casse', () => {
    expect(sameCurrency('eur', 'EUR')).toBe(true);
    expect(sameCurrency('usd', 'EUR')).toBe(false);
  });
});
