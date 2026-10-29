/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/contract-fields/contract-fields.ts
   │  Régénérer        : ./scripts/sync-contract-fields.sh                   │
   │  Vérifier (CI)    : ./scripts/sync-contract-fields.sh --check           │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

// libs/shared/contract-fields/contract-fields.ts
//
// Champs dynamiques des modèles de contrat (docs/architecture/contrats-champs.md).
//
// Chaque variable d'un modèle de contrat déclare SA LIAISON (`binding`) : QUI la
// fournit et D'OÙ elle vient. C'est la seule source de vérité, lue par :
//   - mu-contract  (validation à l'enregistrement d'un modèle et à la création d'un contrat) ;
//   - mu-command   (résolution dans les flows de service, pre-flight) ;
//   - smp-webapp   (écran « Champs du contrat », saisie prestataire et client).
//
// Cinq blocs :
//   organization — informations de l'organisation (raison sociale, RCS, adresse…) : automatique ;
//   service      — la prestation : objet loué et caractéristiques, dates, durées, montants calculés : automatique ;
//   client       — ce que seul le client connaît (identité, permis, naissance…) : saisi / corrigé par le client ;
//   provider     — fixé par le prestataire (salaire, préavis, juridiction…) : une fois dans le flow, ou à la préparation ;
//   contract     — généré par la plateforme (date du contrat, référence).
//
// Sécurité : un client ne peut écrire QUE des champs `client` non verrouillés ; les champs
// `organization`, `service` et `contract` sont recalculés côté serveur et jamais repris d'une
// saisie ; chaque valeur est validée (`validateFieldValue`) ; les champs `sensitive` ne sortent
// jamais dans les journaux, événements ou e-mails.
//
// Fonctions pures, sans dépendance. Recopié par scripts/sync-contract-fields.sh.

export const FIELD_BLOCKS = ['organization', 'service', 'client', 'provider', 'contract'] as const;
export type FieldBlock = (typeof FIELD_BLOCKS)[number];

export const FIELD_FORMATS = ['text', 'textarea', 'date', 'money', 'integer', 'number', 'percent', 'email', 'phone', 'select'] as const;
export type FieldFormat = (typeof FIELD_FORMATS)[number];

/** Rôle d'un champ dans les contrôles de cohérence croisés. */
export const FIELD_ROLES = ['period_start', 'period_end', 'unit_rate', 'units', 'total', 'deposit'] as const;
export type FieldRole = (typeof FIELD_ROLES)[number];

export interface FieldBinding {
  block: FieldBlock;
  /** Sources, dans l'ordre (la première renseignée gagne). Vide : saisie (client ou prestataire). */
  sources?: string[];
  format: FieldFormat;
  options?: string[];
  min?: number;
  max?: number;
  maxLength?: number;
  /** Le client ne peut pas modifier ce champ (vrai par défaut hors bloc `client`). */
  locked?: boolean;
  /** Donnée personnelle : jamais dans les journaux, événements ou e-mails. */
  sensitive?: boolean;
  role?: FieldRole;
  /** Libellé de la question posée au client, s'il diffère du libellé du champ. */
  question?: string;
}

// ─── Catalogue des sources ──────────────────────────────────────────────────

export interface SourceInfo { block: FieldBlock; format: FieldFormat; label: string }

/** Sources fixes connues de la plateforme. `service.attributes.<clé>` est ouvert (caractéristiques du service). */
export const SOURCE_CATALOG: Readonly<Record<string, SourceInfo>> = {
  'organization.legalName': { block: 'organization', format: 'text', label: 'Raison sociale' },
  'organization.legalForm': { block: 'organization', format: 'text', label: 'Forme juridique' },
  'organization.capital': { block: 'organization', format: 'text', label: 'Capital' },
  'organization.siret': { block: 'organization', format: 'text', label: 'SIRET' },
  'organization.rcs': { block: 'organization', format: 'text', label: 'RCS' },
  'organization.vatNumber': { block: 'organization', format: 'text', label: 'N° de TVA' },
  'organization.address': { block: 'organization', format: 'text', label: 'Adresse' },
  'organization.city': { block: 'organization', format: 'text', label: 'Ville' },
  'organization.email': { block: 'organization', format: 'email', label: 'E-mail' },
  'organization.phone': { block: 'organization', format: 'phone', label: 'Téléphone' },
  'organization.representative': { block: 'organization', format: 'text', label: 'Représentant légal' },
  'service.title': { block: 'service', format: 'text', label: 'Titre du service' },
  'service.description': { block: 'service', format: 'textarea', label: 'Description du service' },
  'service.price': { block: 'service', format: 'money', label: 'Prix du service' },
  'transaction.amount': { block: 'service', format: 'money', label: 'Montant de la commande' },
  'transaction.currency': { block: 'service', format: 'text', label: 'Devise' },
  'transaction.booking.startDate': { block: 'service', format: 'date', label: 'Début de la réservation' },
  'transaction.booking.endDate': { block: 'service', format: 'date', label: 'Fin de la réservation' },
  'transaction.booking.location': { block: 'service', format: 'text', label: 'Lieu de la réservation' },
  'transaction.pricing.unitRate': { block: 'service', format: 'money', label: 'Tarif unitaire calculé' },
  'transaction.pricing.units': { block: 'service', format: 'integer', label: 'Nombre d’unités (jours…)' },
  'transaction.pricing.total': { block: 'service', format: 'money', label: 'Total calculé' },
  'transaction.pricing.deposit': { block: 'service', format: 'money', label: 'Caution calculée' },
  'transaction.paymentTerms': { block: 'service', format: 'textarea', label: 'Conditions de règlement' },
  'transaction.schedule.downPayment': { block: 'service', format: 'money', label: 'Acompte à la commande' },
  'transaction.schedule.paymentDelayDays': { block: 'service', format: 'integer', label: 'Délai de paiement (jours)' },
  'client.name': { block: 'client', format: 'text', label: 'Nom du client' },
  'client.company': { block: 'client', format: 'text', label: 'Société du client' },
  'client.address': { block: 'client', format: 'text', label: 'Adresse du client' },
  'client.email': { block: 'client', format: 'email', label: 'E-mail du client' },
  'client.phone': { block: 'client', format: 'phone', label: 'Téléphone du client' },
  'contract.date': { block: 'contract', format: 'date', label: 'Date du contrat' },
  'contract.reference': { block: 'contract', format: 'text', label: 'Référence du contrat' },
};

