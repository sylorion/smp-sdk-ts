/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/notifications/notifications.ts
   │  Régénérer        : ./scripts/sync-notifications.sh                            │
   │  Vérifier (CI)    : ./scripts/sync-notifications.sh --check                    │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

/**
 * Contrat partagé des notifications SMP — source de vérité unique, recopiée par
 * `scripts/sync-notifications.sh` dans mu-notification, la webapp et le SDK.
 *
 * Il décrit CE QU'EST une notification (catégorie, priorité, action attendue, objet métier,
 * clé de fil) — jamais COMMENT l'action s'exécute : les actions appellent les services métier
 * existants (paiement, devis, agenda, tâches…), qui vérifient les permissions.
 *
 * Voir `docs/architecture/notifications.md`.
 */

export const NOTIFICATION_CONTRACT_VERSION = 1;

/** Domaine métier d'une notification (filtres, badges de section, registre d'aperçu). */
export const NOTIFICATION_CATEGORIES = [
  'crm', 'leads', 'tasks', 'projects', 'services', 'estimates', 'invoices', 'contracts', 'agenda',
  'marketplace', 'automations', 'documents', 'mentions', 'iro', 'wallet', 'referrals', 'account',
] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export const NOTIFICATION_PRIORITIES = ['low', 'normal', 'high', 'urgent'] as const;
export type NotificationPriority = (typeof NOTIFICATION_PRIORITIES)[number];

/** État de l'action attendue : `none` (information), `pending` (à traiter), `done`, `dismissed`. */
export const NOTIFICATION_ACTION_STATES = ['none', 'pending', 'done', 'dismissed'] as const;
export type NotificationActionState = (typeof NOTIFICATION_ACTION_STATES)[number];

/** Onglets du centre de notifications. */
export const NOTIFICATION_TABS = ['all', 'todo', 'unread', 'snoozed', 'done'] as const;
export type NotificationTab = (typeof NOTIFICATION_TABS)[number];

/**
 * Actions proposées sur une notification. `mode` :
 *  - `direct`   : un clic, exécutée par une route métier existante (démarrer une tâche, valider un
 *                 livrable, confirmer un rendez-vous), puis la notification passe `done` ;
 *  - `navigate` : ouvre la page de l'objet — actions à choix, à texte, qui engagent (paiement,
 *                 signature, acceptation ou refus d'un devis, relance) ou dont la page porte le parcours.
 * `completes` : l'action traite la notification (état `done`). Quand l'objet change ensuite (facture
 * payée, devis accepté…), c'est l'ÉVÉNEMENT métier qui clôt le fil, pas le clic.
 */
export const NOTIFICATION_ACTIONS = {
  pay_invoice: { mode: 'navigate', completes: false },
  remind_invoice: { mode: 'navigate', completes: false },
  view_invoice: { mode: 'navigate', completes: false },
  create_deposit_invoice: { mode: 'navigate', completes: false },
  accept_estimate: { mode: 'navigate', completes: false },
  refuse_estimate: { mode: 'navigate', completes: false },
  view_estimate: { mode: 'navigate', completes: false },
  reply_negotiation: { mode: 'navigate', completes: false },
  sign_contract: { mode: 'navigate', completes: false },
  countersign_contract: { mode: 'navigate', completes: false },
  read_contract: { mode: 'navigate', completes: false },
  start_task: { mode: 'direct', completes: true },
  reassign_task: { mode: 'navigate', completes: false },
  view_task: { mode: 'navigate', completes: false },
  validate_deliverable: { mode: 'direct', completes: true },
  request_changes: { mode: 'navigate', completes: false },
  confirm_booking: { mode: 'direct', completes: true },
  propose_slot: { mode: 'navigate', completes: false },
  view_booking: { mode: 'navigate', completes: false },
  schedule_call: { mode: 'navigate', completes: false },
  assign_lead: { mode: 'navigate', completes: false },
  view_lead: { mode: 'navigate', completes: false },
  reply_mention: { mode: 'navigate', completes: false },
  view_document: { mode: 'navigate', completes: false },
  review_run: { mode: 'navigate', completes: false },
  open: { mode: 'navigate', completes: false },
} as const;
export type NotificationActionKey = keyof typeof NOTIFICATION_ACTIONS;
export type NotificationActionMode = (typeof NOTIFICATION_ACTIONS)[NotificationActionKey]['mode'];

