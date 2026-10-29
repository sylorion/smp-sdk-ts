/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/payment-terms/payment-terms.ts
   │  Régénérer        : ./scripts/sync-payment-terms.sh                      │
   │  Vérifier (CI)    : ./scripts/sync-payment-terms.sh --check              │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

// libs/shared/payment-terms/payment-terms.ts
//
// CONDITIONS DE RÈGLEMENT d'un service — source de vérité unique, recopiée à
// l'identique par `scripts/sync-payment-terms.sh` (même raison que `pricing` :
// les images Docker des services ne voient pas `libs/`).
//
// Ce que décrit ce module (docs/metier/modele-metier.md, « Conditions de règlement ») :
//
//   Service.advancedAttributes.paymentTerms   ce que le prestataire PROPOSE par défaut
//       ↓ copie à la création du devis / de la commande
//   Estimate.details.paymentTerms             ce qui est NÉGOCIÉ, figé à l'acceptation
//   Order.billingInformation.paymentSchedule  l'échéancier CHIFFRÉ (centimes) de la vente
//   Engagement.metadata.paymentSchedule       le même échéancier, suivi échéance par échéance
//   Invoice.transactionData.installment       la facture d'acompte / de solde / de jalon
//
// Une modification du service ne touche jamais un devis accepté ni un engagement : chaque
// objet porte sa copie (snapshot), ce module ne fait que la produire et la vérifier.
//
// Modes retenus pour la V1 (prestations intellectuelles et événementiel) :
//   full_upfront       intégral à la commande (défaut historique de la plateforme)
//   down_payment_balance    acompte à la commande, solde à la fin / à une date / au démarrage
//   installments       échéancier libre : commande, démarrage, date, jalon, fin
//   on_completion      intégral à la fin (facture à l'issue, délai de paiement B2B)
//   time_and_materials régie : facturé sur relevé de temps validé (pipeline relevé de temps)
//
// Taxonomie (une opération = un nom, en code comme en français) :
//   down payment / « acompte » : somme versée par le client AVANT la fin, ferme (jamais des
//     arrhes), toujours facturée (facture d'acompte, TVA exigible à l'encaissement, art. 269 CGI) ;
//   balance / « solde » : dernière échéance, qui déduit les acomptes facturés ;
//   milestone / « jalon » : échéance déclenchée par la validation d'un livrable par le client ;
//   deposit / « caution » : garantie restituable (`transaction.pricing.deposit`, flows de location),
//     JAMAIS une échéance de ce module ;
//   advance / « avance » : versement AU PRESTATAIRE avant réalisation (wallet, lot P2), hors module.
//
// Montants : ENTIERS EN CENTIMES (×100 même pour XAF/XOF, convention plateforme) ;
// pour une devise sans décimale, chaque échéance est arrondie à l'unité (multiple de 100)
// et la dernière absorbe l'écart : la somme des échéances est toujours exactement le total.

export const PAYMENT_MODES = ['full_upfront', 'down_payment_balance', 'installments', 'on_completion', 'time_and_materials'] as const;
export type PaymentMode = (typeof PAYMENT_MODES)[number];

export const INSTALLMENT_TRIGGERS = ['on_order', 'on_start', 'on_date', 'on_milestone', 'on_completion'] as const;
export type InstallmentTrigger = (typeof INSTALLMENT_TRIGGERS)[number];

/** Délais de paiement admis (C. com. L441-10) : comptant, 30 j, 45 j fin de mois, 60 j. */
export const PAYMENT_DELAYS = [0, 30, 45, 60] as const;
export type PaymentDelayDays = (typeof PAYMENT_DELAYS)[number];

export const INSTALLMENT_STATUSES = ['pending', 'due', 'invoiced', 'paid', 'cancelled'] as const;
export type InstallmentStatus = (typeof INSTALLMENT_STATUSES)[number];

/** Formes de souscription et facturations du catalogue (mêmes valeurs que mu-catalog). */
export type UptakeForm = 'instant' | 'periodic' | 'prestation' | 'booking_required';
export type BillingPlan = 'usage' | 'mixed' | 'direct' | 'minute' | 'unit' | 'hourly' | 'dayly' | 'mensual' | 'trimestrial' | 'semestrial' | 'annual';

/** Une échéance, en pourcentage du total. */
export interface InstallmentSpec {
  /** Clé stable (snake_case, ≤ 32 car.), unique dans l'échéancier. */
  key: string;
  /** Libellé affiché (devis, facture) ; sinon libellé par défaut du déclencheur. */
  label?: string;
  /** Part du total, entier de 1 à 100. */
  percent: number;
  trigger: InstallmentTrigger;
  /** `on_date` : jours par rapport à la date de début de la prestation (négatif = avant). */
  daysOffset?: number;
  /** `on_milestone` : clé du jalon (EngagementMilestone) dont la validation déclenche l'échéance. */
  milestoneKey?: string;
}

/** Palier d'annulation : à moins de `daysBefore` jours du début, `retainedPercent` du total reste dû. */
export interface CancellationTier {
  daysBefore: number;
  retainedPercent: number;
}