const ATTRIBUTE_SOURCE = /^service\.attributes\.[a-z][a-z0-9_]{0,31}$/;
const MONEY_ATTRIBUTES = /^(rate_|deposit_amount$|franchise_amount$|equipment_value$|mileage_extra_cost$|callout_fee$)/;

/** Informations sur une source, `null` si elle n'existe pas. */
export function sourceInfo(source: string): SourceInfo | null {
  if (SOURCE_CATALOG[source]) return SOURCE_CATALOG[source];
  if (ATTRIBUTE_SOURCE.test(source)) {
    const key = source.slice('service.attributes.'.length);
    return { block: 'service', format: MONEY_ATTRIBUTES.test(key) ? 'money' : 'text', label: `Caractéristique « ${key} »` };
  }
  return null;
}

// ─── Liaisons ───────────────────────────────────────────────────────────────

const isObject = (v: unknown): v is Record<string, any> => !!v && typeof v === 'object' && !Array.isArray(v);

/** Format par défaut d'un type de variable de modèle (`text`, `number`, `date`, `select`, `textarea`). */
export function formatForType(type: string | null | undefined): FieldFormat {
  switch (String(type ?? '').toLowerCase()) {
    case 'date': return 'date';
    case 'number': return 'number';
    case 'select': return 'select';
    case 'textarea': return 'textarea';
    case 'email': return 'email';
    default: return 'text';
  }
}

/** Liaison normalisée d'une variable, ou `null` si la variable n'en déclare pas. */
export function bindingOf(def: unknown): FieldBinding | null {
  if (!isObject(def) || !isObject(def.binding)) return null;
  const b = def.binding;
  if (!(FIELD_BLOCKS as readonly string[]).includes(b.block)) return null;
  const format = (FIELD_FORMATS as readonly string[]).includes(b.format) ? (b.format as FieldFormat) : formatForType(def.type);
  const sources = Array.isArray(b.sources) ? b.sources.filter((s: unknown): s is string => typeof s === 'string' && s.length > 0).slice(0, 5) : [];
  const options = Array.isArray(b.options) ? b.options.map(String) : Array.isArray(def.options) ? def.options.map(String) : undefined;
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
  return {
    block: b.block,
    ...(sources.length ? { sources } : {}),
    format,
    ...(options && options.length ? { options } : {}),
    ...(num(b.min) !== undefined ? { min: num(b.min) } : {}),
    ...(num(b.max) !== undefined ? { max: num(b.max) } : {}),
    ...(num(b.maxLength) !== undefined ? { maxLength: num(b.maxLength) } : {}),
    locked: typeof b.locked === 'boolean' ? b.locked : b.block !== 'client',
    ...(b.sensitive === true ? { sensitive: true } : {}),
    ...((FIELD_ROLES as readonly string[]).includes(b.role) ? { role: b.role as FieldRole } : {}),
    ...(typeof b.question === 'string' && b.question.trim() ? { question: b.question.trim().slice(0, 200) } : {}),
  };
}

/** Qui saisit le champ quand aucune source ne le remplit. */
export function filledBy(binding: FieldBinding): 'platform' | 'client' | 'provider' {
  if (binding.block === 'client') return 'client';
  if (binding.block === 'provider') return 'provider';
  return 'platform';
}

/** Le client peut-il écrire ce champ (formulaire de signature, questions d'un flow) ? */
export function clientMayEdit(binding: FieldBinding | null): boolean {
  return !!binding && binding.block === 'client' && binding.locked !== true;
}

/** Le prestataire peut-il pré-remplir ce champ à la préparation ? (jamais les champs calculés par la plateforme) */
export function providerMayEdit(binding: FieldBinding | null): boolean {
  return !!binding && (binding.block === 'client' || binding.block === 'provider');
}

export interface BindingIssue { key: string; code: string; message: string }