export const isNotificationActionKey = (v: unknown): v is NotificationActionKey =>
  typeof v === 'string' && Object.prototype.hasOwnProperty.call(NOTIFICATION_ACTIONS, v);

/** Comment un type d'événement se présente dans le fil. */
export interface NotificationTypeDescriptor {
  category: NotificationCategory;
  priority: NotificationPriority;
  /** L'événement attend une action du destinataire (section « À traiter »). */
  requiresAction: boolean;
  /** Actions proposées, la première est l'action rapide de la cloche. */
  actions: readonly NotificationActionKey[];
  /** L'événement CLÔT le fil de l'objet (le `pending` précédent passe `done`). */
  completesThread?: boolean;
}

const info = (category: NotificationCategory, priority: NotificationPriority = 'normal', actions: readonly NotificationActionKey[] = ['open']): NotificationTypeDescriptor =>
  ({ category, priority, requiresAction: false, actions });
const todo = (category: NotificationCategory, actions: readonly NotificationActionKey[], priority: NotificationPriority = 'high'): NotificationTypeDescriptor =>
  ({ category, priority, requiresAction: true, actions });
const closes = (category: NotificationCategory, actions: readonly NotificationActionKey[] = ['open'], priority: NotificationPriority = 'normal'): NotificationTypeDescriptor =>
  ({ category, priority, requiresAction: false, actions, completesThread: true });

/**
 * Descripteur par clé d'événement RabbitMQ (clés de `NotificationEventType` de mu-notification).
 * Une clé absente est décrite par `describeNotificationType` (repli par préfixe).
 */
