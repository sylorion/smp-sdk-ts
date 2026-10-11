/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/service-profiles/service-profiles.spec.ts
   │  Régénérer        : ./scripts/sync-service-profiles.sh                   │
   │  Vérifier (CI)    : ./scripts/sync-service-profiles.sh --check           │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

// Catalogue des profils métier : cohérence du catalogue, dérivation, validation des attributs.
import {
  BILLING_PLANS, PROFILE_BY_CODE, PROFILE_CODE_ATTRIBUTE, SERVICE_KINDS, SERVICE_PROFILES, SUPPLY_TYPES, UPTAKE_FORMS,
  BILLING_PLANS_BY_UPTAKE, SERVICE_COMBINATIONS,
  allowedSteps, billingPlansForUptake, checkServiceCombination, compatibleProfiles, deriveServiceProfile, invalidProfileAttributes,
  closestCombination, isServiceCombination, kindFromEnums, missingProfileAttributes, profileChoices,
} from './service-profiles.generated';
import type { ServiceCombination } from './service-profiles.generated';

describe('catalogue des profils', () => {
  it('32 profils, codes uniques, repli présent, enums valides, attributs ≤ 32 car. et uniques', () => {
    expect(SERVICE_PROFILES).toHaveLength(32);
    expect(new Set(SERVICE_PROFILES.map((x) => x.code)).size).toBe(32);
    expect(PROFILE_BY_CODE.generic_service.family).toBe('fallback');
    for (const x of SERVICE_PROFILES) {
      expect(x.uptakeForms.length).toBeGreaterThan(0);
      for (const u of x.uptakeForms) expect(UPTAKE_FORMS).toContain(u);
      for (const b of x.billingPlans) expect(BILLING_PLANS).toContain(b);
      for (const s of x.supplyTypes) expect(SUPPLY_TYPES).toContain(s);
      expect(SERVICE_KINDS).toContain(x.kind);
      const keys = x.attributes.map((a) => a.key);
      expect(new Set(keys).size).toBe(keys.length);
      for (const k of keys) { expect(k.length).toBeLessThanOrEqual(32); expect(k).toMatch(/^[a-z][a-z0-9_]*$/); }
      for (const a of x.attributes) if (a.type === 'select') expect(a.options?.length).toBeGreaterThan(0);
    }
  });

  it('les locations ont état des lieux + caution ; les abonnements n’ont rien après paiement ; les prestations sur devis n’ont pas de flow', () => {
    for (const code of ['vehicle_rental', 'equipment_rental', 'space_rental', 'property_lease', 'accommodation_stay']) {
      expect(PROFILE_BY_CODE[code].kind).toBe('rental');
      expect(PROFILE_BY_CODE[code].stepsAfterPayment).toEqual(['inspection', 'deposit', 'closure']);
      expect(PROFILE_BY_CODE[code].attributes.some((a) => a.key === 'deposit_amount')).toBe(true);
    }
    expect(PROFILE_BY_CODE.digital_subscription.stepsAfterPayment).toEqual([]);
    expect(allowedSteps(PROFILE_BY_CODE.software_project)).toEqual([]);
    expect(allowedSteps(PROFILE_BY_CODE.vehicle_rental)).toContain('inspection');
  });

  it('un profil ne stocke aucune option : seulement des suggestions nommées', () => {
    const v = PROFILE_BY_CODE.vehicle_rental;
    expect(v.suggestedOptions.map((o) => o.key)).toEqual(expect.arrayContaining(['snow_tires', 'snow_chains', 'extra_km']));
    for (const o of v.suggestedOptions) expect(Object.keys(o).sort()).toEqual(['key', 'label']);
    expect(v.attributes.map((a) => a.key)).not.toContain('currency');
    expect(v.attributes.map((a) => a.key)).not.toContain('rate_day');
  });
});