/** Préfixes de source autorisés par bloc. Le client peut être pré-rempli depuis la réservation ; le prestataire saisit toujours. */
const ALLOWED_SOURCES: Record<FieldBlock, readonly string[]> = {
  organization: ['organization.'],
  service: ['service.', 'transaction.'],
  client: ['client.', 'transaction.booking.'],
  provider: [],
  contract: ['contract.'],
};
const sourceAllowed = (block: FieldBlock, source: string) => ALLOWED_SOURCES[block].some((p) => source.startsWith(p));

/**
 * Cohérence des liaisons d'un modèle (à l'enregistrement d'un modèle, et en CI pour les
 * modèles standards) : chaque variable obligatoire est liée ; les sources existent et
 * appartiennent au bloc déclaré ; un champ calculé a une source ; une liste a des options ;
 * un format de montant ne lit pas une source texte.
 */
export function validateTemplateBindings(variables: Record<string, unknown> | null | undefined): BindingIssue[] {
  const issues: BindingIssue[] = [];
  for (const [key, def] of Object.entries(variables ?? {})) {
    const required = isObject(def) && def.required === true;
    const b = bindingOf(def);
    if (!b) {
      if (isObject(def) && def.binding !== undefined) issues.push({ key, code: 'INVALID_BINDING', message: `« ${key} » : liaison invalide (bloc inconnu).` });
      else if (required) issues.push({ key, code: 'NO_BINDING', message: `« ${key} » est obligatoire mais ne dit pas qui le fournit.` });
      continue;
    }
    for (const s of b.sources ?? []) {
      const info = sourceInfo(s);
      if (!info) { issues.push({ key, code: 'UNKNOWN_SOURCE', message: `« ${key} » : source inconnue « ${s} ».` }); continue; }
      if (!sourceAllowed(b.block, s)) issues.push({ key, code: 'BLOCK_SOURCE_MISMATCH', message: `« ${key} » est déclaré « ${b.block} » mais lit « ${s} ».` });
      if (b.format === 'money' && info.format === 'text' && !s.startsWith('service.attributes.')) issues.push({ key, code: 'FORMAT_MISMATCH', message: `« ${key} » attend un montant mais lit « ${s} » (texte).` });
    }
    if ((b.block === 'organization' || b.block === 'service' || b.block === 'contract') && !(b.sources?.length) && required && !(isObject(def) && def.default !== undefined && def.default !== null && String(def.default) !== '')) {
      issues.push({ key, code: 'NO_SOURCE', message: `« ${key} » est calculé par la plateforme (${b.block}) mais n'a ni source ni valeur par défaut.` });
    }
    if (b.format === 'select' && !(b.options?.length)) issues.push({ key, code: 'SELECT_WITHOUT_OPTIONS', message: `« ${key} » est une liste sans options.` });
    if (b.block === 'client' && b.locked) issues.push({ key, code: 'CLIENT_FIELD_LOCKED', message: `« ${key} » est saisi par le client mais verrouillé : il ne pourra jamais être rempli.` });
  }
  const roles = new Map<string, string>();
  for (const [key, def] of Object.entries(variables ?? {})) {
    const role = bindingOf(def)?.role;
    if (!role) continue;
    if (roles.has(role)) issues.push({ key, code: 'DUPLICATE_ROLE', message: `« ${key} » et « ${roles.get(role)} » portent tous deux le rôle « ${role} ».` });
    else roles.set(role, key);
  }
  return issues;
}

// ─── Valeurs ────────────────────────────────────────────────────────────────

export interface FieldCheck { ok: boolean; value: string; code?: 'required' | 'too_long' | 'invalid_date' | 'invalid_number' | 'out_of_range' | 'invalid_email' | 'invalid_phone' | 'invalid_option' }

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const DEFAULT_MAX: Partial<Record<FieldFormat, number>> = { textarea: 4000, text: 500 };

const parseNumber = (s: string): number | null => {
  const t = s.replace(/\s/g, '').replace(',', '.');
  return /^-?\d+(\.\d+)?$/.test(t) ? Number(t) : null;
};

/** Date ISO `AAAA-MM-JJ` réelle (refuse 2026-02-30). */
export function isIsoDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

/**
 * Date normalisée en `AAAA-MM-JJ` : accepte une date ISO, un horodatage ISO (date d'une
 * réservation) ou une saisie française `JJ/MM/AAAA` ; `null` si la date n'existe pas.
 */
export function toIsoDate(s: string): string | null {
  const t = s.trim();
  const fr = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(t);
  const candidate = fr ? `${fr[3]}-${fr[2]}-${fr[1]}` : /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(t) ? t.slice(0, 10) : t;
  return isIsoDate(candidate) ? candidate : null;
}

/**
 * Valide et normalise une valeur saisie pour un champ : caractères de contrôle retirés,
 * longueur bornée, date réelle (normalisée en ISO), nombres (virgule acceptée) dans leurs bornes, montant
 * ≥ 0 à 2 décimales, e-mail, téléphone, option de la liste. Valeur vide : `required` si
 * `required`, sinon ok.
 */