export interface PaymentTerms {
  mode: PaymentMode;
  /** `down_payment_balance` : part de l'acompte (défaut 30). */
  downPaymentPercent?: number;
  /** `down_payment_balance` : quand le solde est dû (défaut `on_completion`). */
  balanceTrigger?: Exclude<InstallmentTrigger, 'on_order' | 'on_milestone'>;
  /** `down_payment_balance` + `balanceTrigger = on_date` : jours par rapport au début (ex. -7 = J-7). */
  balanceDaysOffset?: number;
  /** `installments` : l'échéancier (somme des parts = 100). */
  installments?: InstallmentSpec[];
  /** Délai de paiement des factures d'échéance (défaut 30). 45 = 45 jours fin de mois. */
  paymentDelayDays?: PaymentDelayDays;
  /** Barème d'annulation (paliers décroissants), appliqué au total contractuel. */
  cancellation?: CancellationTier[];
}

/** Échéance chiffrée d'une vente. */
export interface ScheduledInstallment extends InstallmentSpec {
  label: string;
  amountCents: number;
  status: InstallmentStatus;
  /** Date d'exigibilité connue d'avance (`on_order`, `on_date`, `on_start` avec date), ISO ; sinon null. */
  dueAt: string | null;
  /** Facture d'échéance (mu-billing) une fois émise. */
  invoiceId?: string | null;
  paidAt?: string | null;
}

export interface PaymentSchedule {
  version: 1;
  mode: PaymentMode;
  currency: string;
  /** Total contractuel TTC acheteur (ce que paie le client, commission comprise), en centimes. */
  totalCents: number;
  /** Ce qui doit être encaissé à la commande (0 si rien n'est dû d'avance). */
  dueNowCents: number;
  paymentDelayDays: PaymentDelayDays;
  installments: ScheduledInstallment[];
  cancellation: CancellationTier[];
  /** Conditions négociées dont l'échéancier est issu (copie). */
  terms: PaymentTerms;
  /**
   * Qui règle les échéances : `client` (défaut, absent) — chaque échéance est facturée au client ;
   * `pm_plan` — le client a réglé le plan Project Manager en une fois, les échéances sont
   * VERSÉES au prestataire depuis le séquestre de la plateforme, sans facture d'échéance.
   */
  fundedBy?: ScheduleFunding;
}

export type ScheduleFunding = 'client' | 'pm_plan';

/** Les échéances de cet échéancier sont-elles versées depuis le séquestre d'un plan PM ? */
export function isPlanFunded(schedule: Pick<PaymentSchedule, 'fundedBy'> | null | undefined): boolean {
  return schedule?.fundedBy === 'pm_plan';
}

export const DEFAULT_DOWN_PAYMENT_PERCENT = 30;
export const DEFAULT_PAYMENT_DELAY: PaymentDelayDays = 30;
export const MAX_INSTALLMENTS = 12;

export const DEFAULT_PAYMENT_TERMS: Readonly<PaymentTerms> = Object.freeze({ mode: 'full_upfront', paymentDelayDays: 0 });

const TRIGGER_LABELS_FR: Record<InstallmentTrigger, string> = {
  on_order: 'Acompte à la commande',
  on_start: 'Au démarrage de la prestation',
  on_date: 'À date',
  on_milestone: 'À la validation du jalon',
  on_completion: 'Solde à la fin de la prestation',
};

const MODE_LABELS_FR: Record<PaymentMode, string> = {
  full_upfront: 'Paiement intégral à la commande',
  down_payment_balance: 'Acompte à la commande, solde ensuite',
  installments: 'Paiement échelonné',
  on_completion: 'Paiement intégral à la fin de la prestation',
  time_and_materials: 'Régie : facturation sur relevé de temps validé',
};

export const PAYMENT_MODE_LABELS_FR: Readonly<Record<PaymentMode, string>> = MODE_LABELS_FR;

const isObject = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const isInt = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);

// ─── Modes admis selon les réglages du service ───────────────────────────────

/**
 * Modes exécutables selon la modalité d'achat : un instantané ou un abonnement sont
 * encaissés d'un coup ; une réservation peut être réservée avec un acompte ou échelonnée
 * (salle, traiteur) ; un service sur devis accepte tous les modes, la régie n'ayant de sens
 * qu'avec une facturation au temps (`hourly`, `dayly`, `usage`).
 */
export function allowedPaymentModes(uptakeForm: UptakeForm | string | null | undefined, billingPlan?: BillingPlan | string | null): readonly PaymentMode[] {
  switch (uptakeForm) {
    case 'prestation':
      return isTimeBilling(billingPlan)
        ? PAYMENT_MODES
        : PAYMENT_MODES.filter((m) => m !== 'time_and_materials');
    case 'booking_required':
      return ['full_upfront', 'down_payment_balance', 'installments'];
    case 'instant':
    case 'periodic':
    default:
      return ['full_upfront'];
  }
}