export const NOTIFICATION_TYPES: Record<string, NotificationTypeDescriptor> = {
  // Factures et paiements
  'invoice.created': todo('invoices', ['pay_invoice', 'view_invoice']),
  'invoice.payment.invitation.sent': todo('invoices', ['pay_invoice', 'view_invoice']),
  'notification.invoice.payment': todo('invoices', ['pay_invoice', 'view_invoice']),
  'notification.invoice.reminder': todo('invoices', ['pay_invoice', 'view_invoice'], 'urgent'),
  'notification.invoice.payment.confirmation': closes('invoices', ['view_invoice']),
  'notification.invoice.payment.success': closes('invoices', ['view_invoice']),
  'notification.invoice.paid.buyer': closes('invoices', ['view_invoice']),
  'notification.invoice.paid.seller': closes('invoices', ['view_invoice']),
  'invoice.fees.created': info('invoices', 'normal', ['view_invoice']),
  'notification.payment.receipt': info('invoices', 'normal', ['view_invoice']),
  'notification.order.paid.provider': info('marketplace', 'normal', ['open']),
  // Devis et négociations
  'notification.estimate.submitted.provider': todo('estimates', ['view_estimate']),
  'notification.estimate.submitted.client': todo('estimates', ['accept_estimate', 'refuse_estimate', 'view_estimate']),
  'notification.estimate.available': todo('estimates', ['accept_estimate', 'refuse_estimate', 'view_estimate']),
  'notification.estimate.proposal': todo('estimates', ['reply_negotiation', 'view_estimate']),
  'notification.negotiation.message': todo('estimates', ['reply_negotiation', 'view_estimate']),
  'notification.negotiation.accepted': closes('estimates', ['create_deposit_invoice', 'view_estimate']),
  // Contrats et signatures
  'notification.contract.signature': todo('contracts', ['sign_contract', 'read_contract']),
  'notification.contract.reminder': todo('contracts', ['sign_contract', 'read_contract'], 'urgent'),
  'notification.contract.opened': info('contracts', 'low', ['read_contract']),
  'notification.contract.signed': todo('contracts', ['countersign_contract', 'read_contract']),
  'notification.contract.rejected': closes('contracts', ['read_contract'], 'high'),
  'notification.service_flow.countersign.required': todo('contracts', ['countersign_contract', 'read_contract']),
  // Flows de service (dossiers)
  'notification.service_flow.run.started': info('services'),
  'notification.service_flow.review.required': todo('services', ['review_run']),
  'notification.service_flow.run.validated': closes('services'),
  'notification.service_flow.run.changes_requested': todo('services', ['review_run']),
  'notification.service_flow.run.refused': closes('services', ['open'], 'high'),
  'notification.service_flow.run.expired.client': closes('services', ['open'], 'high'),
  'notification.service_flow.run.expired.provider': closes('services'),
  'notification.service_flow.run.message.client': todo('services', ['reply_mention', 'open'], 'normal'),
  'notification.service_flow.run.message.provider': todo('services', ['reply_mention', 'open'], 'normal'),
  'notification.service_flow.service.started': info('services'),
  'notification.service_flow.inspection.recorded.client': info('services'),
  'notification.service_flow.inspection.recorded.provider': info('services'),
  'notification.service_flow.deposit.settled': info('services'),
  'notification.service_flow.run.closed.client': closes('services'),
  'notification.service_flow.run.closed.provider': closes('services'),
  'notification.service_flow.run.completed.client': closes('services'),
  'notification.service_flow.run.completed.provider': closes('services'),
  'notification.service_flow.run.reminder': todo('services', ['review_run'], 'urgent'),
  // Agenda et réservations
  'notification.booking.confirmed.provider': todo('agenda', ['confirm_booking', 'propose_slot', 'view_booking']),
  'notification.booking.confirmed.client': info('agenda', 'normal', ['view_booking']),
  'notification.booking.reminder.client': info('agenda', 'high', ['view_booking']),
  'notification.booking.instructions.client': info('agenda', 'normal', ['view_booking']),
  'notification.booking.cancelled.client': closes('agenda', ['view_booking'], 'high'),
  'notification.booking.cancelled.provider': closes('agenda', ['view_booking'], 'high'),
  'notification.booking.refund.completed.client': closes('agenda', ['view_booking']),
  'agenda.event.invited': todo('agenda', ['confirm_booking', 'propose_slot', 'view_booking'], 'normal'),
  'agenda.event.cancelled': closes('agenda', ['view_booking'], 'high'),
  'agenda.reminder.due': info('agenda', 'high', ['open']),
  'engagement.reminder.due': info('services', 'high'),
  // Tâches et travail d'équipe
  'organization.task.assigned': todo('tasks', ['start_task', 'reassign_task', 'view_task']),
  'organization.task.status.changed': info('tasks', 'normal', ['view_task']),
  'organization.task.commented': todo('mentions', ['reply_mention', 'view_task'], 'normal'),
  'organization.task.due.changed': info('tasks', 'high', ['view_task']),
  'organization.dossier.handed_over': todo('tasks', ['open']),
  // Projets et livrables
  'project.activity.assigned': todo('projects', ['view_task']),
  'project.activity.unblocked': info('projects', 'normal', ['view_task']),
  'project.activity.awaited': todo('projects', ['view_task'], 'urgent'),
  'project.activity.attention': todo('projects', ['validate_deliverable', 'request_changes', 'view_document']),
  'pm.cascade.completed': info('projects'),
  'pm.project.completed': closes('projects'),
  'pm.client.reminders.summary': info('projects'),
  'pm.sourcing.requested': todo('projects', ['open']),
  'pm.client.provider.replaced': info('projects', 'high'),
  'notification.pm.provider.accepted': info('projects'),
  // CRM et leads
  'organization.contact.assigned': todo('leads', ['schedule_call', 'assign_lead', 'view_lead']),
  // Prestations, relevés, rapports
  'notification.work.report': todo('services', ['open']),
  'notification.work.report.sent': todo('services', ['open']),
  'notification.timesheet.decision.provider': closes('services'),
  'notification.engagement.completed': closes('services'),
  'notification.engagement.completed.provider': closes('services'),
  'notification.service.report.requested': todo('services', ['open']),
  'notification.service.report.reminder': todo('services', ['open'], 'urgent'),
  'notification.service.report.submitted': closes('services'),
  'notification.service.created': info('services'),
  'notification.performance.weekly': info('services', 'low'),
  'notification.performance.monthly': info('services', 'low'),
  // IRO, agents et automatisations
  'notification.agent.result': info('iro', 'normal', ['review_run']),
  'notification.agent.report': info('iro', 'normal', ['review_run']),
  'notification.automation.report': info('automations', 'normal', ['review_run']),
  // Marketplace, abonnements
  'subscription.activated': info('marketplace'),
  'subscription.updated': info('marketplace'),
  'subscription.cancelled': info('marketplace', 'high'),
  'service.subscription.activated': info('marketplace'),
  'service.subscription.renewed': info('marketplace'),
  'service.subscription.cancelled': info('marketplace', 'high'),
  'notification.marketing.campaign': info('marketplace', 'low'),
  'notification.campaign.send': info('marketplace', 'low'),
  'notification.newsletter.send': info('marketplace', 'low'),
  'notification.form.invitation': todo('documents', ['open']),
  'notification.walkthrough.reminder': info('account', 'low'),
  // Apport d'affaires
  'notification.referral.partnership.requested': todo('referrals', ['open']),
  'notification.referral.partnership.approved': closes('referrals'),
  'notification.referral.partnership.rejected': closes('referrals'),
  'notification.referral.partnership.revoked': closes('referrals', ['open'], 'high'),
  'notification.referral.commission.earned': info('referrals'),
  'notification.referral.commission.invoice_received': info('referrals', 'normal', ['view_invoice']),
  'notification.referral.credit_note.apporteur': info('referrals'),
  'notification.referral.credit_note.provider': info('referrals'),
  'notification.referral.payout.failed': info('referrals', 'high'),
  'notification.affiliation.invitation': todo('referrals', ['open']),
  // Wallet
  'notification.withdrawal.confirmation': info('wallet'),
  'notification.withdrawal.status': info('wallet'),
  'notification.withdrawal.initiated.admin': todo('wallet', ['open']),
  'notification.withdrawal.initiated.org': info('wallet'),
  'notification.withdrawal.completed': closes('wallet'),
  'notification.withdrawal.failed': closes('wallet', ['open'], 'high'),
  'notification.deposit.confirmation': info('wallet'),
  'notification.transfer.confirmation': info('wallet'),
  'notification.transfer.otp': info('wallet', 'urgent'),
  'notification.transfer.security.alert': info('wallet', 'urgent'),
  // Compte et organisation
  'notification.org.created': info('account'),
  'notification.org.invitation': todo('account', ['open']),
  'notification.org.joined': info('account'),
  'notification.org.new.member': info('account'),
  'notification.org.role.update': info('account', 'high'),
  'notification.org.owner.transfer.otp': info('account', 'urgent'),
  'notification.auth.signup': info('account', 'low'),
  'notification.auth.email.verification': info('account'),
  'notification.auth.password.reset': info('account', 'high'),
  'notification.auth.password.reset.success': info('account'),
  'notification.auth.suspicious.login': info('account', 'urgent'),
  'notification.auth.new_device_login': info('account', 'high'),
  'notification.auth.email_change_code': info('account', 'high'),
  'notification.auth.email_changed': info('account', 'high'),
};

