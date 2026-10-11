/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/contract-fields/contract-fields.spec.ts
   │  Régénérer        : ./scripts/sync-contract-fields.sh                   │
   │  Vérifier (CI)    : ./scripts/sync-contract-fields.sh --check           │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

// Champs dynamiques des contrats : liaisons, cohérence d'un modèle, validation des valeurs,
// contrôles croisés, fusion des saisies (qui peut écrire quoi), données sensibles.
import {
  bindingOf, canonicalValues, clientMayEdit, completeVariableDefs, crossCheck, extractVariableKeys, filledBy, inferBinding, isIsoDate,
  mergeFieldValues, providerMayEdit, redactSensitive, sourceInfo, validateFieldValue, validateTemplateBindings, type FieldBinding,
} from './contract-fields.generated';

const rental = {
  lessor_name: { label: 'Loueur', type: 'text', required: true, binding: { block: 'organization', sources: ['organization.legalName'], format: 'text' } },
  vehicle_plate: { label: 'Plaque', type: 'text', required: true, binding: { block: 'service', sources: ['service.attributes.vehicle_plate'], format: 'text' } },
  daily_rate: { label: 'Tarif', type: 'number', required: true, binding: { block: 'service', sources: ['transaction.pricing.unitRate', 'service.attributes.rate_day'], format: 'money', role: 'unit_rate' } },
  rental_days: { label: 'Jours', type: 'number', required: false, binding: { block: 'service', sources: ['transaction.pricing.units'], format: 'integer', role: 'units' } },
  rental_price: { label: 'Total', type: 'number', required: false, binding: { block: 'service', sources: ['transaction.pricing.total'], format: 'money', role: 'total' } },
  start_date: { label: 'Début', type: 'date', required: true, binding: { block: 'client', sources: ['transaction.booking.startDate'], format: 'date', role: 'period_start' } },
  end_date: { label: 'Fin', type: 'date', required: true, binding: { block: 'client', format: 'date', role: 'period_end' } },
  renter_name: { label: 'Locataire', type: 'text', required: true, binding: { block: 'client', sources: ['client.name'], format: 'text' } },
  renter_license_number: { label: 'Permis', type: 'text', required: true, binding: { block: 'client', format: 'text', sensitive: true } },
  insurance_type: { label: 'Assurance', type: 'select', required: true, options: ['Tiers', 'Tous risques'], default: 'Tous risques', binding: { block: 'provider', format: 'select' } },
  contract_date: { label: 'Date', type: 'date', required: true, binding: { block: 'contract', sources: ['contract.date'], format: 'date' } },
};

describe('liaisons', () => {
  it('bindingOf : normalise, verrouille par défaut hors client, reprend les options du modèle, ignore une liaison sans bloc valide', () => {
    expect(bindingOf(rental.lessor_name)).toMatchObject({ block: 'organization', locked: true });
    expect(bindingOf(rental.renter_name)).toMatchObject({ block: 'client', locked: false, sources: ['client.name'] });
    expect(bindingOf(rental.insurance_type)?.options).toEqual(['Tiers', 'Tous risques']);
    expect(bindingOf({ binding: { block: 'nope' } })).toBeNull();
    expect(bindingOf({ label: 'x' })).toBeNull();
  });

  it('qui saisit, qui peut écrire', () => {
    const b = (k: keyof typeof rental) => bindingOf(rental[k]) as FieldBinding;
    expect(filledBy(b('lessor_name'))).toBe('platform');
    expect(filledBy(b('renter_license_number'))).toBe('client');
    expect(filledBy(b('insurance_type'))).toBe('provider');
    expect(clientMayEdit(b('renter_name'))).toBe(true);
    expect(clientMayEdit(b('daily_rate'))).toBe(false);
    expect(providerMayEdit(b('renter_name'))).toBe(true);
    expect(providerMayEdit(b('daily_rate'))).toBe(false);
    expect(clientMayEdit(null)).toBe(false);
  });

  it('catalogue : sources fixes et caractéristiques du service', () => {
    expect(sourceInfo('organization.rcs')).toMatchObject({ block: 'organization' });
    expect(sourceInfo('service.attributes.deposit_amount')).toMatchObject({ block: 'service', format: 'money' });
    expect(sourceInfo('service.attributes.Bad Key')).toBeNull();
    expect(sourceInfo('organization.passwordHash')).toBeNull();
  });
});