export function isTimeBilling(billingPlan?: BillingPlan | string | null): boolean {
  return billingPlan === 'hourly' || billingPlan === 'dayly' || billingPlan === 'usage' || billingPlan === 'minute';
}

/** Conditions proposées par défaut à un service qui n'en déclare pas. */
export function defaultPaymentTermsFor(uptakeForm: UptakeForm | string | null | undefined, billingPlan?: BillingPlan | string | null): PaymentTerms {
  if (uptakeForm === 'prestation') {
    if (isTimeBilling(billingPlan)) return { mode: 'time_and_materials', paymentDelayDays: DEFAULT_PAYMENT_DELAY };
    return { mode: 'down_payment_balance', downPaymentPercent: DEFAULT_DOWN_PAYMENT_PERCENT, balanceTrigger: 'on_completion', paymentDelayDays: DEFAULT_PAYMENT_DELAY };
  }
  return { ...DEFAULT_PAYMENT_TERMS };
}

/**
 * Conditions EFFECTIVES d'un service : celles déclarées sur sa fiche si elles sont valides pour
 * son mode de vente (forme canonique), sinon les défauts du mode de vente. Même règle dans
 * mu-catalog (exposition GraphQL) et mu-command (snapshot de la commande).
 */
export function effectivePaymentTerms(declared: unknown, ctx?: { uptakeForm?: string | null; billingPlan?: string | null } | null): PaymentTerms {
  const t = parsePaymentTerms(declared);
  // Sans mode de vente connu, aucun mode n'est interdit (conditions négociées d'un devis).
  const restrict = ctx && ctx.uptakeForm ? ctx : undefined;
  if (t && validatePaymentTerms(t, restrict).length === 0) return normalizePaymentTerms(t, restrict);
  return defaultPaymentTermsFor(ctx?.uptakeForm, ctx?.billingPlan);
}

// ─── Lecture et validation ───────────────────────────────────────────────────

export interface PaymentTermsIssue {
  code:
  | 'MODE_UNKNOWN'
  | 'MODE_NOT_ALLOWED'
  | 'DOWN_PAYMENT_PERCENT_INVALID'
  | 'BALANCE_TRIGGER_INVALID'
  | 'INSTALLMENTS_EMPTY'
  | 'INSTALLMENTS_TOO_MANY'
  | 'INSTALLMENT_KEY_INVALID'
  | 'INSTALLMENT_KEY_DUPLICATE'
  | 'INSTALLMENT_PERCENT_INVALID'
  | 'INSTALLMENT_TRIGGER_INVALID'
  | 'INSTALLMENT_OFFSET_INVALID'
  | 'INSTALLMENT_MILESTONE_MISSING'
  | 'INSTALLMENTS_SUM_NOT_100'
  | 'INSTALLMENTS_MULTIPLE_ON_ORDER'
  | 'PAYMENT_DELAY_INVALID'
  | 'CANCELLATION_INVALID';
  message: string;
  field?: string;
}

const KEY_RE = /^[a-z][a-z0-9_]{0,31}$/;

/** Valeur brute (objet JSON, chaîne JSON ou rien) → `PaymentTerms` non validé, ou null. */
export function parsePaymentTerms(raw: unknown): PaymentTerms | null {
  let value: unknown = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!isObject(value) || typeof value.mode !== 'string') return null;
  return value as unknown as PaymentTerms;
}

/**
 * Vérifie des conditions. `ctx` (réglages du service) restreint les modes admis ; sans
 * contexte, tous les modes sont admis (devis négocié, lecture d'un snapshot).
 */