describe('dérivation', () => {
  it('nature depuis les enums : réservation + jour = location, périodique + mensuel = abonnement…', () => {
    expect(kindFromEnums('booking_required', 'dayly')).toBe('rental');
    expect(kindFromEnums('instant', 'dayly')).toBe('rental');
    expect(kindFromEnums('booking_required', 'hourly')).toBe('appointment');
    expect(kindFromEnums('instant', 'direct')).toBe('one_off');
    expect(kindFromEnums('periodic', 'mensual')).toBe('subscription');
    expect(kindFromEnums('periodic', 'hourly')).toBe('recurring_service');
    expect(kindFromEnums('prestation', 'direct')).toBe('quoted_mission');
    expect(kindFromEnums('bizarre', null)).toBeNull();
  });

  it('profil unique → retenu ; plusieurs → repli de la nature, ambigu ; aucun → repli non ambigu', () => {
    const unique = deriveServiceProfile({ uptakeForm: 'prestation', billingPlan: 'dayly', supplyType: 'irl' });
    expect(unique.candidates.map((c) => c.code)).toEqual(['subcontracting']);
    expect(unique).toMatchObject({ declared: false, ambiguous: false, kind: 'quoted_mission', combinationIssue: null });
    expect(unique.profile.code).toBe('subcontracting');
    // Un profil unique prime sur la nature déduite des enums seuls (réservation + jour = location, mais en ligne : formation à la journée)
    const precedence = deriveServiceProfile({ uptakeForm: 'booking_required', billingPlan: 'dayly', supplyType: 'online' });
    expect(precedence.profile.code).toBe('training_session');
    expect(precedence.kind).toBe('appointment');

    const several = deriveServiceProfile({ uptakeForm: 'booking_required', billingPlan: 'dayly', supplyType: 'irl' });
    expect(several.candidates.length).toBeGreaterThan(1);
    expect(several.profile.code).toBe('generic_service');
    expect(several).toMatchObject({ kind: 'rental', ambiguous: true, declared: false });

    // Combinaison non exécutable : aucun candidat, repli, et l'anomalie est remontée
    const none = deriveServiceProfile({ uptakeForm: 'instant', billingPlan: 'annual', supplyType: 'irl' });
    expect(none.candidates).toEqual([]);
    expect(none).toMatchObject({ ambiguous: false, kind: 'one_off' });
    expect(none.profile.code).toBe('generic_service');
    expect(none.combinationIssue).toMatchObject({ code: 'BILLING_PLAN_INCOMPATIBLE', field: 'billingPlan' });
    expect(deriveServiceProfile(null).profile.code).toBe('generic_service');
  });

  it('profile_code déclaré : retenu s’il est compatible avec la modalité, ignoré sinon', () => {
    const ok = deriveServiceProfile({ uptakeForm: 'booking_required', billingPlan: 'dayly', supplyType: 'irl', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'vehicle_rental' } });
    expect(ok.profile.code).toBe('vehicle_rental');
    expect(ok).toMatchObject({ declared: true, kind: 'rental', ambiguous: false });
    const ko = deriveServiceProfile({ uptakeForm: 'periodic', billingPlan: 'mensual', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'vehicle_rental' } });
    expect(ko.declared).toBe(false);
    expect(ko.kind).toBe('subscription');
    // Déclaré mais incompatible avec le canal : ignoré (le profil doit accepter TOUS les réglages)
    const wrongChannel = deriveServiceProfile({ uptakeForm: 'booking_required', billingPlan: 'dayly', supplyType: 'online', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'vehicle_rental' } });
    expect(wrongChannel.declared).toBe(false);
    expect(deriveServiceProfile({ uptakeForm: 'instant', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'inconnu' } }).declared).toBe(false);
  });

  it('candidats : filtrés par chaque enum renseigné, jamais le repli', () => {
    expect(compatibleProfiles({ uptakeForm: 'periodic', billingPlan: 'annual' }).map((c) => c.code).sort()).toEqual(['digital_subscription', 'managed_service', 'onsite_subscription']);
    expect(compatibleProfiles({ uptakeForm: 'periodic', billingPlan: 'annual', supplyType: 'online' }).map((c) => c.code).sort()).toEqual(['digital_subscription', 'managed_service']);
    expect(compatibleProfiles({}).map((c) => c.code)).not.toContain('generic_service');
  });
});

