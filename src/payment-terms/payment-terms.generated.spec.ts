/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/payment-terms/payment-terms.spec.ts
   │  Régénérer        : ./scripts/sync-payment-terms.sh                      │
   │  Vérifier (CI)    : ./scripts/sync-payment-terms.sh --check              │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

// Conditions de règlement : modes admis, validation, chiffrage de l'échéancier, libellés.
import {
  DEFAULT_PAYMENT_TERMS,
  PAYMENT_MODES,
  PAYMENT_SCHEDULE_EVENTS,
  allocateByPercent,
  allowedPaymentModes,
  buildPaymentSchedule,
  defaultPaymentTermsFor,
  describePaymentTerms,
  effectivePaymentTerms,
  installmentInvoiceKind,
  isPlanFunded,
  requiresIdentifiedBuyer,
  scheduleRequiresIdentifiedBuyer,
  installmentInvoiceLineLabel,
  installmentRefsOf,
  installmentsOf,
  installmentsTriggeredBy,
  invoiceDueDate,
  normalizePaymentTerms,
  outstandingCents,
  paidCents,
  parsePaymentSchedule,
  parsePaymentTerms,
  retainedOnCancellationCents,
  validatePaymentTerms,
  withInstallment,
  withStartDate,
} from './payment-terms.generated';
import type { PaymentTerms } from './payment-terms.generated';

const consulting: PaymentTerms = {
  mode: 'installments',
  paymentDelayDays: 30,
  installments: [
    { key: 'kickoff', percent: 30, trigger: 'on_order' },
    { key: 'deliverable_1', percent: 40, trigger: 'on_milestone', milestoneKey: 'diagnostic', label: 'Validation du diagnostic' },
    { key: 'final', percent: 30, trigger: 'on_completion' },
  ],
};

const event: PaymentTerms = {
  mode: 'installments',
  paymentDelayDays: 0,
  installments: [
    { key: 'booking', percent: 40, trigger: 'on_order', label: 'Acompte de réservation' },
    { key: 'before', percent: 50, trigger: 'on_date', daysOffset: -7, label: 'Versement à J-7' },
    { key: 'after', percent: 10, trigger: 'on_completion', label: 'Solde et extras après l’événement' },
  ],
  cancellation: [
    { daysBefore: 60, retainedPercent: 40 },
    { daysBefore: 30, retainedPercent: 70 },
    { daysBefore: 7, retainedPercent: 100 },
  ],
};

describe('modes admis et défauts', () => {
  it('instantané et abonnement : intégral à la commande seulement', () => {
    expect(allowedPaymentModes('instant')).toEqual(['full_upfront']);
    expect(allowedPaymentModes('periodic', 'mensual')).toEqual(['full_upfront']);
    expect(defaultPaymentTermsFor('instant', 'direct')).toEqual(DEFAULT_PAYMENT_TERMS);
  });
  it('réservation : acompte ou échéancier, jamais la régie', () => {
    expect(allowedPaymentModes('booking_required', 'dayly')).toEqual(['full_upfront', 'down_payment_balance', 'installments']);
  });
  it('sur devis : tous les modes, la régie seulement au temps passé', () => {
    expect(allowedPaymentModes('prestation', 'hourly')).toEqual(PAYMENT_MODES);
    expect(allowedPaymentModes('prestation', 'direct')).not.toContain('time_and_materials');
    expect(defaultPaymentTermsFor('prestation', 'direct')).toMatchObject({ mode: 'down_payment_balance', downPaymentPercent: 30, balanceTrigger: 'on_completion', paymentDelayDays: 30 });
    expect(defaultPaymentTermsFor('prestation', 'dayly')).toMatchObject({ mode: 'time_and_materials' });
  });
});