export function validatePaymentTerms(terms: unknown, ctx?: { uptakeForm?: string | null; billingPlan?: string | null }): PaymentTermsIssue[] {
  const issues: PaymentTermsIssue[] = [];
  const t = parsePaymentTerms(terms);
  if (!t || !(PAYMENT_MODES as readonly string[]).includes(t.mode)) {
    return [{ code: 'MODE_UNKNOWN', field: 'mode', message: `Mode de règlement inconnu (${PAYMENT_MODES.join(', ')}).` }];
  }
  if (ctx && !allowedPaymentModes(ctx.uptakeForm, ctx.billingPlan).includes(t.mode)) {
    issues.push({ code: 'MODE_NOT_ALLOWED', field: 'mode', message: `Le mode « ${MODE_LABELS_FR[t.mode]} » n'est pas disponible pour ce mode de vente.` });
  }
  if (t.paymentDelayDays !== undefined && !(PAYMENT_DELAYS as readonly number[]).includes(t.paymentDelayDays as number)) {
    issues.push({ code: 'PAYMENT_DELAY_INVALID', field: 'paymentDelayDays', message: `Délai de paiement admis : ${PAYMENT_DELAYS.join(', ')} jours.` });
  }
  if (t.mode === 'down_payment_balance') {
    const p = t.downPaymentPercent ?? DEFAULT_DOWN_PAYMENT_PERCENT;
    if (!isInt(p) || p < 1 || p > 99) issues.push({ code: 'DOWN_PAYMENT_PERCENT_INVALID', field: 'downPaymentPercent', message: "L'acompte est un pourcentage entier entre 1 et 99." });
    const bt = t.balanceTrigger ?? 'on_completion';
    if (!['on_completion', 'on_start', 'on_date'].includes(bt)) issues.push({ code: 'BALANCE_TRIGGER_INVALID', field: 'balanceTrigger', message: 'Le solde est dû à la fin, au démarrage ou à une date.' });
    if (bt === 'on_date' && !isInt(t.balanceDaysOffset)) issues.push({ code: 'INSTALLMENT_OFFSET_INVALID', field: 'balanceDaysOffset', message: 'Indiquer le nombre de jours par rapport au début (ex. -7).' });
  }
  if (t.mode === 'installments') {
    const list = Array.isArray(t.installments) ? t.installments : [];
    if (list.length === 0) issues.push({ code: 'INSTALLMENTS_EMPTY', field: 'installments', message: 'Un échéancier a au moins une échéance.' });
    if (list.length > MAX_INSTALLMENTS) issues.push({ code: 'INSTALLMENTS_TOO_MANY', field: 'installments', message: `Au plus ${MAX_INSTALLMENTS} échéances.` });
    const keys = new Set<string>();
    let sum = 0;
    let onOrder = 0;
    list.forEach((i, idx) => {
      const f = `installments[${idx}]`;
      if (!isObject(i)) { issues.push({ code: 'INSTALLMENT_KEY_INVALID', field: f, message: 'Échéance illisible.' }); return; }
      if (typeof i.key !== 'string' || !KEY_RE.test(i.key)) issues.push({ code: 'INSTALLMENT_KEY_INVALID', field: `${f}.key`, message: 'Clé d\'échéance : snake_case, 32 caractères max.' });
      else if (keys.has(i.key)) issues.push({ code: 'INSTALLMENT_KEY_DUPLICATE', field: `${f}.key`, message: `Clé d'échéance en double : ${i.key}.` });
      else keys.add(i.key);
      if (!isInt(i.percent) || i.percent < 1 || i.percent > 100) issues.push({ code: 'INSTALLMENT_PERCENT_INVALID', field: `${f}.percent`, message: 'Part : pourcentage entier entre 1 et 100.' });
      else sum += i.percent;
      if (!(INSTALLMENT_TRIGGERS as readonly string[]).includes(String(i.trigger))) issues.push({ code: 'INSTALLMENT_TRIGGER_INVALID', field: `${f}.trigger`, message: `Déclencheur inconnu (${INSTALLMENT_TRIGGERS.join(', ')}).` });
      if (i.trigger === 'on_order') onOrder += 1;
      if (i.trigger === 'on_date' && !isInt(i.daysOffset)) issues.push({ code: 'INSTALLMENT_OFFSET_INVALID', field: `${f}.daysOffset`, message: 'Une échéance à date indique un décalage en jours par rapport au début.' });
      if (i.trigger === 'on_milestone' && (typeof i.milestoneKey !== 'string' || !KEY_RE.test(i.milestoneKey))) issues.push({ code: 'INSTALLMENT_MILESTONE_MISSING', field: `${f}.milestoneKey`, message: 'Une échéance par jalon nomme son jalon (clé snake_case).' });
    });
    if (list.length > 0 && sum !== 100) issues.push({ code: 'INSTALLMENTS_SUM_NOT_100', field: 'installments', message: `La somme des parts doit faire 100 % (actuellement ${sum} %).` });
    if (onOrder > 1) issues.push({ code: 'INSTALLMENTS_MULTIPLE_ON_ORDER', field: 'installments', message: 'Une seule échéance à la commande.' });
  }
  if (t.cancellation !== undefined) {
    const tiers = Array.isArray(t.cancellation) ? t.cancellation : null;
    const ok = !!tiers && tiers.every((c) => isObject(c) && isInt(c.daysBefore) && c.daysBefore >= 0 && isInt(c.retainedPercent) && c.retainedPercent >= 0 && c.retainedPercent <= 100);
    if (!ok) issues.push({ code: 'CANCELLATION_INVALID', field: 'cancellation', message: 'Barème d\'annulation : paliers { daysBefore ≥ 0, retainedPercent 0-100 }.' });
  }
  return issues;
}