export function validateFieldValue(binding: FieldBinding, raw: unknown, required = false): FieldCheck {
  const value = (raw === null || raw === undefined ? '' : String(raw)).replace(CONTROL_CHARS, '').trim();
  if (!value) return required ? { ok: false, value, code: 'required' } : { ok: true, value };
  const max = binding.maxLength ?? DEFAULT_MAX[binding.format] ?? 500;
  if (value.length > max) return { ok: false, value, code: 'too_long' };
  const inRange = (n: number) => (binding.min === undefined || n >= binding.min) && (binding.max === undefined || n <= binding.max);
  switch (binding.format) {
    case 'date': {
      const iso = toIsoDate(value);
      return iso ? { ok: true, value: iso } : { ok: false, value, code: 'invalid_date' };
    }
    case 'money': {
      const n = parseNumber(value);
      if (n === null || !/^\d+([.,]\d{1,2})?$/.test(value.replace(/\s/g, ''))) return { ok: false, value, code: 'invalid_number' };
      if (n < 0 || !inRange(n)) return { ok: false, value, code: 'out_of_range' };
      return { ok: true, value: n.toFixed(2) };
    }
    case 'integer': {
      if (!/^-?\d+$/.test(value)) return { ok: false, value, code: 'invalid_number' };
      const n = Number(value);
      return inRange(n) ? { ok: true, value: String(n) } : { ok: false, value, code: 'out_of_range' };
    }
    case 'number': case 'percent': {
      const n = parseNumber(value);
      if (n === null) return { ok: false, value, code: 'invalid_number' };
      const lo = binding.format === 'percent' ? Math.max(0, binding.min ?? 0) : binding.min;
      const hi = binding.format === 'percent' ? Math.min(100, binding.max ?? 100) : binding.max;
      if ((lo !== undefined && n < lo) || (hi !== undefined && n > hi)) return { ok: false, value, code: 'out_of_range' };
      return { ok: true, value: String(n) };
    }
    case 'email':
      return /^[^\s@<>()"]{1,64}@[^\s@<>()"]{1,190}\.[A-Za-z]{2,}$/.test(value) ? { ok: true, value: value.toLowerCase() } : { ok: false, value, code: 'invalid_email' };
    case 'phone':
      return /^\+?[0-9 ().-]{6,20}$/.test(value) ? { ok: true, value } : { ok: false, value, code: 'invalid_phone' };
    case 'select':
      return !binding.options?.length || binding.options.includes(value) ? { ok: true, value } : { ok: false, value, code: 'invalid_option' };
    default:
      return { ok: true, value };
  }
}

export interface CoherenceIssue { code: 'PERIOD_INVERTED' | 'TOTAL_MISMATCH' | 'NEGATIVE_DEPOSIT'; keys: string[]; message: string }

/**
 * Contrôles croisés à la création du contrat, d'après les rôles des champs : la fin ne
 * précède pas le début ; total = tarif × unités (± 1 centime, remises comprises si le total
 * est inférieur, jamais supérieur) ; caution positive.
 */
export function crossCheck(variables: Record<string, unknown> | null | undefined, values: Record<string, string>): CoherenceIssue[] {
  const byRole = new Map<FieldRole, string>();
  for (const [key, def] of Object.entries(variables ?? {})) {
    const role = bindingOf(def)?.role;
    if (role && !byRole.has(role)) byRole.set(role, key);
  }
  const v = (role: FieldRole) => { const k = byRole.get(role); return k ? values[k] : undefined; };
  const issues: CoherenceIssue[] = [];
  const start = v('period_start'); const end = v('period_end');
  if (start && end && isIsoDate(start) && isIsoDate(end) && end < start) {
    issues.push({ code: 'PERIOD_INVERTED', keys: [byRole.get('period_start')!, byRole.get('period_end')!], message: 'La date de fin précède la date de début.' });
  }
  const num = (s: string | undefined) => (s === undefined || s === '' ? null : parseNumber(s));
  const rate = num(v('unit_rate')); const units = num(v('units')); const total = num(v('total'));
  if (rate !== null && units !== null && total !== null && total - rate * units > 0.01) {
    issues.push({ code: 'TOTAL_MISMATCH', keys: [byRole.get('total')!, byRole.get('unit_rate')!, byRole.get('units')!], message: `Le total (${total.toFixed(2)}) dépasse le tarif × la durée (${(rate * units).toFixed(2)}).` });
  }
  const deposit = num(v('deposit'));
  if (deposit !== null && deposit < 0) issues.push({ code: 'NEGATIVE_DEPOSIT', keys: [byRole.get('deposit')!], message: 'La caution ne peut pas être négative.' });
  return issues;
}

/**
 * Valeurs effectivement retenues pour un contrat, avec QUI les a fournies : les saisies du
 * client ne sont gardées que pour ses champs (`clientMayEdit`), celles du prestataire que
 * pour les champs qu'il peut pré-remplir ; tout le reste vient du serveur (`computed`).
 */
