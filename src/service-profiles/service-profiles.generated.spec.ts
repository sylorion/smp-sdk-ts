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
  allowedSteps, compatibleProfiles, deriveServiceProfile, invalidProfileAttributes, kindFromEnums, missingProfileAttributes,
} from './service-profiles.generated';

describe('catalogue des profils', () => {
  it('31 profils, codes uniques, repli présent, enums valides, attributs ≤ 32 car. et uniques', () => {
    expect(SERVICE_PROFILES).toHaveLength(31);
    expect(new Set(SERVICE_PROFILES.map((x) => x.code)).size).toBe(31);
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
    const unique = deriveServiceProfile({ uptakeForm: 'prestation', billingPlan: 'mensual', supplyType: 'irl' });
    expect(unique.candidates.map((c) => c.code)).toEqual(['property_lease']);
    expect(unique).toMatchObject({ declared: false, ambiguous: false, kind: 'rental' });
    expect(unique.profile.code).toBe('property_lease');
    // Un profil unique prime sur la nature déduite des enums seuls (instant + jour = location, mais en ligne : régie freelance)
    const precedence = deriveServiceProfile({ uptakeForm: 'instant', billingPlan: 'dayly', supplyType: 'online' });
    expect(precedence.profile.code).toBe('freelance_time');
    expect(precedence.kind).toBe('one_off');

    const several = deriveServiceProfile({ uptakeForm: 'booking_required', billingPlan: 'dayly', supplyType: 'irl' });
    expect(several.candidates.length).toBeGreaterThan(1);
    expect(several.profile.code).toBe('generic_service');
    expect(several).toMatchObject({ kind: 'rental', ambiguous: true, declared: false });

    const none = deriveServiceProfile({ uptakeForm: 'instant', billingPlan: 'annual', supplyType: 'irl' });
    expect(none.candidates).toEqual([]);
    expect(none).toMatchObject({ ambiguous: false, kind: 'one_off' });
    expect(none.profile.code).toBe('generic_service');
    expect(deriveServiceProfile(null).profile.code).toBe('generic_service');
  });

  it('profile_code déclaré : retenu s’il est compatible avec la modalité, ignoré sinon', () => {
    const ok = deriveServiceProfile({ uptakeForm: 'booking_required', billingPlan: 'dayly', supplyType: 'irl', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'vehicle_rental' } });
    expect(ok.profile.code).toBe('vehicle_rental');
    expect(ok).toMatchObject({ declared: true, kind: 'rental', ambiguous: false });
    const ko = deriveServiceProfile({ uptakeForm: 'periodic', billingPlan: 'mensual', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'vehicle_rental' } });
    expect(ko.declared).toBe(false);
    expect(ko.kind).toBe('subscription');
    expect(deriveServiceProfile({ uptakeForm: 'instant', attributes: { [PROFILE_CODE_ATTRIBUTE]: 'inconnu' } }).declared).toBe(false);
  });

  it('candidats : filtrés par chaque enum renseigné, jamais le repli', () => {
    expect(compatibleProfiles({ uptakeForm: 'periodic', billingPlan: 'annual' }).map((c) => c.code).sort()).toEqual(['digital_subscription', 'managed_service']);
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