describe('validateTemplateBindings', () => {
  it('le modèle de référence est cohérent', () => {
    expect(validateTemplateBindings(rental)).toEqual([]);
  });

  it('détecte : obligatoire sans liaison, source inconnue, bloc et source discordants, champ calculé sans source, liste sans options, champ client verrouillé, rôle en double', () => {
    const codes = validateTemplateBindings({
      a: { required: true },
      b: { required: true, binding: { block: 'organization', sources: ['organization.secret'], format: 'text' } },
      c: { required: true, binding: { block: 'client', sources: ['organization.legalName'], format: 'text' } },
      d: { required: true, binding: { block: 'service', format: 'text' } },
      e: { required: false, binding: { block: 'provider', format: 'select' } },
      f: { required: true, binding: { block: 'client', format: 'text', locked: true } },
      g: { required: false, binding: { block: 'client', format: 'date', role: 'period_start' } },
      h: { required: false, binding: { block: 'client', format: 'date', role: 'period_start' } },
      i: { required: false, binding: { block: 'x' } },
      j: { required: false, binding: { block: 'provider', sources: ['service.price'], format: 'money' } },
    }).map((i) => `${i.key}:${i.code}`);
    expect(codes).toEqual(['a:NO_BINDING', 'b:UNKNOWN_SOURCE', 'c:BLOCK_SOURCE_MISMATCH', 'd:NO_SOURCE', 'e:SELECT_WITHOUT_OPTIONS', 'f:CLIENT_FIELD_LOCKED', 'i:INVALID_BINDING', 'j:BLOCK_SOURCE_MISMATCH', 'h:DUPLICATE_ROLE']);
  });

  it('un champ calculé sans source mais avec une valeur par défaut est accepté', () => {
    expect(validateTemplateBindings({ x: { required: true, default: 'Paris', binding: { block: 'service', format: 'text' } } })).toEqual([]);
  });
});

describe('validateFieldValue', () => {
  const f = (format: FieldBinding['format'], extra: Partial<FieldBinding> = {}): FieldBinding => ({ block: 'client', format, ...extra });
  it('texte : caractères de contrôle retirés, longueur bornée, vide obligatoire refusé', () => {
    expect(validateFieldValue(f('text'), '  Ada\u0000 Lovelace ')).toEqual({ ok: true, value: 'Ada Lovelace' });
    expect(validateFieldValue(f('text', { maxLength: 3 }), 'abcd').code).toBe('too_long');
    expect(validateFieldValue(f('text'), '', true).code).toBe('required');
    expect(validateFieldValue(f('text'), '').ok).toBe(true);
  });
  it('dates réelles, montants positifs à 2 décimales, entiers et pourcentages bornés', () => {
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(validateFieldValue(f('date'), '2026-11-01').ok).toBe(true);
    expect(validateFieldValue(f('date'), '01/11/2026')).toEqual({ ok: true, value: '2026-11-01' });
    expect(validateFieldValue(f('date'), '2026-11-01T09:30:00.000Z')).toEqual({ ok: true, value: '2026-11-01' });
    expect(validateFieldValue(f('date'), '31/02/2026').code).toBe('invalid_date');
    expect(validateFieldValue(f('date'), 'demain').code).toBe('invalid_date');
    expect(validateFieldValue(f('money'), '45,5')).toEqual({ ok: true, value: '45.50' });
    expect(validateFieldValue(f('money'), '-3').code).toBe('invalid_number');
    expect(validateFieldValue(f('money'), '12.345').code).toBe('invalid_number');
    expect(validateFieldValue(f('integer', { min: 1 }), '0').code).toBe('out_of_range');
    expect(validateFieldValue(f('integer'), '3.5').code).toBe('invalid_number');
    expect(validateFieldValue(f('percent'), '120').code).toBe('out_of_range');
  });
  it('e-mail, téléphone, liste fermée', () => {
    expect(validateFieldValue(f('email'), 'Ada@Acme.FR')).toEqual({ ok: true, value: 'ada@acme.fr' });
    expect(validateFieldValue(f('email'), 'ada<script>@x.fr').code).toBe('invalid_email');
    expect(validateFieldValue(f('phone'), '+33 6 12 34 56 78').ok).toBe(true);
    expect(validateFieldValue(f('phone'), 'appelle-moi').code).toBe('invalid_phone');
    expect(validateFieldValue(f('select', { options: ['A', 'B'] }), 'C').code).toBe('invalid_option');
  });
});