describe('validation', () => {
  it('accepte les conditions de référence', () => {
    expect(validatePaymentTerms(consulting, { uptakeForm: 'prestation', billingPlan: 'direct' })).toEqual([]);
    expect(validatePaymentTerms(event, { uptakeForm: 'booking_required', billingPlan: 'direct' })).toEqual([]);
    expect(validatePaymentTerms({ mode: 'down_payment_balance', downPaymentPercent: 50 })).toEqual([]);
  });
  it('refuse un mode inconnu, un mode hors contexte, un délai hors liste', () => {
    expect(validatePaymentTerms({ mode: 'escrow' }).map((i) => i.code)).toEqual(['MODE_UNKNOWN']);
    expect(validatePaymentTerms(null).map((i) => i.code)).toEqual(['MODE_UNKNOWN']);
    expect(validatePaymentTerms({ mode: 'down_payment_balance' }, { uptakeForm: 'instant' }).map((i) => i.code)).toContain('MODE_NOT_ALLOWED');
    expect(validatePaymentTerms({ mode: 'on_completion', paymentDelayDays: 90 }).map((i) => i.code)).toContain('PAYMENT_DELAY_INVALID');
  });
  it('acompte : pourcentage 1-99, solde à date avec décalage', () => {
    expect(validatePaymentTerms({ mode: 'down_payment_balance', downPaymentPercent: 100 }).map((i) => i.code)).toContain('DOWN_PAYMENT_PERCENT_INVALID');
    expect(validatePaymentTerms({ mode: 'down_payment_balance', downPaymentPercent: 30.5 }).map((i) => i.code)).toContain('DOWN_PAYMENT_PERCENT_INVALID');
    expect(validatePaymentTerms({ mode: 'down_payment_balance', balanceTrigger: 'on_date' }).map((i) => i.code)).toContain('INSTALLMENT_OFFSET_INVALID');
    expect(validatePaymentTerms({ mode: 'down_payment_balance', balanceTrigger: 'on_milestone' }).map((i) => i.code)).toContain('BALANCE_TRIGGER_INVALID');
  });
  it('échéancier : somme 100, clés uniques, un seul « à la commande », jalon nommé', () => {
    const codes = (t: unknown) => validatePaymentTerms(t).map((i) => i.code);
    expect(codes({ mode: 'installments', installments: [] })).toContain('INSTALLMENTS_EMPTY');
    expect(codes({ mode: 'installments', installments: [{ key: 'a', percent: 60, trigger: 'on_order' }] })).toContain('INSTALLMENTS_SUM_NOT_100');
    expect(codes({ mode: 'installments', installments: [{ key: 'a', percent: 50, trigger: 'on_order' }, { key: 'a', percent: 50, trigger: 'on_completion' }] })).toContain('INSTALLMENT_KEY_DUPLICATE');
    expect(codes({ mode: 'installments', installments: [{ key: 'a', percent: 50, trigger: 'on_order' }, { key: 'b', percent: 50, trigger: 'on_order' }] })).toContain('INSTALLMENTS_MULTIPLE_ON_ORDER');
    expect(codes({ mode: 'installments', installments: [{ key: 'a', percent: 50, trigger: 'on_order' }, { key: 'b', percent: 50, trigger: 'on_milestone' }] })).toContain('INSTALLMENT_MILESTONE_MISSING');
    expect(codes({ mode: 'installments', installments: [{ key: 'Bad Key', percent: 100, trigger: 'on_order' }] })).toContain('INSTALLMENT_KEY_INVALID');
    expect(codes({ mode: 'installments', installments: [{ key: 'a', percent: 100, trigger: 'later' }] })).toContain('INSTALLMENT_TRIGGER_INVALID');
  });
  it('barème d’annulation : paliers valides', () => {
    expect(validatePaymentTerms({ mode: 'full_upfront', cancellation: [{ daysBefore: -1, retainedPercent: 10 }] }).map((i) => i.code)).toContain('CANCELLATION_INVALID');
    expect(validatePaymentTerms({ mode: 'full_upfront', cancellation: 'tout' }).map((i) => i.code)).toContain('CANCELLATION_INVALID');
  });
  it('normalise : défauts appliqués, clés inconnues retirées, paliers triés', () => {
    const n = normalizePaymentTerms({ mode: 'down_payment_balance', foo: 1, cancellation: [{ daysBefore: 7, retainedPercent: 100 }, { daysBefore: 30, retainedPercent: 50 }] } as unknown);
    expect(n).toEqual({ mode: 'down_payment_balance', paymentDelayDays: 30, downPaymentPercent: 30, balanceTrigger: 'on_completion', cancellation: [{ daysBefore: 30, retainedPercent: 50 }, { daysBefore: 7, retainedPercent: 100 }] });
    expect(normalizePaymentTerms({ mode: 'full_upfront' }).paymentDelayDays).toBe(0);
    expect(() => normalizePaymentTerms({ mode: 'installments', installments: [] })).toThrow(/au moins une/);
  });
  it('parsePaymentTerms lit un objet ou une chaîne JSON', () => {
    expect(parsePaymentTerms('{"mode":"on_completion"}')).toEqual({ mode: 'on_completion' });
    expect(parsePaymentTerms('{oops')).toBeNull();
    expect(parsePaymentTerms({ percent: 3 })).toBeNull();
  });
});

