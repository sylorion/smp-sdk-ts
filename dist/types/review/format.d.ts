import { LocalizedLabel } from './index.js';
/**
 * Règles d'affichage partagées avec le backend (mu-review `scoring/score-format.ts`) :
 *  - note /5 : 1 décimale ; Performance Score /100 : entier ; évolution : % entier signé.
 * Webapp et mobile doivent passer par ces helpers pour que backend, email et écrans coïncident.
 */
export declare function formatRating5(value: number | null | undefined): string;
export declare function formatScore100(value: number | null | undefined): string;
export declare function relativeChangePercent(current: number | null | undefined, previous: number | null | undefined): number | null;
/** Convertit une note /5 en pourcentage (0..100) pour les radars et cercles de score. */
export declare function ratingToPercent(value: number | null | undefined): number | null;
/** Arrondit une valeur continue (curseur, drag radar) sur l'échelle 1..5 par pas de 0,5. */
export declare function snapScore(value: number): number;
export declare function isValidScore(value: unknown): value is number;
export declare function pickLabel(labels: LocalizedLabel[] | undefined | null, locale?: string): string;