export function mergeFieldValues(
  variables: Record<string, unknown> | null | undefined,
  computed: Record<string, string>,
  provider: Record<string, unknown> = {},
  client: Record<string, unknown> = {},
): { values: Record<string, string>; origin: Record<string, 'platform' | 'provider' | 'client' | 'default'>; rejected: string[] } {
  const values: Record<string, string> = {};
  const origin: Record<string, 'platform' | 'provider' | 'client' | 'default'> = {};
  const rejected: string[] = [];
  for (const [key, def] of Object.entries(variables ?? {})) {
    const b = bindingOf(def);
    const fromServer = computed[key];
    const clientValue = client[key];
    const providerValue = provider[key];
    if (clientValue !== undefined && !clientMayEdit(b)) rejected.push(key);
    if (providerValue !== undefined && !providerMayEdit(b) && b) rejected.push(key);
    if (clientValue !== undefined && clientMayEdit(b) && String(clientValue).trim() !== '') { values[key] = String(clientValue); origin[key] = 'client'; continue; }
    if (providerValue !== undefined && (providerMayEdit(b) || !b) && String(providerValue).trim() !== '') { values[key] = String(providerValue); origin[key] = 'provider'; continue; }
    if (fromServer !== undefined && fromServer !== '') { values[key] = fromServer; origin[key] = 'platform'; continue; }
    const dflt = isObject(def) ? def.default : undefined;
    if (dflt !== undefined && dflt !== null && String(dflt) !== '') { values[key] = String(dflt); origin[key] = 'default'; }
  }
  return { values, origin, rejected: [...new Set(rejected)] };
}

/** Sérialisation canonique (clés triées) d'un jeu de valeurs : base de l'empreinte du contrat figé. */
export function canonicalValues(values: Record<string, string>): string {
  return JSON.stringify(Object.keys(values).sort().map((k) => [k, values[k]]));
}

/** Copie d'un jeu de valeurs sans les champs sensibles (journaux, événements, e-mails). */
export function redactSensitive(variables: Record<string, unknown> | null | undefined, values: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(values)) out[k] = bindingOf((variables ?? {})[k])?.sensitive ? '•••' : v;
  return out;
}

// ─── Variables d'un contrat : extraction, inférence des liaisons ───────────
//
// Un contrat rédigé sans modèle standard (page blanche, variables ajoutées dans l'éditeur ou par
// l'agent) doit fonctionner dans un flow comme un modèle standard : chaque variable utilisée dans
// le texte reçoit une définition et une liaison, déduites de son nom et de son type quand
// l'auteur ne les a pas données (`completeVariableDefs`, appliqué par mu-contract à chaque
// enregistrement). Les modèles standards sont annotés par la même fonction
// (scripts/contracts/bind-standard-templates.mjs), et un test vérifie qu'ils restent identiques.

/** Clé de variable valide : minuscule, commence par une lettre, 64 caractères max. */
export const VARIABLE_KEY_RE = /^[a-z][a-z0-9_]{0,63}$/;
const TEXT_VAR_RE = /\{\{\s*([A-Za-z][A-Za-z0-9_]*)\s*\}\}/g;

/** Clés utilisées dans les sections (texte `{{clé}}` ou nœud TipTap `variableMark`), ordre de première apparition. */
export function extractVariableKeys(sections: unknown): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const add = (key: string) => { if (key && !seen.has(key)) { seen.add(key); out.push(key); } };
  const walkNode = (node: any, depth: number) => {
    if (!node || typeof node !== 'object' || depth > 64) return;
    if (node.type === 'variableMark' && typeof node.attrs?.key === 'string') add(node.attrs.key);
    if (node.type === 'text' && typeof node.text === 'string') {
      for (const m of node.text.matchAll(TEXT_VAR_RE)) add(m[1]);
      for (const mark of Array.isArray(node.marks) ? node.marks : []) {
        if (mark?.type === 'variableMark' && typeof mark.attrs?.key === 'string') add(mark.attrs.key);
      }
    }
    if (Array.isArray(node.content)) for (const n of node.content) walkNode(n, depth + 1);
  };
  const walkSection = (s: any, depth: number) => {
    if (!s || typeof s !== 'object' || depth > 16) return;
    walkNode(s.content, 0);
    if (Array.isArray(s.children)) for (const c of s.children) walkSection(c, depth + 1);
  };
  if (Array.isArray(sections)) for (const s of sections) walkSection(s, 0);
  return out;
}

/** Type probable d'une variable d'après son nom, quand sa définition ne le donne pas. */
export function inferVariableType(key: string): 'text' | 'number' | 'date' | 'textarea' | 'email' {
  const k = key.toLowerCase();
  if (k.endsWith('_email') || k === 'email') return 'email';
  if (k === 'date' || k.endsWith('_date') || k.startsWith('date_')) return 'date';
  if (/(amount|price|prix|montant|tarif|cout|honoraires|loyer|salary|salaire|_rate|_fee|_cost|_count|_hours|_days|_months|_years|_weeks|_pct|_percent|capital|deposit|caution|mileage)/.test(k)
    && !/(_unit|_type|_terms|_status)$/.test(k)) return 'number';
  if (/(description|content|scope|deliverables|methodology|purpose|contributions|objectives)/.test(k)) return 'textarea';
  return 'text';
}

/** `client_name` → « Client name ». */
export function humanizeVariableKey(key: string): string {
  const s = key.replace(/_/g, ' ').trim();
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : key;
}

/** Contexte de l'inférence : préfixes des parties, modèle standard d'origine. */
export interface InferContext {
  /** Préfixe de l'organisation qui rédige (`lessor`, `provider`…). Défaut `provider`. */
  selfRole?: string;
  /** Préfixe du client / cocontractant (`renter`, `client`…). Défaut `client`. */
  counterpartyRole?: string;
  /** Modèle standard d'origine, sans suffixe de langue (`car-rental-agreement`). */
  templateBase?: string | null;
  /**
   * Règle des modèles standards : une variable inconnue est une clause du prestataire. Sans
   * elle (contrat libre), une variable inconnue revient au client, sauf montant ou valeur par défaut.
   */
  standard?: boolean;
  /** La variable a une valeur par défaut (définition ou valeurs du modèle d'organisation). */
  hasDefault?: boolean;
}