/** Conditions complètes (défauts appliqués), sans clé inconnue. Lève si invalide. */
export function normalizePaymentTerms(terms: unknown, ctx?: { uptakeForm?: string | null; billingPlan?: string | null }): PaymentTerms {
  const issues = validatePaymentTerms(terms, ctx);
  if (issues.length) throw new Error(issues.map((i) => i.message).join(' '));
  const t = parsePaymentTerms(terms) as PaymentTerms;
  const out: PaymentTerms = { mode: t.mode, paymentDelayDays: t.paymentDelayDays ?? (t.mode === 'full_upfront' ? 0 : DEFAULT_PAYMENT_DELAY) };
  if (t.mode === 'down_payment_balance') {
    out.downPaymentPercent = t.downPaymentPercent ?? DEFAULT_DOWN_PAYMENT_PERCENT;
    out.balanceTrigger = t.balanceTrigger ?? 'on_completion';
    if (out.balanceTrigger === 'on_date') out.balanceDaysOffset = t.balanceDaysOffset;
  }
  if (t.mode === 'installments') {
    out.installments = (t.installments ?? []).map((i) => {
      const s: InstallmentSpec = { key: i.key, percent: i.percent, trigger: i.trigger };
      if (typeof i.label === 'string' && i.label.trim()) s.label = i.label.trim().slice(0, 120);
      if (i.trigger === 'on_date') s.daysOffset = i.daysOffset;
      if (i.trigger === 'on_milestone') s.milestoneKey = i.milestoneKey;
      return s;
    });
  }
  if (Array.isArray(t.cancellation) && t.cancellation.length) {
    out.cancellation = [...t.cancellation]
      .map((c) => ({ daysBefore: c.daysBefore, retainedPercent: c.retainedPercent }))
      .sort((a, b) => b.daysBefore - a.daysBefore);
  }
  return out;
}

// ─── Échéancier ──────────────────────────────────────────────────────────────

/** Échéances canoniques d'un mode (en pourcentage), avant chiffrage. */
/**
 * Un acheteur IDENTIFIÉ (compte) est-il nécessaire pour ces conditions ? Oui dès qu'il reste
 * quelque chose à régler APRÈS la commande (solde, jalon à valider, échéance datée, relevés de
 * temps) : la plateforme doit pouvoir lui adresser les factures, lui faire valider un jalon, lui
 * ouvrir un litige. Seul « intégral à la commande » admet une commande d'invité.
 */
export function requiresIdentifiedBuyer(terms: PaymentTerms): boolean {
  if (terms.mode === 'time_and_materials') return true;
  return installmentsOf(terms).some((i) => i.trigger !== 'on_order');
}

/** Même règle sur un échéancier chiffré : il reste un dû après la commande. */
export function scheduleRequiresIdentifiedBuyer(schedule: PaymentSchedule | null | undefined): boolean {
  if (!schedule) return false;
  if (schedule.mode === 'time_and_materials') return true;
  return schedule.installments.some((i) => i.trigger !== 'on_order' && i.status !== 'cancelled');
}

export function installmentsOf(terms: PaymentTerms): InstallmentSpec[] {
  switch (terms.mode) {
    case 'full_upfront':
      return [{ key: 'full', percent: 100, trigger: 'on_order', label: 'Paiement intégral à la commande' }];
    case 'on_completion':
      return [{ key: 'balance', percent: 100, trigger: 'on_completion', label: 'Paiement intégral à la fin de la prestation' }];
    case 'down_payment_balance': {
      const downPayment = terms.downPaymentPercent ?? DEFAULT_DOWN_PAYMENT_PERCENT;
      const trigger = terms.balanceTrigger ?? 'on_completion';
      const balance: InstallmentSpec = { key: 'balance', percent: 100 - downPayment, trigger, label: trigger === 'on_completion' ? 'Solde à la fin de la prestation' : trigger === 'on_start' ? 'Solde au démarrage' : `Solde à J${formatOffset(terms.balanceDaysOffset ?? 0)}` };
      if (trigger === 'on_date') balance.daysOffset = terms.balanceDaysOffset ?? 0;
      return [{ key: 'down_payment', percent: downPayment, trigger: 'on_order', label: `Acompte de ${downPayment} % à la commande` }, balance];
    }
    case 'installments':
      return (terms.installments ?? []).map((i) => ({ ...i }));
    case 'time_and_materials':
    default:
      return [];
  }
}

function formatOffset(days: number): string {
  if (days === 0) return '';
  return days > 0 ? `+${days}` : `${days}`;
}

export function installmentLabel(spec: InstallmentSpec): string {
  if (spec.label && spec.label.trim()) return spec.label.trim();
  if (spec.trigger === 'on_date') return `Échéance à J${formatOffset(spec.daysOffset ?? 0)}`;
  if (spec.trigger === 'on_milestone') return `À la validation du jalon « ${spec.milestoneKey ?? ''} »`;
  if (spec.trigger === 'on_order') return `Acompte de ${spec.percent} % à la commande`;
  return TRIGGER_LABELS_FR[spec.trigger];
}

/** Devises sans subdivision : les montants (×100) sont arrondis à l'unité. */
export const ZERO_DECIMAL_CURRENCIES: readonly string[] = ['XAF', 'XOF'];

function roundingUnit(currency: string): number {
  return ZERO_DECIMAL_CURRENCIES.includes(String(currency || '').toUpperCase()) ? 100 : 1;
}

export interface ScheduleOptions {
  /** Date de début de la prestation (réservation, mission) : calcule `dueAt` des échéances à date. */
  startDate?: Date | string | null;
  /** Date de la commande (défaut : maintenant). */
  orderedAt?: Date | string | null;
  /** Mode de règlement des échéances (plan PM : versements depuis le séquestre). */
  fundedBy?: ScheduleFunding;
}