describe('crossCheck', () => {
  it('période inversée, total supérieur au tarif × durée ; une remise (total inférieur) est acceptée', () => {
    expect(crossCheck(rental, { start_date: '2026-11-05', end_date: '2026-11-01' }).map((i) => i.code)).toEqual(['PERIOD_INVERTED']);
    expect(crossCheck(rental, { daily_rate: '100.00', rental_days: '3', rental_price: '350.00' }).map((i) => i.code)).toEqual(['TOTAL_MISMATCH']);
    expect(crossCheck(rental, { daily_rate: '100.00', rental_days: '7', rental_price: '630.00' })).toEqual([]);
    expect(crossCheck(rental, { start_date: '2026-11-01', end_date: '2026-11-01' })).toEqual([]);
  });
});

describe('mergeFieldValues', () => {
  const computed = { lessor_name: 'Loc Auto', vehicle_plate: 'AB-123-CD', daily_rate: '100.00', contract_date: '2026-10-05', renter_name: 'Ada (profil)' };

  it('le client corrige SES champs ; le prestataire pré-remplit client et prestataire ; le serveur garde les champs calculés', () => {
    const r = mergeFieldValues(rental, computed, { renter_name: 'Ada L.', insurance_type: 'Tiers' }, { renter_name: 'Ada Lovelace', renter_license_number: '12AB34' });
    expect(r.values).toMatchObject({ lessor_name: 'Loc Auto', daily_rate: '100.00', renter_name: 'Ada Lovelace', renter_license_number: '12AB34', insurance_type: 'Tiers' });
    expect(r.origin).toMatchObject({ lessor_name: 'platform', renter_name: 'client', insurance_type: 'provider' });
    expect(r.rejected).toEqual([]);
  });

  it('refuse qu’un client ou un prestataire écrase un montant, une plaque ou la date du contrat', () => {
    const r = mergeFieldValues(rental, computed, { daily_rate: '1.00' }, { daily_rate: '0.01', vehicle_plate: 'FAKE', contract_date: '2020-01-01', insurance_type: 'Tiers' });
    expect(r.values).toMatchObject({ daily_rate: '100.00', vehicle_plate: 'AB-123-CD', contract_date: '2026-10-05' });
    expect(r.values.insurance_type).toBe('Tous risques'); // défaut : le client ne choisit pas l'assurance
    expect(r.rejected.sort()).toEqual(['contract_date', 'daily_rate', 'insurance_type', 'vehicle_plate']);
  });

  it('modèle sans liaisons (historique) : la saisie du prestataire reste acceptée, celle du client jamais', () => {
    const legacy = { foo: { required: true } };
    expect(mergeFieldValues(legacy, {}, { foo: 'x' }).values).toEqual({ foo: 'x' });
    expect(mergeFieldValues(legacy, {}, {}, { foo: 'y' }).rejected).toEqual(['foo']);
  });
});

describe('empreinte et données sensibles', () => {
  it('canonicalValues ne dépend pas de l’ordre ; redactSensitive masque les champs sensibles', () => {
    expect(canonicalValues({ b: '2', a: '1' })).toBe(canonicalValues({ a: '1', b: '2' }));
    expect(redactSensitive(rental, { renter_license_number: '12AB34', renter_name: 'Ada' })).toEqual({ renter_license_number: '•••', renter_name: 'Ada' });
  });
});