const RENTAL_TEMPLATES = new Set(['car-rental-agreement', 'lease-agreement']);
const EMPLOYER_TEMPLATES = new Set(['employment-agreement', 'internship-agreement', 'subscription-termination']);

const SELF_SUFFIX_SOURCES: Record<string, string[]> = {
  name: ['organization.legalName'], company: ['organization.legalName'], rcs: ['organization.rcs', 'organization.siret'],
  siret: ['organization.siret'], address: ['organization.address'], representative: ['organization.representative'],
  legal_form: ['organization.legalForm'], capital: ['organization.capital'], email: ['organization.email'], phone: ['organization.phone'],
};
const CLIENT_SUFFIX_SOURCES: Record<string, string[]> = {
  name: ['client.company', 'client.name'], address: ['client.address'], email: ['client.email'], phone: ['client.phone'],
};
const SENSITIVE_SUFFIXES = new Set(['birth_date', 'license_number', 'license_date', 'ss_number', 'nationality']);
const MONEY_WORDS = ['amount', 'price', 'rate', 'salary', 'gratification', 'rent', 'cost', 'value', 'prix', 'montant', 'tarif', 'salaire', 'caution', 'loyer'];
const INTEGER_WORDS = ['days', 'months', 'weeks', 'years', 'hours', 'year', 'limit', 'mileage', 'terms', 'jours', 'mois', 'semaines', 'heures'];

/** Objet de la prestation, montants et durées : lus sur le service, la commande ou la tarification. */
const SERVICE_SOURCES: Record<string, string[]> = {
  vehicle_brand: ['service.attributes.vehicle_brand'], vehicle_model: ['service.attributes.vehicle_model'],
  vehicle_plate: ['service.attributes.vehicle_plate'], vehicle_year: ['service.attributes.vehicle_year'],
  vehicle_mileage_start: ['service.attributes.vehicle_mileage'],
  equipment_description: ['service.attributes.equipment_label', 'service.description', 'service.title'],
  equipment_value: ['service.attributes.equipment_value'],
  deposit_amount: ['transaction.pricing.deposit', 'service.attributes.deposit_amount'],
  // Conditions de règlement (libs/shared/payment-terms) : phrase et acompte à la commande — jamais la
  // caution. `payment_terms` reste le DÉLAI en jours des modèles standards (clause du prestataire).
  payment_conditions: ['transaction.paymentTerms'],
  down_payment_amount: ['transaction.schedule.downPayment'],
  franchise_amount: ['service.attributes.franchise_amount'],
  mileage_limit: ['service.attributes.mileage_included'],
  mileage_extra_cost: ['service.attributes.mileage_extra_cost'],
  pickup_location: ['service.attributes.pickup_location', 'transaction.booking.location'],
  return_location: ['service.attributes.return_location', 'service.attributes.pickup_location'],
  delivery_location: ['service.attributes.pickup_location', 'transaction.booking.location'],
  daily_rate: ['transaction.pricing.unitRate', 'service.attributes.rate_day', 'service.price'],
  price_amount: ['transaction.amount', 'service.price'],
  fixed_price: ['transaction.amount', 'service.price'],
  monthly_rent: ['service.attributes.rate_month', 'service.price'],
  mission_scope: ['service.attributes.mission_scope', 'service.description'],
  mission_description: ['service.attributes.mission_scope', 'service.description'],
  project_description: ['service.attributes.mission_scope', 'service.description'],
  purpose: ['service.attributes.mission_scope', 'service.description', 'service.title'],
  subcontracted_work: ['service.attributes.mission_scope', 'service.description'],
  deliverables: ['service.attributes.deliverables'],
};
const SERVICE_ROLES: Record<string, FieldRole> = { daily_rate: 'unit_rate', deposit_amount: 'deposit', price_amount: 'total', fixed_price: 'total' };
const CONTRACT_SOURCES: Record<string, string[]> = { contract_date: ['contract.date'], document_date: ['contract.date'], contract_ref: ['contract.reference'] };
const CITY_KEYS = new Set(['contract_location', 'document_location']);
const PERIOD_KEYS: Record<string, FieldRole> = { start_date: 'period_start', subscription_start_date: 'period_start', end_date: 'period_end', termination_date: 'period_end' };

const has = (key: string, words: RegExp) => words.test(`_${key}_`);
const CLIENT_WORDS = /_(client|locataire|acheteur|preneur|beneficiaire|customer|buyer|renter|tenant)_/;
const ORG_WORDS = /_(prestataire|societe|entreprise|organisation|organization|vendeur|bailleur|loueur|seller|lessor)_/;
const SENSITIVE_WORDS = /_(permis|license|licence|naissance|birth|securite_sociale|ss|passeport|passport|identite|iban|nationalite|nationality)_/;

