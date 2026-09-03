import { LocalizedLabel, REVIEW_SCORE_MAX, REVIEW_SCORE_MIN, REVIEW_SCORE_STEP } from './index.js';

/**
 * Règles d'affichage partagées avec le backend (mu-review `scoring/score-format.ts`) :
 *  - note /5 : 1 décimale ; Performance Score /100 : entier ; évolution : % entier signé.
 * Webapp et mobile doivent passer par ces helpers pour que backend, email et écrans coïncident.
 */
export function formatRating5(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return (Math.round(value * 10) / 10).toFixed(1);
}

export function formatScore100(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return String(Math.round(value));
}

export function relativeChangePercent(current: number | null | undefined, previous: number | null | undefined): number | null {
  if (current === null || current === undefined || previous === null || previous === undefined) return null;
  if (!Number.isFinite(current) || !Number.isFinite(previous) || previous === 0) return null;
  return Math.round(((current - previous) / Math.abs(previous)) * 100);
}

/** Convertit une note /5 en pourcentage (0..100) pour les radars et cercles de score. */
export function ratingToPercent(value: number | null | undefined): number | null {
  if (value === null || value === undefined || !Number.isFinite(value)) return null;
  return Math.round(((value - REVIEW_SCORE_MIN) / (REVIEW_SCORE_MAX - REVIEW_SCORE_MIN)) * 100);
}

/** Arrondit une valeur continue (curseur, drag radar) sur l'échelle 1..5 par pas de 0,5. */
export function snapScore(value: number): number {
  const clamped = Math.min(REVIEW_SCORE_MAX, Math.max(REVIEW_SCORE_MIN, value));
  return Math.round(clamped / REVIEW_SCORE_STEP) * REVIEW_SCORE_STEP;
}

export function isValidScore(value: unknown): value is number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return false;
  if (value < REVIEW_SCORE_MIN || value > REVIEW_SCORE_MAX) return false;
  return Math.abs(value / REVIEW_SCORE_STEP - Math.round(value / REVIEW_SCORE_STEP)) < 1e-9;
}

export function pickLabel(labels: LocalizedLabel[] | undefined | null, locale = 'fr'): string {
  if (!labels?.length) return '';
  const short = locale.split('-')[0];
  return labels.find((l) => l.locale === locale)?.value ?? labels.find((l) => l.locale === short)?.value ?? labels.find((l) => l.locale === 'fr')?.value ?? labels[0].value;
}