describe('échéancier chiffré', () => {
  it('mission 5 000 € HT facturée 6 480 € TTC acheteur : 30 / 40 / 30, somme exacte', () => {
    const s = buildPaymentSchedule(consulting, 648_000, 'EUR', { orderedAt: '2026-10-21T10:00:00.000Z' });
    expect(s.installments.map((i) => i.amountCents)).toEqual([194_400, 259_200, 194_400]);
    expect(s.dueNowCents).toBe(194_400);
    expect(s.totalCents).toBe(648_000);
    expect(s.installments[0].dueAt).toBe('2026-10-21T10:00:00.000Z');
    expect(s.installments[1].dueAt).toBeNull();
    expect(s.installments[1].milestoneKey).toBe('diagnostic');
    expect(s.installments.every((i) => i.status === 'pending')).toBe(true);
  });
  it('arrondi : la dernière échéance absorbe l’écart', () => {
    const s = buildPaymentSchedule({ mode: 'installments', installments: [{ key: 'a', percent: 33, trigger: 'on_order' }, { key: 'b', percent: 33, trigger: 'on_start' }, { key: 'c', percent: 34, trigger: 'on_completion' }] }, 1001, 'EUR');
    expect(s.installments.map((i) => i.amountCents)).toEqual([330, 330, 341]);
    expect(s.installments.reduce((t, i) => t + i.amountCents, 0)).toBe(1001);
  });
  it('XAF : échéances en unités entières (multiples de 100 centimes)', () => {
    const s = buildPaymentSchedule({ mode: 'down_payment_balance', downPaymentPercent: 30 }, 1_234_567, 'XAF');
    expect(s.installments[0].amountCents % 100).toBe(0);
    expect(s.installments.reduce((t, i) => t + i.amountCents, 0)).toBe(1_234_567);
  });
  it('événementiel : acompte, versement à J-7 daté depuis la date de l’événement, solde après', () => {
    const s = buildPaymentSchedule(event, 2_400_000, 'EUR', { startDate: '2026-12-15T18:00:00.000Z', orderedAt: '2026-10-21T00:00:00.000Z' });
    expect(s.installments.map((i) => [i.key, i.amountCents])).toEqual([['booking', 960_000], ['before', 1_200_000], ['after', 240_000]]);
    expect(s.installments[1].dueAt).toBe('2026-12-08T18:00:00.000Z');
    expect(s.dueNowCents).toBe(960_000);
    expect(s.cancellation).toHaveLength(3);
  });
  it('intégral à la commande / à la fin / régie', () => {
    expect(buildPaymentSchedule({ mode: 'full_upfront' }, 10_000, 'EUR').dueNowCents).toBe(10_000);
    const end = buildPaymentSchedule({ mode: 'on_completion' }, 10_000, 'EUR');
    expect(end.dueNowCents).toBe(0);
    expect(end.installments).toEqual([expect.objectContaining({ key: 'balance', amountCents: 10_000, trigger: 'on_completion' })]);
    const tm = buildPaymentSchedule({ mode: 'time_and_materials' }, 0, 'EUR');
    expect(tm.installments).toEqual([]);
    expect(tm.dueNowCents).toBe(0);
  });
  it('refuse un total négatif ou non entier', () => {
    expect(() => buildPaymentSchedule({ mode: 'full_upfront' }, -1, 'EUR')).toThrow();
    expect(() => buildPaymentSchedule({ mode: 'full_upfront' }, 10.5, 'EUR')).toThrow();
  });
  it('suivi : paiement d’une échéance, reste dû, déclenchement par fait métier', () => {
    let s = buildPaymentSchedule(consulting, 648_000, 'EUR', { orderedAt: '2026-10-21T10:00:00.000Z' });
    s = withInstallment(s, 'kickoff', { status: 'paid', paidAt: '2026-10-21T10:05:00.000Z' });
    expect(paidCents(s)).toBe(194_400);
    expect(outstandingCents(s)).toBe(453_600);
    expect(installmentsTriggeredBy(s, { trigger: 'on_milestone', milestoneKey: 'autre' })).toEqual([]);
    expect(installmentsTriggeredBy(s, { trigger: 'on_milestone', milestoneKey: 'diagnostic' }).map((i) => i.key)).toEqual(['deliverable_1']);
    expect(installmentsTriggeredBy(s, { trigger: 'on_completion' }).map((i) => i.key)).toEqual(['final']);
    s = withInstallment(s, 'deliverable_1', { status: 'invoiced', invoiceId: 'inv-1' });
    expect(installmentsTriggeredBy(s, { trigger: 'on_milestone', milestoneKey: 'diagnostic' })).toEqual([]);
    expect(withInstallment(s, 'inconnue', { status: 'paid' })).toEqual(s);
  });
  it('échéance à date : exigible seulement une fois la date atteinte', () => {
    const s = buildPaymentSchedule(event, 2_400_000, 'EUR', { startDate: '2026-12-15T18:00:00.000Z' });
    expect(installmentsTriggeredBy(s, { trigger: 'on_date', now: new Date('2026-12-01T00:00:00.000Z') })).toEqual([]);
    expect(installmentsTriggeredBy(s, { trigger: 'on_date', now: new Date('2026-12-09T00:00:00.000Z') }).map((i) => i.key)).toEqual(['before']);
  });
  it('withStartDate : redate démarrage et échéances à date, sans toucher aux statuts', () => {
    const terms: PaymentTerms = { mode: 'installments', installments: [{ key: 'a', percent: 20, trigger: 'on_order' }, { key: 'b', percent: 30, trigger: 'on_start' }, { key: 'c', percent: 40, trigger: 'on_date', daysOffset: -7 }, { key: 'd', percent: 10, trigger: 'on_completion' }] };
    let s = buildPaymentSchedule(terms, 100_000, 'EUR', { orderedAt: '2026-10-21T10:00:00.000Z' });
    expect(s.installments.map((i) => i.dueAt)).toEqual(['2026-10-21T10:00:00.000Z', null, null, null]);
    s = withInstallment(s, 'a', { status: 'paid' });
    const dated = withStartDate(s, '2026-12-15T18:00:00.000Z');
    expect(dated.installments.map((i) => i.dueAt)).toEqual(['2026-10-21T10:00:00.000Z', '2026-12-15T18:00:00.000Z', '2026-12-08T18:00:00.000Z', null]);
    expect(dated.installments[0].status).toBe('paid');
    expect(withStartDate(s, 'pas une date')).toBe(s);
  });
  it('parsePaymentSchedule ne prend qu’un échéancier v1', () => {
    const s = buildPaymentSchedule(consulting, 100, 'EUR');
    expect(parsePaymentSchedule(JSON.stringify(s))).toEqual(s);
    expect(parsePaymentSchedule({ version: 2 })).toBeNull();
    expect(parsePaymentSchedule(null)).toBeNull();
  });
});