const PREFIX_CATEGORY: ReadonlyArray<[string, NotificationCategory]> = [
  ['invoice', 'invoices'], ['notification.invoice', 'invoices'], ['notification.estimate', 'estimates'],
  ['notification.negotiation', 'estimates'], ['notification.contract', 'contracts'], ['notification.service_flow', 'services'],
  ['notification.booking', 'agenda'], ['agenda.', 'agenda'], ['organization.task', 'tasks'], ['organization.contact', 'leads'],
  ['project.', 'projects'], ['pm.', 'projects'], ['notification.pm', 'projects'], ['notification.agent', 'iro'],
  ['notification.automation', 'automations'], ['notification.referral', 'referrals'], ['notification.affiliation', 'referrals'],
  ['notification.withdrawal', 'wallet'], ['notification.transfer', 'wallet'], ['notification.deposit', 'wallet'],
  ['subscription.', 'marketplace'], ['service.subscription', 'marketplace'], ['notification.org', 'account'], ['notification.auth', 'account'],
];

/** Descripteur d'un type d'événement, avec repli par préfixe (information, priorité normale). */
export function describeNotificationType(eventType: string | null | undefined): NotificationTypeDescriptor {
  const key = typeof eventType === 'string' ? eventType : '';
  if (Object.prototype.hasOwnProperty.call(NOTIFICATION_TYPES, key)) return NOTIFICATION_TYPES[key];
  const match = PREFIX_CATEGORY.find(([prefix]) => key.startsWith(prefix));
  return info(match ? match[1] : 'account');
}

/**
 * Capacité de la matrice `libs/shared/org-permissions` requise pour voir les notifications d'une
 * catégorie DANS une organisation (fil d'organisation et vue unifiée). Un membre sans la capacité
 * ne voit ni la ligne ni le compteur.
 */