/**
 * Répartit `baseCents` entre des parts en pourcentage : chaque part est arrondie (à l'unité
 * pour XAF/XOF), la dernière absorbe l'écart — la somme vaut exactement la base. La même
 * règle sert à l'échéancier (sur le prix TTC contractuel) et aux factures d'échéance (sur le HT),
 * pour que les deux restent cohérents au centime près.
 */
export function allocateByPercent(parts: ReadonlyArray<{ percent: number }>, baseCents: number, currency: string): number[] {
  if (!isInt(baseCents) || baseCents < 0) throw new Error('allocateByPercent : base en centimes entière et positive attendue.');
  const unit = roundingUnit(currency);
  let allocated = 0;
  return parts.map((part, idx) => {
    const isLast = idx === parts.length - 1;
    let amount = isLast ? baseCents - allocated : Math.round((baseCents * part.percent) / 100 / unit) * unit;
    if (!isLast) amount = Math.min(amount, baseCents - allocated);
    allocated += amount;
    return amount;
  });
}

/**
 * Chiffre l'échéancier d'une vente. `totalCents` est le prix CONTRACTUEL (HT + TVA, ce que vaut
 * la prestation entre client et prestataire — `Order.totalPrice`) ; la commission de la
 * plateforme et les frais de paiement s'ajoutent à chaque encaissement (`libs/shared/pricing`).
 * Chaque part est arrondie ; la dernière absorbe l'écart, la somme vaut exactement le total.
 */
export function buildPaymentSchedule(terms: PaymentTerms, totalCents: number, currency: string, opts: ScheduleOptions = {}): PaymentSchedule {
  if (!isInt(totalCents) || totalCents < 0) throw new Error('buildPaymentSchedule : total en centimes entier et positif attendu.');
  const normalized = normalizePaymentTerms(terms);
  const specs = installmentsOf(normalized);
  const orderedAt = toDate(opts.orderedAt) ?? new Date();
  const start = toDate(opts.startDate);
  const amounts = allocateByPercent(specs, totalCents, currency);

  const installments: ScheduledInstallment[] = specs.map((spec, idx) => ({
    ...spec,
    label: installmentLabel(spec),
    amountCents: amounts[idx],
    status: 'pending',
    dueAt: dueAtFor(spec, orderedAt, start),
    invoiceId: null,
    paidAt: null,
  }));

  const dueNowCents = installments.filter((i) => i.trigger === 'on_order').reduce((s, i) => s + i.amountCents, 0);
  return {
    version: 1,
    mode: normalized.mode,
    currency: String(currency || 'EUR').toUpperCase(),
    totalCents,
    dueNowCents,
    paymentDelayDays: normalized.paymentDelayDays ?? DEFAULT_PAYMENT_DELAY,
    installments,
    cancellation: normalized.cancellation ?? [],
    terms: normalized,
    ...(opts.fundedBy === 'pm_plan' ? { fundedBy: 'pm_plan' as const } : {}),
  };
}

function toDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}

function dueAtFor(spec: InstallmentSpec, orderedAt: Date, start: Date | null): string | null {
  if (spec.trigger === 'on_order') return orderedAt.toISOString();
  if (spec.trigger === 'on_start' && start) return start.toISOString();
  if (spec.trigger === 'on_date' && start) return addDays(start, spec.daysOffset ?? 0).toISOString();
  return null;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/** Date limite de paiement d'une facture émise à `issuedAt` (45 = 45 jours fin de mois). */
export function invoiceDueDate(issuedAt: Date, paymentDelayDays: PaymentDelayDays | number | null | undefined): Date {
  const delay = (PAYMENT_DELAYS as readonly number[]).includes(Number(paymentDelayDays)) ? Number(paymentDelayDays) : DEFAULT_PAYMENT_DELAY;
  const d = addDays(issuedAt, delay);
  if (delay === 45) {
    // fin du mois d'arrivée des 45 jours
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0, 23, 59, 59, 0));
  }
  return d;
}

/** Montant déjà réglé (échéances `paid`). */
export function paidCents(schedule: PaymentSchedule): number {
  return schedule.installments.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amountCents, 0);
}

/** Reste à encaisser (échéances ni payées ni annulées). */
export function outstandingCents(schedule: PaymentSchedule): number {
  return schedule.installments.filter((i) => i.status !== 'paid' && i.status !== 'cancelled').reduce((s, i) => s + i.amountCents, 0);
}

/** Échéances rendues exigibles par un fait métier (démarrage, jalon validé, fin, date atteinte). */
export function installmentsTriggeredBy(
  schedule: PaymentSchedule,
  event: { trigger: Exclude<InstallmentTrigger, 'on_order'>; milestoneKey?: string | null; now?: Date },
): ScheduledInstallment[] {
  const now = event.now ?? new Date();
  return schedule.installments.filter((i) => {
    if (i.status !== 'pending') return false;
    if (i.trigger !== event.trigger) return false;
    if (i.trigger === 'on_milestone') return !!event.milestoneKey && i.milestoneKey === event.milestoneKey;
    if (i.trigger === 'on_date') return !!i.dueAt && new Date(i.dueAt).getTime() <= now.getTime();
    // Démarrage daté (réservation) : exigible à la date ; sans date, exigible dès le fait métier.
    if (i.trigger === 'on_start') return !i.dueAt || new Date(i.dueAt).getTime() <= now.getTime();
    return true;
  });
}