describe('dates et annulation', () => {
  it('date limite de paiement : comptant, 30 j, 45 j fin de mois, 60 j', () => {
    const issued = new Date('2026-10-21T09:00:00.000Z');
    expect(invoiceDueDate(issued, 0).toISOString()).toBe('2026-10-21T09:00:00.000Z');
    expect(invoiceDueDate(issued, 30).toISOString()).toBe('2026-11-20T09:00:00.000Z');
    expect(invoiceDueDate(issued, 45).toISOString()).toBe('2026-12-31T23:59:59.000Z');
    expect(invoiceDueDate(issued, 60).toISOString()).toBe('2026-12-20T09:00:00.000Z');
    expect(invoiceDueDate(issued, 17).toISOString()).toBe('2026-11-20T09:00:00.000Z');
  });
  it('barème d’annulation par paliers', () => {
    expect(retainedOnCancellationCents(event, 2_400_000, 90)).toBe(0);
    expect(retainedOnCancellationCents(event, 2_400_000, 45)).toBe(960_000);
    expect(retainedOnCancellationCents(event, 2_400_000, 20)).toBe(1_680_000);
    expect(retainedOnCancellationCents(event, 2_400_000, 2)).toBe(2_400_000);
    expect(retainedOnCancellationCents({ mode: 'full_upfront' }, 2_400_000, 2)).toBe(0);
    expect(retainedOnCancellationCents(event, 1_234_567, 20, 'XAF')).toBe(864_200);
  });
});