export const NOTIFICATION_CATEGORY_PERMISSION: Record<NotificationCategory, string> = {
  crm: 'contacts.view', leads: 'contacts.view', tasks: 'tasks.view', mentions: 'tasks.view', agenda: 'tasks.view',
  projects: 'projects.use', services: 'services.view', marketplace: 'services.view',
  estimates: 'documents.view', invoices: 'documents.view', contracts: 'documents.view', documents: 'documents.view',
  automations: 'agents.use', iro: 'agents.use', wallet: 'finance.view', referrals: 'finance.view', account: 'org.view',
};

export const isNotificationCategory = (v: unknown): v is NotificationCategory =>
  typeof v === 'string' && (NOTIFICATION_CATEGORIES as readonly string[]).includes(v);
export const isNotificationTab = (v: unknown): v is NotificationTab =>
  typeof v === 'string' && (NOTIFICATION_TABS as readonly string[]).includes(v);
export const isNotificationActionState = (v: unknown): v is NotificationActionState =>
  typeof v === 'string' && (NOTIFICATION_ACTION_STATES as readonly string[]).includes(v);

// ---------------------------------------------------------------------------------------------
// Fil (thread) et idempotence
// ---------------------------------------------------------------------------------------------

export interface NotificationAudience {
  userID?: string | null;
  organizationID?: string | null;
}

const safe = (v: unknown): string | null => (typeof v === 'string' && v.trim() && v !== '0' ? v.trim() : null);

/**
 * Clé de fil : un même objet métier, pour un même destinataire, met à jour SA notification au
 * lieu d'en empiler de nouvelles (facture vue → relancée → payée = une seule ligne, historisée).
 * `null` quand l'objet n'est pas identifié : la notification vit seule.
 */
export function buildThreadKey(entityType: unknown, entityID: unknown, audience: NotificationAudience): string | null {
  const type = safe(entityType);
  const id = safe(entityID);
  if (!type || !id) return null;
  const user = safe(audience.userID);
  const org = safe(audience.organizationID);
  const who = user ? `u:${user}` : org ? `o:${org}` : null;
  if (!who) return null;
  return `${type}:${id}:${who}`.slice(0, 160);
}

/**
 * Clé d'idempotence d'un événement reçu : un rejeu (même événement, même instant, même
 * destinataire) ne produit pas de seconde notification. `occurredAt` vient de l'émetteur
 * (`timestamp`, `occurredAt`, `emittedAt`) ; à défaut l'identifiant de message ; à défaut `null`
 * (pas de garde possible, comportement historique).
 */
export function buildEventKey(eventType: string, entityID: unknown, occurredAt: unknown, audience: NotificationAudience, messageId?: unknown): string | null {
  const who = safe(audience.userID) ?? safe(audience.organizationID);
  const stamp = safe(messageId) ?? safe(occurredAt) ?? (occurredAt instanceof Date ? occurredAt.toISOString() : null);
  if (!who || !stamp) return null;
  return `${eventType}:${safe(entityID) ?? '-'}:${who}:${stamp}`.slice(0, 160);
}

// ---------------------------------------------------------------------------------------------
// Instantané `data` (aperçu léger dans le fil ; le détail complet se charge à l'ouverture)
// ---------------------------------------------------------------------------------------------

export interface NotificationActor {
  /** `user`, `organization` ou `iro` (agent de la plateforme). */
  kind: 'user' | 'organization' | 'iro' | 'system';
  id?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
}

export interface NotificationAmount {
  /** Unités mineures (centimes), devise ISO-4217 explicite. */
  amount: number;
  currency: string;
  /** `HT` / `TTC` quand c'est utile à l'affichage. */
  basis?: 'HT' | 'TTC';
}

export interface NotificationHistoryStep {
  at: string;
  eventType: string;
  label?: string;
}

export interface NotificationData {
  /** Version du contrat qui a écrit l'instantané. */
  v: number;
  actor?: NotificationActor;
  /** Espace d'origine (nom affiché sur chaque ligne de la vue unifiée). */
  origin?: { organizationID?: string | null; organizationName?: string | null };
  /** Référence métier affichée (numéro de facture, de devis, titre de tâche…). */
  reference?: string | null;
  /** Libellé principal et secondaire de la carte d'aperçu. */
  label?: string | null;
  sublabel?: string | null;
  /** Statut métier affiché (chaîne du domaine : `paid`, `overdue`, `to_confirm`…). */
  status?: string | null;
  amount?: NotificationAmount | null;
  dueAt?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  location?: string | null;
  /** Document associé (nom, type, taille) pour l'aperçu. */
  document?: { name?: string | null; kind?: string | null; sizeBytes?: number | null } | null;
  /** Instant de l'événement d'origine (ordre des mises à jour). */
  occurredAt?: string | null;
  /** Historique de l'élément, du plus récent au plus ancien, 20 étapes au plus. */
  history?: NotificationHistoryStep[];
  /** Identifiants utiles aux actions (jamais des secrets ni des jetons). */
  refs?: Record<string, string>;
  /** Clé d'événement du dernier message appliqué. */
  lastEventKey?: string | null;
}