/** Nouvel échéancier où l'échéance `key` prend `patch` (immuable ; clé inconnue → inchangé). */
export function withInstallment(schedule: PaymentSchedule, key: string, patch: Partial<Pick<ScheduledInstallment, 'status' | 'invoiceId' | 'paidAt'>>): PaymentSchedule {
  return { ...schedule, installments: schedule.installments.map((i) => (i.key === key ? { ...i, ...patch } : i)) };
}

/**
 * Redate les échéances « au démarrage » et « à date » quand le début de la prestation est connu
 * après coup (réservation confirmée au paiement) ; statuts et montants conservés.
 */
export function withStartDate(schedule: PaymentSchedule, startDate: Date | string | null | undefined): PaymentSchedule {
  const start = toDate(startDate);
  if (!start) return schedule;
  return {
    ...schedule,
    installments: schedule.installments.map((i) =>
      i.trigger === 'on_start' || i.trigger === 'on_date' ? { ...i, dueAt: dueAtFor(i, start, start) } : i),
  };
}

/** Valeur brute (JSON) → échéancier, ou null si ce n'en est pas un. */
export function parsePaymentSchedule(raw: unknown): PaymentSchedule | null {
  let value: unknown = raw;
  if (typeof value === 'string') {
    try { value = JSON.parse(value); } catch { return null; }
  }
  if (!isObject(value) || value.version !== 1 || !Array.isArray(value.installments) || !isInt(value.totalCents)) return null;
  return value as unknown as PaymentSchedule;
}

// ─── Annulation ──────────────────────────────────────────────────────────────

/**
 * Part du total que le prestataire conserve si le client annule `daysBeforeStart` jours avant
 * le début (barème par paliers décroissants ; sans barème : 0, le contrat décide).
 */
export function retainedOnCancellationCents(terms: PaymentTerms, totalCents: number, daysBeforeStart: number, currency = 'EUR'): number {
  const tiers = [...(terms.cancellation ?? [])].sort((a, b) => b.daysBefore - a.daysBefore);
  if (!tiers.length) return 0;
  let retained = 0;
  for (const tier of tiers) {
    if (daysBeforeStart < tier.daysBefore) retained = tier.retainedPercent;
  }
  // au-delà du palier le plus lointain, rien n'est retenu
  if (daysBeforeStart >= tiers[0].daysBefore) retained = 0;
  const unit = roundingUnit(currency);
  return Math.min(totalCents, Math.round((totalCents * retained) / 100 / unit) * unit);
}

// ─── Libellés (devis, contrat, facture) ─────────────────────────────────────

/** Phrase des conditions de règlement (champ `paymentTerms` des factures, variable de contrat). */
export function describePaymentTerms(terms: PaymentTerms): string {
  const t = normalizePaymentTerms(terms);
  const delay = t.paymentDelayDays ?? DEFAULT_PAYMENT_DELAY;
  const delayText = delay === 0 ? 'paiement comptant' : delay === 45 ? 'paiement à 45 jours fin de mois' : `paiement à ${delay} jours`;
  switch (t.mode) {
    case 'full_upfront':
      return 'Paiement intégral à la commande.';
    case 'on_completion':
      return `Paiement intégral à la fin de la prestation, ${delayText}.`;
    case 'time_and_materials':
      return `Facturation en régie sur relevé de temps validé par le client, ${delayText}.`;
    case 'down_payment_balance': {
      const specs = installmentsOf(t);
      return `${specs[0].label} ; ${(specs[1].label ?? '').toLowerCase()}, ${delayText}.`;
    }
    case 'installments': {
      const parts = installmentsOf(t).map((i) => `${i.percent} % ${installmentLabel(i).replace(/^Acompte de \d+ % /, '')}`);
      return `Échéancier : ${parts.join(' ; ')}. Chaque échéance : ${delayText}.`;
    }
    default:
      return '';
  }
}

/** Libellé de ligne d'une facture d'échéance : « Acompte de 30 % — Mission X (devis DEV-…) ». */
export function installmentInvoiceLineLabel(installment: Pick<ScheduledInstallment, 'trigger' | 'percent' | 'label'>, subject: string, reference?: string | null): string {
  const kind = installment.trigger === 'on_order' ? `Acompte de ${installment.percent} %` : installment.percent === 100 ? 'Règlement' : installment.trigger === 'on_completion' ? `Solde (${installment.percent} %)` : `${installment.label} (${installment.percent} %)`;
  return reference ? `${kind} — ${subject} (${reference})` : `${kind} — ${subject}`;
}