/** Format d'une variable : type du modèle, précisé par le nom (montant, entier, pourcentage). */
function formatOf(key: string, def: Record<string, any>): FieldFormat {
  const type = typeof def.type === 'string' && def.type ? def.type : inferVariableType(key);
  if (type === 'select') return Array.isArray(def.options) && def.options.length ? 'select' : 'text';
  if (type === 'date' || type === 'textarea' || type === 'email') return type;
  if (type === 'number') {
    if (key.endsWith('_pct')) return 'percent';
    if (MONEY_WORDS.some((w) => key.includes(w))) return 'money';
    if (INTEGER_WORDS.some((w) => key.endsWith(w) || key.includes(`_${w}_`))) return 'integer';
    return 'number';
  }
  return 'text';
}

/** Règles d'un contrat libre, pour une variable qu'aucune règle des modèles standards ne couvre. */
function inferFreeBinding(key: string, format: FieldFormat, ctx: InferContext): Record<string, any> {
  if (has(key, SENSITIVE_WORDS)) return { block: 'client', format, sensitive: true };
  if (has(key, /_(caution|deposit|depot)_/) && format === 'money') return { block: 'service', sources: ['transaction.pricing.deposit', 'service.attributes.deposit_amount'], format };
  if (has(key, /_(acompte|down_payment|downpayment)_/) && format === 'money') return { block: 'service', sources: ['transaction.schedule.downPayment'], format };
  if (has(key, /_(conditions_de_reglement|conditions_de_paiement|modalites_de_paiement|payment_conditions|echeancier)_/)) return { block: 'service', sources: ['transaction.paymentTerms'], format };
  if (format === 'money' && has(key, /_(journalier|jour|daily|day)_/)) return { block: 'service', sources: ['transaction.pricing.unitRate', 'service.attributes.rate_day', 'service.price'], format };
  if (format === 'money' && has(key, /_(horaire|heure|hourly|hour)_/)) return { block: 'service', sources: ['service.attributes.rate_hour', 'service.price'], format };
  if (format === 'money' && has(key, /_(prix|price|montant|amount|total|tarif|cout|cost|honoraires|fee|fees)_/)) return { block: 'service', sources: ['transaction.amount', 'service.price'], format };
  if (format === 'date') {
    if (has(key, /_(debut|start|commencement|arrivee)_/)) return { block: 'client', sources: ['transaction.booking.startDate'], format, question: 'Date de début souhaitée' };
    if (has(key, /_(fin|end|retour|echeance)_/)) return { block: 'client', sources: ['transaction.booking.endDate'], format, question: 'Date de fin souhaitée' };
    if (key === 'date' || has(key, /_(contrat|signature)_/)) return { block: 'contract', sources: ['contract.date'], format };
  }
  if (has(key, /_(lieu|ville|fait_a)_/) || key === 'fait_a') return { block: 'organization', sources: ['organization.city'], format: 'text' };
  if (has(key, CLIENT_WORDS)) {
    const src = has(key, /_(email|mail|courriel)_/) ? ['client.email'] : has(key, /_(tel|telephone|phone|mobile)_/) ? ['client.phone']
      : has(key, /_(adresse|address)_/) ? ['client.address'] : has(key, /_(societe|entreprise|company)_/) ? ['client.company']
      : has(key, /_(nom|name)_/) ? ['client.name'] : null;
    return { block: 'client', ...(src ? { sources: src } : {}), format };
  }
  if (has(key, ORG_WORDS) || /^(raison_sociale|siret|siren|rcs|numero_tva|tva_intracom)/.test(key)) {
    const src = has(key, /_(siret|siren)_/) ? ['organization.siret'] : has(key, /_rcs_/) ? ['organization.rcs', 'organization.siret']
      : has(key, /_(email|mail|courriel)_/) ? ['organization.email'] : has(key, /_(tel|telephone|phone)_/) ? ['organization.phone']
      : has(key, /_(adresse|address)_/) ? ['organization.address'] : has(key, /_(representant|representative)_/) ? ['organization.representative']
      : has(key, /_(nom|name|raison_sociale)_/) || key.startsWith('raison_sociale') ? ['organization.legalName'] : null;
    if (src) return { block: 'organization', sources: src, format: format === 'email' ? 'email' : 'text' };
    return { block: 'provider', format };
  }
  // Inconnue : une clause (valeur par défaut, montant, pourcentage) est fixée par le prestataire ;
  // le reste est demandé au client.
  if (ctx.hasDefault || format === 'money' || format === 'percent' || format === 'select') return { block: 'provider', format };
  return { block: 'client', format };
}

/**
 * Liaison déduite d'une variable : préfixes des parties, objet de la prestation, date et référence
 * du contrat, puis (contrat libre) mots du nom. Résultat brut, sans `locked` (voir `bindingOf`).
 */