describe('libellés', () => {
  it('phrase des conditions', () => {
    expect(describePaymentTerms({ mode: 'full_upfront' })).toBe('Paiement intégral à la commande.');
    expect(describePaymentTerms({ mode: 'down_payment_balance', downPaymentPercent: 30 })).toBe('Acompte de 30 % à la commande ; solde à la fin de la prestation, paiement à 30 jours.');
    expect(describePaymentTerms({ mode: 'on_completion', paymentDelayDays: 45 })).toBe('Paiement intégral à la fin de la prestation, paiement à 45 jours fin de mois.');
    expect(describePaymentTerms({ mode: 'time_and_materials', paymentDelayDays: 60 })).toMatch(/régie.*60 jours/);
    expect(describePaymentTerms(consulting)).toBe('Échéancier : 30 % à la commande ; 40 % Validation du diagnostic ; 30 % Solde à la fin de la prestation. Chaque échéance : paiement à 30 jours.');
  });
  it('libellé et nature des factures d’échéance', () => {
    const s = buildPaymentSchedule(consulting, 648_000, 'EUR');
    expect(installmentInvoiceLineLabel(s.installments[0], 'Mission conseil', 'DEV-2026-014')).toBe('Acompte de 30 % — Mission conseil (DEV-2026-014)');
    expect(installmentInvoiceLineLabel(s.installments[2], 'Mission conseil')).toBe('Solde (30 %) — Mission conseil');
    expect(installmentInvoiceKind(s.installments[0], s)).toBe('down_payment');
    expect(installmentInvoiceKind(s.installments[1], s)).toBe('installment');
    expect(installmentInvoiceKind(s.installments[2], s)).toBe('balance');
    const full = buildPaymentSchedule({ mode: 'full_upfront' }, 100, 'EUR');
    expect(installmentInvoiceKind(full.installments[0], full)).toBe('full');
    expect(installmentsOf({ mode: 'down_payment_balance', downPaymentPercent: 40, balanceTrigger: 'on_date', balanceDaysOffset: -7 })[1]).toMatchObject({ key: 'balance', percent: 60, trigger: 'on_date', daysOffset: -7, label: 'Solde à J-7' });
  });
});

