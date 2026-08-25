import { readFileSync } from 'fs';
import { join } from 'path';
import { PLAN_MATRIX, PlanAction, PlanTier, UNLIMITED, canPerformAction, resolvePlanTier } from './plan-matrix';

/**
 * Alignement du SDK avec le contrat partagé de la matrice de plans.
 *
 * Le contrat est diffusé par `scripts/sync-plan-matrix.sh` du monorepo vers
 * mu-authentication (autorité d'enforcement) ET vers ce SDK (représentation
 * frontend). Les deux côtés exécutent le même contrôle : si un quota, une
 * action ou une feature existe d'un seul côté, la CI du côté qui a dérivé
 * échoue.
 *
 * Le SDK ne constitue jamais une sécurité — le backend décide. Mais un SDK
 * désaligné produit une UX qui ment : boutons désactivés à tort, ou modale
 * absente là où le backend refusera.
 */
const contrat = JSON.parse(
  readFileSync(join(__dirname, 'plan-matrix.contract.json'), 'utf8'),
) as {
  unlimited: number;
  tiers: string[];
  actions: string[];
  actionToKey: Record<string, string>;
  legacyAliases: Record<string, string>;
  matrix: Record<string, Record<string, number | boolean>>;
};

describe('SDK — alignement avec le contrat de matrice', () => {
  it('déclare exactement les mêmes paliers', () => {
    expect(Object.values(PlanTier).sort()).toEqual([...contrat.tiers].sort());
  });

  it('utilise la même valeur pour « illimité »', () => {
    expect(UNLIMITED).toBe(contrat.unlimited);
  });

  it('déclare exactement les mêmes actions — ni plus, ni moins', () => {
    expect(Object.values(PlanAction).sort()).toEqual([...contrat.actions].sort());
  });

  it.each(['standard', 'starter', 'pro', 'business'])(
    'a exactement les mêmes valeurs pour le plan %s',
    (tier) => {
      expect(PLAN_MATRIX[tier as PlanTier]).toEqual(contrat.matrix[tier]);
    },
  );

  it('applique les mêmes alias de plans legacy', () => {
    for (const [legacy, cible] of Object.entries(contrat.legacyAliases)) {
      expect(resolvePlanTier(legacy)).toBe(cible);
    }
  });
});

describe('SDK — décisions cohérentes avec le backend', () => {
  it('refuse la vente par abonnement en Standard', () => {
    // Régression : USE_SERVICE_SUBSCRIPTIONS manquait de PlanAction, donc
    // canPerformAction tombait en « action inconnue » et renvoyait allowed:true.
    const d = canPerformAction('standard', PlanAction.USE_SERVICE_SUBSCRIPTIONS);
    expect(d.allowed).toBe(false);
    expect(d.upgradeToTier).toBe(PlanTier.PRO);
  });

  it('autorise la vente par abonnement en Pro et Business', () => {
    expect(canPerformAction('pro', PlanAction.USE_SERVICE_SUBSCRIPTIONS).allowed).toBe(true);
    expect(canPerformAction('business', PlanAction.USE_SERVICE_SUBSCRIPTIONS).allowed).toBe(true);
  });

  it('refuse une action inconnue au lieu de l’autoriser', () => {
    expect(canPerformAction('business', 'ACTION_QUI_N_EXISTE_PAS').allowed).toBe(false);
  });

  it('applique les quotas Standard', () => {
    expect(canPerformAction('standard', PlanAction.CREATE_SERVICE, 0).allowed).toBe(true);
    expect(canPerformAction('standard', PlanAction.CREATE_SERVICE, 1).allowed).toBe(false);
    expect(canPerformAction('standard', PlanAction.CREATE_ESTIMATE, 1).allowed).toBe(true);
    expect(canPerformAction('standard', PlanAction.CREATE_ESTIMATE, 2).allowed).toBe(false);
    expect(canPerformAction('standard', PlanAction.CREATE_INVOICE, 1).allowed).toBe(false);
    // Le propriétaire seul remplit le quota : aucun membre invitable.
    expect(canPerformAction('standard', PlanAction.ADD_MEMBER, 1).allowed).toBe(false);
  });
});