describe('attributs', () => {
  const v = PROFILE_BY_CODE.vehicle_rental;
  it('manquants : les obligatoires vides ; invalides : montant non entier, option inconnue, texte trop long', () => {
    expect(missingProfileAttributes(v, { vehicle_brand: 'Peugeot', vehicle_model: ' ', vehicle_plate: 'AB-123-CD' })).toEqual(['vehicle_model', 'deposit_amount']);
    expect(missingProfileAttributes(v, null)).toEqual(['vehicle_brand', 'vehicle_model', 'vehicle_plate', 'deposit_amount']);
    expect(invalidProfileAttributes(v, { deposit_amount: '12.5', mileage_included: '200', fuel_policy: 'half', vehicle_year: 'x'.repeat(256) })).toEqual(['vehicle_year', 'fuel_policy', 'deposit_amount']);
    expect(invalidProfileAttributes(v, { deposit_amount: '50000', fuel_policy: 'full_to_full' })).toEqual([]);
  });
});

describe('cohérence des combinaisons (verrou de ce que la plateforme exécute)', () => {
  const all: Array<{ uptakeForm: string; billingPlan: string; supplyType: string }> = [];
  for (const u of UPTAKE_FORMS) for (const b of BILLING_PLANS) for (const sp of SUPPLY_TYPES) all.push({ uptakeForm: u, billingPlan: b, supplyType: sp });

  it('132 combinaisons possibles, 57 exécutables (figées), 75 verrouillées', () => {
    expect(all).toHaveLength(132);
    expect(SERVICE_COMBINATIONS).toHaveLength(57);
    expect(all.filter((c) => checkServiceCombination(c) !== null)).toHaveLength(75);
    expect(all.filter((c) => isServiceCombination(c))).toHaveLength(57);
  });

  it('toute combinaison exécutable a au moins un profil métier (jamais de repli silencieux)', () => {
    for (const c of SERVICE_COMBINATIONS) {
      expect(checkServiceCombination(c)).toBeNull();
      expect(compatibleProfiles(c).length).toBeGreaterThan(0);
      expect(deriveServiceProfile({ ...c }).combinationIssue).toBeNull();
    }
  });

  it('toute combinaison verrouillée nomme le réglage à changer et les facturations acceptées', () => {
    for (const c of all.filter((x) => !isServiceCombination(x))) {
      const issue = checkServiceCombination(c);
      expect(issue).toMatchObject({ code: 'BILLING_PLAN_INCOMPATIBLE', field: 'billingPlan' });
      expect(issue!.allowedBillingPlans).toEqual(BILLING_PLANS_BY_UPTAKE[c.uptakeForm as keyof typeof BILLING_PLANS_BY_UPTAKE]);
      expect(compatibleProfiles(c)).toEqual([]);
    }
  });

  it('règles : périodique = abonnement, mixte / usage seulement sur devis, minute seulement sur réservation', () => {
    expect(billingPlansForUptake('periodic')).toEqual(['mensual', 'trimestrial', 'semestrial', 'annual']);
    expect(checkServiceCombination({ uptakeForm: 'instant', billingPlan: 'mixed', supplyType: 'mixed' })?.code).toBe('BILLING_PLAN_INCOMPATIBLE');
    expect(checkServiceCombination({ uptakeForm: 'periodic', billingPlan: 'direct' })?.code).toBe('BILLING_PLAN_INCOMPATIBLE');
    expect(checkServiceCombination({ uptakeForm: 'instant', billingPlan: 'minute' })?.code).toBe('BILLING_PLAN_INCOMPATIBLE');
    expect(checkServiceCombination({ uptakeForm: 'prestation', billingPlan: 'mixed', supplyType: 'online' })).toBeNull();
    expect(checkServiceCombination({ uptakeForm: 'booking_required', billingPlan: 'minute', supplyType: 'online' })).toBeNull();
  });

  it('valeurs inconnues ou absentes', () => {
    expect(checkServiceCombination({ uptakeForm: 'bizarre' })?.code).toBe('UPTAKE_FORM_UNKNOWN');
    expect(checkServiceCombination({ uptakeForm: 'instant', billingPlan: 'weekly' })?.code).toBe('BILLING_PLAN_UNKNOWN');
    expect(checkServiceCombination({ uptakeForm: 'instant', billingPlan: 'direct', supplyType: 'mars' })?.code).toBe('SUPPLY_TYPE_UNKNOWN');
    expect(checkServiceCombination({})).toBeNull();
    expect(checkServiceCombination(null)).toBeNull();
    expect(isServiceCombination({ uptakeForm: 'instant', billingPlan: 'direct' })).toBe(false);
    expect(isServiceCombination(null)).toBe(false);
  });

  it('choix guidés par le profil : seules les valeurs exécutables sont proposées', () => {
    // Accompagnement : réservation à la séance OU forfait mensuel, jamais « réservation au mois »
    expect(profileChoices(PROFILE_BY_CODE.coaching_program, 'booking_required').billingPlans).toEqual(['unit']);
    expect(profileChoices(PROFILE_BY_CODE.coaching_program, 'periodic').billingPlans).toEqual(['mensual']);
    // Ménage à domicile : plus de « périodique » à l'heure (non exécutable) → la modalité disparaît
    expect(profileChoices(PROFILE_BY_CODE.home_service).uptakeForms).toEqual(['instant', 'booking_required']);
    expect(profileChoices(PROFILE_BY_CODE.vehicle_rental).supplyTypes).toEqual(['irl']);
  });

  it('combinaison la plus proche pour un profil : réglages compatibles conservés, les autres remplacés', () => {
    expect(closestCombination(PROFILE_BY_CODE.vehicle_rental, { uptakeForm: 'instant', billingPlan: 'direct', supplyType: 'mixed' })).toEqual({ uptakeForm: 'instant', billingPlan: 'dayly', supplyType: 'irl' });
    expect(closestCombination(PROFILE_BY_CODE.digital_subscription, null)).toEqual({ uptakeForm: 'periodic', billingPlan: 'mensual', supplyType: 'online' });
    for (const x of SERVICE_PROFILES) expect(isServiceCombination(closestCombination(x, { uptakeForm: 'instant', billingPlan: 'mixed', supplyType: 'mixed' }))).toBe(true);
  });

  it('message lisible : libellés, pas de codes', () => {
    expect(checkServiceCombination({ uptakeForm: 'instant', billingPlan: 'mixed' })!.message).toBe("La facturation « Mixte » n'est pas exécutable pour un service « Instantané » : choisissez parmi Prix fixe, À l'unité, À l'heure, À la journée.");
  });

  it('typage : une combinaison non exécutable ne compile pas', () => {
    const ok: ServiceCombination = { uptakeForm: 'periodic', billingPlan: 'semestrial', supplyType: 'irl' };
    // @ts-expect-error — instantané facturé au mois : refusé par le type
    const ko: ServiceCombination = { uptakeForm: 'instant', billingPlan: 'mensual', supplyType: 'irl' };
    // @ts-expect-error — mixte hors devis : refusé par le type
    const ko2: ServiceCombination = { uptakeForm: 'booking_required', billingPlan: 'mixed', supplyType: 'online' };
    expect(isServiceCombination(ok)).toBe(true);
    expect(isServiceCombination(ko)).toBe(false);
    expect(isServiceCombination(ko2)).toBe(false);
  });
});