describe('partage et contrats', () => {
  it('allocateByPercent : même règle d’arrondi que l’échéancier, sur une autre base (HT)', () => {
    const parts = [{ percent: 30 }, { percent: 40 }, { percent: 30 }];
    expect(allocateByPercent(parts, 500_000, 'EUR')).toEqual([150_000, 200_000, 150_000]);
    expect(allocateByPercent(parts, 1001, 'EUR')).toEqual([300, 400, 301]);
    expect(allocateByPercent(parts, 1_234_567, 'XAF')).toEqual([370_400, 493_800, 370_367]);
    expect(allocateByPercent([], 100, 'EUR')).toEqual([]);
    expect(() => allocateByPercent(parts, -1, 'EUR')).toThrow();
  });
  it('effectivePaymentTerms : fiche valide, sinon défauts du mode de vente', () => {
    expect(effectivePaymentTerms({ mode: 'on_completion', paymentDelayDays: 60 }, { uptakeForm: 'prestation', billingPlan: 'direct' })).toEqual({ mode: 'on_completion', paymentDelayDays: 60 });
    expect(effectivePaymentTerms({ mode: 'on_completion' }, { uptakeForm: 'instant', billingPlan: 'direct' })).toEqual({ mode: 'full_upfront', paymentDelayDays: 0 });
    expect(effectivePaymentTerms(null, { uptakeForm: 'prestation', billingPlan: 'hourly' })).toMatchObject({ mode: 'time_and_materials' });
  });
  it('installmentRefsOf : références d’échéance d’une facture', () => {
    expect(installmentRefsOf({ installment: { engagementId: 'e1', installmentKey: 'balance', orderId: 'o1', kind: 'balance', percent: 70 } }))
      .toEqual({ engagementId: 'e1', installmentKey: 'balance', orderId: 'o1', kind: 'balance', percent: 70 });
    expect(installmentRefsOf({ installment: { engagementId: 'e1', installmentKey: 'k', kind: 'autre' } })).toMatchObject({ kind: 'installment', orderId: null, percent: 0 });
    expect(installmentRefsOf({ source: 'timesheet' })).toBeNull();
    expect(installmentRefsOf(null)).toBeNull();
    expect(PAYMENT_SCHEDULE_EVENTS.installmentDue).toBe('engagement.installment.due');
  });

  it('compte requis dès qu’il reste un dû après la commande ; intégral à la commande admet un invité', () => {
    expect(requiresIdentifiedBuyer({ mode: 'full_upfront' })).toBe(false);
    expect(requiresIdentifiedBuyer({ mode: 'installments', installments: [{ key: 'full', percent: 100, trigger: 'on_order' }] })).toBe(false);
    expect(requiresIdentifiedBuyer({ mode: 'down_payment_balance', downPaymentPercent: 30 })).toBe(true);
    expect(requiresIdentifiedBuyer({ mode: 'on_completion' })).toBe(true);
    expect(requiresIdentifiedBuyer({ mode: 'time_and_materials' })).toBe(true);
    expect(requiresIdentifiedBuyer({ mode: 'installments', installments: [{ key: 'a', percent: 50, trigger: 'on_order' }, { key: 'b', percent: 50, trigger: 'on_milestone', milestoneKey: 'x' }] })).toBe(true);
    expect(scheduleRequiresIdentifiedBuyer(buildPaymentSchedule({ mode: 'full_upfront' }, 1000, 'EUR'))).toBe(false);
    expect(scheduleRequiresIdentifiedBuyer(buildPaymentSchedule({ mode: 'down_payment_balance', downPaymentPercent: 30 }, 1000, 'EUR'))).toBe(true);
    expect(scheduleRequiresIdentifiedBuyer(null)).toBe(false);
  });

  it('échéancier d’un plan PM : marqué `fundedBy: pm_plan`, absent sinon', () => {
    const client = buildPaymentSchedule({ mode: 'down_payment_balance', downPaymentPercent: 30 }, 1000, 'EUR');
    const plan = buildPaymentSchedule({ mode: 'down_payment_balance', downPaymentPercent: 30 }, 1000, 'EUR', { fundedBy: 'pm_plan' });
    expect(isPlanFunded(client)).toBe(false);
    expect('fundedBy' in client).toBe(false);
    expect(isPlanFunded(plan)).toBe(true);
    expect(isPlanFunded(null)).toBe(false);
  });
});