export function inferBinding(key: string, rawDef: unknown, ctx: InferContext = {}): Record<string, any> {
  const def = isObject(rawDef) ? rawDef : {};
  const me = ctx.selfRole || 'provider';
  const other = ctx.counterpartyRole || 'client';
  const base = ctx.templateBase ?? null;
  const f = formatOf(key, def);
  let b: Record<string, any>;
  if (CONTRACT_SOURCES[key]) b = { block: 'contract', sources: CONTRACT_SOURCES[key], format: key === 'contract_ref' ? 'text' : 'date' };
  else if (CITY_KEYS.has(key)) b = { block: 'organization', sources: ['organization.city'], format: 'text' };
  else if (PERIOD_KEYS[key]) {
    const role = PERIOD_KEYS[key];
    const source = `transaction.booking.${role === 'period_start' ? 'startDate' : 'endDate'}`;
    if (base && RENTAL_TEMPLATES.has(base)) b = { block: 'client', sources: [source], format: 'date', role };
    else if (base && EMPLOYER_TEMPLATES.has(base)) b = { block: 'provider', format: 'date', role };
    else b = { block: 'client', sources: [source], format: 'date', role, question: role === 'period_start' ? 'Date de début souhaitée' : 'Date de fin souhaitée' };
  } else if (SERVICE_SOURCES[key]) {
    b = { block: 'service', sources: SERVICE_SOURCES[key], format: f, ...(SERVICE_ROLES[key] ? { role: SERVICE_ROLES[key] } : {}) };
  } else if (key.startsWith(`${me}_`)) {
    const suffix = key.slice(me.length + 1);
    b = SELF_SUFFIX_SOURCES[suffix] ? { block: 'organization', sources: SELF_SUFFIX_SOURCES[suffix], format: f === 'select' ? 'text' : f } : { block: 'provider', format: f };
  } else if (key.startsWith(`${other}_`)) {
    const suffix = key.slice(other.length + 1);
    b = { block: 'client', format: f, ...(CLIENT_SUFFIX_SOURCES[suffix] ? { sources: CLIENT_SUFFIX_SOURCES[suffix] } : {}), ...(SENSITIVE_SUFFIXES.has(suffix) ? { sensitive: true } : {}) };
  } else if (base === 'internship-agreement' && (key.startsWith('school_') || key === 'academic_tutor')) {
    b = { block: 'client', format: f };
  } else if (ctx.standard) {
    b = { block: 'provider', format: f };
  } else {
    b = inferFreeBinding(key, f, ctx);
  }
  if (b.block === 'organization' && b.format === 'select') b.format = 'text';
  return b;
}

export interface CompleteDefsInput {
  /** Sections du contrat (pour trouver les variables utilisées dans le texte). */
  sections: unknown;
  /** Définitions existantes (`content.variableDefs`). */
  defs: Record<string, unknown> | null | undefined;
  ctx?: InferContext;
  /** Liaisons du modèle standard d'origine, prioritaires sur l'inférence pour ses variables. */
  baseBindings?: Record<string, unknown> | null;
  /** Valeurs par défaut connues (valeurs du contrat ou du modèle d'organisation). */
  defaults?: Record<string, unknown> | null;
}

/**
 * Définitions complètes d'un contrat : chaque variable du texte en a une (libellé, type,
 * obligatoire), et chaque définition porte une liaison valide. Une liaison donnée et cohérente
 * est gardée ; une liaison absente ou incohérente est remplacée par celle du modèle standard
 * d'origine, sinon par `inferBinding`. `replaced` liste les liaisons incohérentes remplacées.
 * Une clé invalide est ignorée. Ne modifie pas l'entrée.
 */
export function completeVariableDefs(input: CompleteDefsInput): { defs: Record<string, Record<string, any>>; added: string[]; replaced: string[] } {
  const source = isObject(input.defs) ? input.defs : {};
  const defaults = isObject(input.defaults) ? input.defaults : {};
  const out: Record<string, Record<string, any>> = {};
  const added: string[] = [];
  const replaced: string[] = [];
  const keys = [...Object.keys(source)];
  const inText = extractVariableKeys(input.sections);
  for (const k of inText) if (!keys.includes(k)) keys.push(k);
  for (const key of keys) {
    if (!VARIABLE_KEY_RE.test(key)) continue;
    const existing = isObject(source[key]) ? source[key] as Record<string, any> : null;
    const def: Record<string, any> = existing
      ? { ...existing, key }
      : { key, label: humanizeVariableKey(key), type: inferVariableType(key), required: inText.includes(key) };
    if (!existing) added.push(key);
    const hasDefault = (def.default !== undefined && def.default !== null && String(def.default) !== '')
      || (defaults[key] !== undefined && defaults[key] !== null && String(defaults[key]).trim() !== '');
    if (def.binding !== undefined) {
      const issues = validateTemplateBindings({ [key]: def }).filter((i) => i.code !== 'NO_BINDING');
      if (!issues.length) { out[key] = def; continue; }
      replaced.push(key);
    }
    const fromBase = input.baseBindings && isObject(input.baseBindings[key]) ? input.baseBindings[key] : null;
    def.binding = fromBase ?? inferBinding(key, def, { ...(input.ctx ?? {}), hasDefault });
    out[key] = def;
  }
  // Un rôle de calcul (tarif, total, période…) ne vaut que pour une variable : les suivantes le perdent.
  const roles = new Set<string>();
  for (const [key, def] of Object.entries(out)) {
    const role = isObject(def.binding) ? def.binding.role : undefined;
    if (typeof role !== 'string') continue;
    if (roles.has(role)) {
      const { role: _dropped, ...rest } = def.binding;
      out[key] = { ...def, binding: rest };
      if (!replaced.includes(key)) replaced.push(key);
    } else roles.add(role);
  }
  return { defs: out, added, replaced };
}