export const NOTIFICATION_HISTORY_MAX = 20;

/** Ajoute une étape en tête de l'historique (bornée), sans doublon de clé d'événement. */
export function pushHistory(history: NotificationHistoryStep[] | undefined, step: NotificationHistoryStep): NotificationHistoryStep[] {
  const list = Array.isArray(history) ? history : [];
  if (list.some((h) => h.at === step.at && h.eventType === step.eventType)) return list;
  return [step, ...list].slice(0, NOTIFICATION_HISTORY_MAX);
}

// ---------------------------------------------------------------------------------------------
// Registre par objet métier : vocabulaire, catégorie, destination
// ---------------------------------------------------------------------------------------------

export interface NotificationEntityDescriptor {
  category: NotificationCategory;
  /** Chemin dans l'espace d'une organisation (`null` : pas de page côté organisation). */
  organizationPath: ((organizationID: string, entityID: string) => string) | null;
  /** Chemin dans l'espace personnel (`null` : pas de page personnelle). */
  personalPath: ((entityID: string) => string) | null;
}

const enc = (v: string) => encodeURIComponent(v);

/** `entityType` → où l'objet se consulte. Les libellés (vocabulaire métier) vivent dans les messages i18n. */
export const NOTIFICATION_ENTITIES: Record<string, NotificationEntityDescriptor> = {
  invoice: { category: 'invoices', organizationPath: (o, id) => `/o/${enc(o)}/invoices/${enc(id)}`, personalPath: (id) => `/invoices?invoice=${enc(id)}` },
  estimate: { category: 'estimates', organizationPath: (o, id) => `/o/${enc(o)}/estimates/${enc(id)}`, personalPath: (id) => `/estimates/${enc(id)}` },
  contract: { category: 'contracts', organizationPath: (o, id) => `/o/${enc(o)}/contracts/${enc(id)}`, personalPath: null },
  service_flow_run: { category: 'services', organizationPath: (o, id) => `/o/${enc(o)}/flows/runs/${enc(id)}`, personalPath: null },
  order: { category: 'marketplace', organizationPath: (o) => `/o/${enc(o)}/accounting/transactions`, personalPath: () => '/orders' },
  engagement: { category: 'services', organizationPath: (o) => `/o/${enc(o)}/services`, personalPath: (id) => `/engagements/${enc(id)}` },
  timesheet: { category: 'services', organizationPath: (o) => `/o/${enc(o)}/work-reports`, personalPath: (id) => `/service-reports/${enc(id)}` },
  service_report: { category: 'services', organizationPath: (o) => `/o/${enc(o)}/work-reports`, personalPath: (id) => `/service-reports/${enc(id)}` },
  service: { category: 'services', organizationPath: (o, id) => `/o/${enc(o)}/services/${enc(id)}`, personalPath: null },
  organization_task: { category: 'tasks', organizationPath: (o, id) => `/o/${enc(o)}/tasks?task=${enc(id)}`, personalPath: null },
  project_activity: { category: 'projects', organizationPath: (o, id) => `/o/${enc(o)}/projects?activity=${enc(id)}`, personalPath: null },
  pm_session: { category: 'projects', organizationPath: (o, id) => `/o/${enc(o)}/pm/${enc(id)}/suivi`, personalPath: (id) => `/pm/${enc(id)}/suivi` },
  organization_contact: { category: 'leads', organizationPath: (o, id) => `/o/${enc(o)}/contacts?contact=${enc(id)}`, personalPath: null },
  agenda_event: { category: 'agenda', organizationPath: (o, id) => `/o/${enc(o)}/agenda?event=${enc(id)}`, personalPath: null },
  agenda_reminder: { category: 'agenda', organizationPath: (o) => `/o/${enc(o)}/agenda`, personalPath: null },
  agent_run: { category: 'iro', organizationPath: (o, id) => `/o/${enc(o)}/agents/runs/${enc(id)}`, personalPath: null },
  agent: { category: 'iro', organizationPath: (o, id) => `/o/${enc(o)}/agents/${enc(id)}`, personalPath: null },
  automation_run: { category: 'automations', organizationPath: (o, id) => `/o/${enc(o)}/automations?run=${enc(id)}`, personalPath: null },
  form: { category: 'documents', organizationPath: (o) => `/o/${enc(o)}/agents`, personalPath: null },
  campaign: { category: 'marketplace', organizationPath: (o) => `/o/${enc(o)}/contacts`, personalPath: null },
  referral_partnership: { category: 'referrals', organizationPath: (o) => `/o/${enc(o)}/referrals`, personalPath: () => '/affiliation' },
  referral_commission: { category: 'referrals', organizationPath: (o) => `/o/${enc(o)}/referrals`, personalPath: () => '/affiliation' },
  affiliation: { category: 'referrals', organizationPath: null, personalPath: () => '/affiliation' },
  service_subscription: { category: 'marketplace', organizationPath: (o) => `/o/${enc(o)}/services`, personalPath: () => '/billing' },
  wallet: { category: 'wallet', organizationPath: (o) => `/o/${enc(o)}/accounting/transactions`, personalPath: () => '/billing' },
  organization: { category: 'account', organizationPath: (o) => `/o/${enc(o)}`, personalPath: null },
  user: { category: 'account', organizationPath: null, personalPath: () => '/details' },
  onboarding: { category: 'account', organizationPath: (o) => `/o/${enc(o)}`, personalPath: () => '/' },
};