describe('variables d’un contrat libre (sans modèle standard)', () => {
  const doc = (text: string) => [{ id: 's1', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }, { type: 'variableMark', attrs: { key: 'nom_du_chien' } }] }] }, children: [{ id: 's2', content: { type: 'doc', content: [{ type: 'text', text: '{{ date_debut }}' }] } }] }];

  it('extractVariableKeys : texte {{clé}}, nœud variableMark, sous-sections, sans doublon', () => {
    expect(extractVariableKeys(doc('Entre {{client_name}} et {{provider_name}}, {{client_name}}'))).toEqual(['client_name', 'provider_name', 'nom_du_chien', 'date_debut']);
    expect(extractVariableKeys(null)).toEqual([]);
  });

  it('inferBinding : préfixes des parties, montants de la commande, dates de la réservation, données sensibles, clauses', () => {
    const b = (key: string, def: object = {}, ctx: object = {}) => inferBinding(key, def, ctx);
    expect(b('provider_name')).toEqual({ block: 'organization', sources: ['organization.legalName'], format: 'text' });
    expect(b('client_email')).toEqual({ block: 'client', format: 'email', sources: ['client.email'] });
    expect(b('montant_total', { type: 'number' })).toEqual({ block: 'service', sources: ['transaction.amount', 'service.price'], format: 'money' });
    expect(b('tarif_journalier', { type: 'number' })).toMatchObject({ block: 'service', sources: ['transaction.pricing.unitRate', 'service.attributes.rate_day', 'service.price'] });
    expect(b('date_debut')).toMatchObject({ block: 'client', sources: ['transaction.booking.startDate'], format: 'date' });
    expect(b('numero_permis')).toMatchObject({ block: 'client', sensitive: true });
    expect(b('nom_du_locataire')).toEqual({ block: 'client', sources: ['client.name'], format: 'text' });
    expect(b('siret_prestataire')).toMatchObject({ block: 'organization', sources: ['organization.siret'] });
    expect(b('lieu_signature')).toMatchObject({ block: 'organization', sources: ['organization.city'] });
    expect(b('nom_du_chien')).toEqual({ block: 'client', format: 'text' });
    expect(b('penalite_retard', {}, { hasDefault: true })).toEqual({ block: 'provider', format: 'text' });
    expect(b('frais_annexes_pct', { type: 'number' })).toEqual({ block: 'provider', format: 'percent' });
    // Modèles standards : une variable inconnue est une clause du prestataire.
    expect(b('nom_du_chien', {}, { standard: true })).toEqual({ block: 'provider', format: 'text' });
    // Une liste sans options devient du texte (jamais une liste vide).
    expect(b('assurance', { type: 'select' })).toMatchObject({ format: 'text' });
  });

  it('completeVariableDefs : chaque variable du texte a une définition et une liaison valide ; les liaisons cohérentes sont gardées', () => {
    const r = completeVariableDefs({
      sections: doc('{{client_name}} {{montant}} {{prix}}'),
      defs: {
        client_name: { key: 'client_name', label: 'Client', type: 'text', required: true, binding: { block: 'client', sources: ['client.name'], format: 'text' } },
        montant: { key: 'montant', type: 'number', binding: { block: 'client', sources: ['organization.rcs'], format: 'money' } },
        'Bad Key': { label: 'x' },
      },
    });
    expect(Object.keys(r.defs)).toEqual(['client_name', 'montant', 'prix', 'nom_du_chien', 'date_debut']);
    expect(r.added).toEqual(['prix', 'nom_du_chien', 'date_debut']);
    expect(r.replaced).toEqual(['montant']);
    expect(r.defs.client_name.binding).toEqual({ block: 'client', sources: ['client.name'], format: 'text' });
    expect(r.defs.montant.binding).toMatchObject({ block: 'service', sources: ['transaction.amount', 'service.price'] });
    expect(r.defs.nom_du_chien).toMatchObject({ label: 'Nom du chien', type: 'text', required: true, binding: { block: 'client' } });
    expect(validateTemplateBindings(r.defs)).toEqual([]);
  });

  it('completeVariableDefs : un rôle de calcul n’est porté que par une variable ; les liaisons du modèle d’origine priment', () => {
    const r = completeVariableDefs({
      sections: [], defs: { price_amount: { type: 'number' }, fixed_price: { type: 'number' }, insurance_type: { type: 'select', options: ['A'] } },
      baseBindings: { insurance_type: { block: 'provider', format: 'select' } },
    });
    expect(r.defs.price_amount.binding.role).toBe('total');
    expect(r.defs.fixed_price.binding.role).toBeUndefined();
    expect(r.defs.insurance_type.binding).toEqual({ block: 'provider', format: 'select' });
    expect(validateTemplateBindings(r.defs)).toEqual([]);
  });
});
