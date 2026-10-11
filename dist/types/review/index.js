/**
 * Types du domaine Review — Rapports de service, critères, threads, auto-évaluation, performance.
 * Miroir du schéma GraphQL de mu-review (subgraph `Review`). Source de vérité pour webapp et mobile.
 */
/** Échelle de notation : /5 par pas de 0,5 (le centre du radar = 1, l'extrémité = 5). */
export const REVIEW_SCORE_MIN = 1;
export const REVIEW_SCORE_MAX = 5;
export const REVIEW_SCORE_STEP = 0.5;
/** Récompense d'un rapport de service, en crédits IA (1 € = 657 crédits ; monorepo SMP `libs/shared/credits`). */
export const REVIEW_REWARD_CREDITS = 657;