export function describeNotificationEntity(entityType: string | null | undefined): NotificationEntityDescriptor | null {
  const key = typeof entityType === 'string' ? entityType : '';
  return Object.prototype.hasOwnProperty.call(NOTIFICATION_ENTITIES, key) ? NOTIFICATION_ENTITIES[key] : null;
}

/** Page d'un objet, selon l'espace courant ; `null` si aucune page ne lui correspond. */
export function notificationEntityPath(entityType: string | null | undefined, entityID: string | null | undefined, organizationID?: string | null): string | null {
  const entity = describeNotificationEntity(entityType);
  const id = safe(entityID);
  if (!entity || !id) return null;
  const org = safe(organizationID);
  if (org && entity.organizationPath) return entity.organizationPath(org, id);
  if (entity.personalPath) return entity.personalPath(id);
  return null;
}

// ---------------------------------------------------------------------------------------------
// Vue d'une notification telle que servie par le fil (SDK, webapp, mobile)
// ---------------------------------------------------------------------------------------------

export interface NotificationFeedItem {
  notificationID: string;
  userID?: string | null;
  organizationID?: string | null;
  eventType?: string | null;
  category: NotificationCategory;
  priority: NotificationPriority;
  actionState: NotificationActionState;
  actedAt?: string | null;
  actedByUserID?: string | null;
  snoozedUntil?: string | null;
  threadKey?: string | null;
  actorID?: string | null;
  title: string;
  message: string;
  link?: string | null;
  entityType?: string | null;
  entityID?: string | null;
  readAt?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  data?: NotificationData | null;
}

export interface NotificationCounters {
  unread: number;
  todo: number;
  todoByCategory: Partial<Record<NotificationCategory, number>>;
  /** Par espace (vue unifiée seulement) : `organizationID` → compteurs ; `personal` pour le fil personnel. */
  byScope?: Record<string, { unread: number; todo: number }>;
}

/** Une notification est « à traiter » tant qu'une action est attendue et qu'elle n'est pas reportée. */
export function isTodo(n: Pick<NotificationFeedItem, 'actionState' | 'snoozedUntil'>, now = new Date()): boolean {
  if (n.actionState !== 'pending') return false;
  return !n.snoozedUntil || new Date(n.snoozedUntil).getTime() <= now.getTime();
}

export function isSnoozed(n: Pick<NotificationFeedItem, 'snoozedUntil'>, now = new Date()): boolean {
  return !!n.snoozedUntil && new Date(n.snoozedUntil).getTime() > now.getTime();
}

export function matchesTab(n: NotificationFeedItem, tab: NotificationTab, now = new Date()): boolean {
  switch (tab) {
    case 'todo': return isTodo(n, now);
    case 'unread': return !n.readAt && !isSnoozed(n, now);
    case 'snoozed': return isSnoozed(n, now);
    case 'done': return n.actionState === 'done' || n.actionState === 'dismissed';
    default: return true;
  }
}