/** Nature d'une facture d'échéance pour la mention portée (acompte / solde / échéance). */
export function installmentInvoiceKind(installment: Pick<ScheduledInstallment, 'trigger' | 'percent'>, schedule: Pick<PaymentSchedule, 'installments'>): 'down_payment' | 'balance' | 'installment' | 'full' {
  if (installment.percent === 100) return 'full';
  if (installment.trigger === 'on_order') return 'down_payment';
  const last = schedule.installments[schedule.installments.length - 1];
  return last && last.trigger === installment.trigger && last.percent === installment.percent ? 'balance' : 'installment';
}

// ─── Événements RabbitMQ (contrats partagés mu-command ↔ mu-billing) ─────────

export const PAYMENT_SCHEDULE_EVENTS = {
  /** mu-command → mu-billing : une échéance (solde, jalon, date, démarrage) est devenue exigible : facture à émettre. */
  installmentDue: 'engagement.installment.due',
  /** mu-billing → mu-command : la facture de l'échéance est émise (statut `invoiced`). */
  installmentInvoiced: 'invoice.installment.created',
  /** mu-command → (notifications, Iro) : une échéance est réglée. */
  installmentPaid: 'engagement.installment.paid',
} as const;

/**
 * Plan Project Manager : le client a tout réglé, le séquestre de la plateforme verse chaque
 * échéance au prestataire quand elle devient exigible (mêmes déclencheurs que la facturation).
 */
export const PM_INSTALLMENT_EVENTS = {
  /** mu-command → mu-wallet : échéance exigible, à verser du séquestre (part nette au prestataire, frais à la plateforme). */
  due: 'pm.installment.due',
  /** mu-wallet → mu-command : versement effectué (échéance `paid`). */
  released: 'wallet.pm.installment.released',
  /** mu-wallet → mu-command : versement impossible (séquestre insuffisant, wallet absent…). */
  failed: 'wallet.pm.installment.failed',
  /** mu-command → mu-pm, exploitation : versement refusé, compteur et motif (C128) ; relancé par le cron jusqu'au plafond. */
  releaseFailed: 'pm.installment.release_failed',
} as const;

export interface PmInstallmentDuePayload {
  engagementId: string;
  orderId: string;
  installmentKey: string;
  sessionId: string | null;
  sellerOrganizationId: string;
  currency: string;
  /** Part contractuelle (HT + TVA) versée au prestataire. */
  netSellerCents: number;
  /** Commission et frais de paiement sur cette part, versés au wallet de la plateforme. */
  platformFeeCents: number;
  priceHTCents: number;
  vatPercent: number;
  dueAt: string;
  /** Part nette gardée en retenue de garantie (wallet technique, rendue après le délai — C158). */
  retentionCents?: number;
  /** Pénalités dues par le prestataire déduites de ce versement (fonds de garantie — C158). */
  penaltyDeductionCents?: number;
}

/** Payload de `engagement.installment.due` : tout ce qu'il faut pour facturer sans relire mu-command. */
export interface InstallmentDuePayload {
  engagementId: string;
  orderId: string | null;
  estimateId: string | null;
  serviceId: string | null;
  /** Objet facturé : nom de la mission / de la prestation. */
  subject: string;
  sellerOrganizationId: string;
  buyerOrganizationId: string | null;
  buyerUserId: string | null;
  currency: string;
  /** Prix HT contractuel total de la vente (somme des lignes de la commande), en centimes. */
  priceHTCents: number;
  vatPercent: number;
  /** Échéancier complet (statuts à jour) ; l'échéance due y figure avec `status: 'due'`. */
  schedule: PaymentSchedule;
  installmentKey: string;
  /** Horodatage ISO de l'exigibilité (idempotence côté mu-billing : une facture par échéance). */
  dueAt: string;
}

export interface InstallmentInvoicedPayload {
  engagementId: string;
  installmentKey: string;
  invoiceId: string;
  invoiceNumber: string | null;
  sellerOrganizationId: string;
  totalAmountCents: number;
  currency: string;
  dueDate: string | null;
}

/** Références d'échéance portées par `Invoice.transactionData.installment` et recopiées dans `invoice.paid`. */
export interface InstallmentInvoiceRefs {
  engagementId: string;
  installmentKey: string;
  orderId: string | null;
  kind: 'down_payment' | 'balance' | 'installment' | 'full';
  percent: number;
}

/** Lit les références d'échéance d'un `transactionData` de facture, ou null. */
export function installmentRefsOf(transactionData: unknown): InstallmentInvoiceRefs | null {
  const raw = isObject(transactionData) ? transactionData.installment : null;
  if (!isObject(raw) || typeof raw.engagementId !== 'string' || typeof raw.installmentKey !== 'string') return null;
  return {
    engagementId: raw.engagementId,
    installmentKey: raw.installmentKey,
    orderId: typeof raw.orderId === 'string' ? raw.orderId : null,
    kind: (['down_payment', 'balance', 'installment', 'full'] as const).includes(raw.kind as never) ? (raw.kind as InstallmentInvoiceRefs['kind']) : 'installment',
    percent: isInt(raw.percent) ? raw.percent : 0,
  };
}
