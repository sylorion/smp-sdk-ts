/* ┌──────────────────────────────────────────────────────────────────────────┐
   │  FICHIER GÉNÉRÉ — NE PAS MODIFIER ICI                                    │
   │                                                                          │
   │  Source de vérité : libs/shared/service-profiles/service-profiles.ts
   │  Régénérer        : ./scripts/sync-service-profiles.sh                   │
   │  Vérifier (CI)    : ./scripts/sync-service-profiles.sh --check           │
   │                                                                          │
   │  Toute modification faite directement dans ce fichier sera écrasée à la   │
   │  prochaine synchronisation, et fera échouer le contrôle de dérive.        │
   └──────────────────────────────────────────────────────────────────────────┘ */

// libs/shared/service-profiles/service-profiles.ts
//
// Catalogue des PROFILS MÉTIER de service (docs/architecture/workflows-de-service.md §3.2).
//
// Un profil est une combinaison NOMMÉE des enums déjà portés par `Service`
// (mu-catalog) : `uptakeForm` × `billingPlan` × `supplyType`. Il déclare ce que la
// plateforme sait faire pour ce métier : les attributs de l'OBJET de la prestation
// à renseigner (`ServiceAttribute`, clé = valeur), les variables de contrat qu'ils
// alimentent, les étapes de flow autorisées, le modèle de contrat et les
// automatisations par défaut, et des OPTIONS SUGGÉRÉES (raccourcis vers la création
// d'un `Asset` complet — un profil ne stocke jamais une option).
//
// La nature (`ServiceKind`) se DÉRIVE de la combinaison ; l'organisation ne déclare
// un code de profil (`ServiceAttribute` `profile_code`) que pour lever une
// ambiguïté. Prix et devise viennent de `Service.price` / `Service.currency`,
// jamais du profil. Fonctions pures, sans dépendance.
//
// COHÉRENCE : toutes les combinaisons d'enums ne sont pas exécutables par la
// plateforme (un « instantané » facturé au mois n'a ni abonnement ni échéance).
// `checkServiceCombination` dit si une combinaison est exécutable et, sinon, quel
// réglage changer ; un profil n'est compatible qu'avec une combinaison cohérente,
// et chaque combinaison cohérente a au moins un profil métier (vérifié par les tests).

export const UPTAKE_FORMS = ['instant', 'periodic', 'prestation', 'booking_required'] as const;
export type UptakeForm = (typeof UPTAKE_FORMS)[number];

export const BILLING_PLANS = ['usage', 'mixed', 'direct', 'minute', 'unit', 'hourly', 'dayly', 'mensual', 'trimestrial', 'semestrial', 'annual'] as const;
export type BillingPlan = (typeof BILLING_PLANS)[number];

export const SUPPLY_TYPES = ['irl', 'online', 'mixed'] as const;
export type SupplyType = (typeof SUPPLY_TYPES)[number];

export const SERVICE_KINDS = ['one_off', 'appointment', 'rental', 'subscription', 'quoted_mission', 'recurring_service'] as const;
export type ServiceKind = (typeof SERVICE_KINDS)[number];

export const PROFILE_FAMILIES = ['consulting', 'person', 'rental', 'on_site', 'event_creative', 'digital', 'transport', 'leisure', 'b2b_admin', 'fallback'] as const;
export type ProfileFamily = (typeof PROFILE_FAMILIES)[number];

// ─── Cohérence modalité × facturation ────────────────────────────────────────

/** Facturations des abonnements Stripe (`mu-catalog` `periodicRecurring`). */
export const RECURRING_BILLING_PLANS = ['mensual', 'trimestrial', 'semestrial', 'annual'] as const satisfies readonly BillingPlan[];

/**
 * Facturations que la plateforme sait exécuter pour chaque modalité d'achat :
 * - `instant` / `booking_required` : un encaissement unique (prix fixe ou par unité de temps / quantité) ;
 * - `periodic` : un abonnement Stripe, donc une échéance mensuelle à annuelle ;
 * - `prestation` : le devis fixe le montant final, d'où « à l'usage » et « mixte ».
 * La minute suppose un créneau réservé : pas de minute en instantané.
 * Le canal (`supplyType`) ne change pas le mécanisme ; il oriente seulement le profil.
 */
export const BILLING_PLANS_BY_UPTAKE = {
  instant: ['direct', 'unit', 'hourly', 'dayly'],
  booking_required: ['direct', 'unit', 'minute', 'hourly', 'dayly'],
  periodic: RECURRING_BILLING_PLANS,
  prestation: ['direct', 'usage', 'mixed', 'unit', 'hourly', 'dayly'],
} as const satisfies Readonly<Record<UptakeForm, readonly BillingPlan[]>>;

/** Facturations exécutables pour la modalité `U` (type). */
export type BillingPlanFor<U extends UptakeForm> = (typeof BILLING_PLANS_BY_UPTAKE)[U][number];

/**
 * Combinaison exécutable par la plateforme, vérifiée À LA COMPILATION :
 * `{ uptakeForm: 'instant', billingPlan: 'mensual', supplyType: 'irl' }` ne compile pas.
 * Union discriminée par `uptakeForm` ; à utiliser pour toute création ou modification
 * de ces trois réglages (SDK, webapp, services).
 */
export type ServiceCombination = {
  [U in UptakeForm]: { uptakeForm: U; billingPlan: BillingPlanFor<U>; supplyType: SupplyType };
}[UptakeForm];

/** Toutes les combinaisons exécutables (figées), dans l'ordre des enums. */
export const SERVICE_COMBINATIONS: readonly ServiceCombination[] = UPTAKE_FORMS.flatMap((u) =>
  (BILLING_PLANS_BY_UPTAKE[u] as readonly BillingPlan[]).flatMap((b) =>
    SUPPLY_TYPES.map((sp) => ({ uptakeForm: u, billingPlan: b, supplyType: sp }) as ServiceCombination)));

/** Garde de type : la valeur (venue d'une saisie, d'une base, d'un appel) est-elle une combinaison exécutable ? */
export function isServiceCombination(value: { uptakeForm?: unknown; billingPlan?: unknown; supplyType?: unknown } | null | undefined): value is ServiceCombination {
  if (!value) return false;
  const { uptakeForm: u, billingPlan: b, supplyType: sp } = value;
  return typeof u === 'string' && typeof b === 'string' && typeof sp === 'string'
    && (UPTAKE_FORMS as readonly string[]).includes(u)
    && (SUPPLY_TYPES as readonly string[]).includes(sp)
    && (BILLING_PLANS_BY_UPTAKE[u as UptakeForm] as readonly string[]).includes(b);
}

export type CombinationIssueCode =
  | 'UPTAKE_FORM_UNKNOWN'
  | 'BILLING_PLAN_UNKNOWN'
  | 'SUPPLY_TYPE_UNKNOWN'
  | 'BILLING_PLAN_INCOMPATIBLE'
  | 'NO_PROFILE';

export interface CombinationIssue {
  code: CombinationIssueCode;
  /** Réglage à changer sur la fiche du service. */
  field: 'uptakeForm' | 'billingPlan' | 'supplyType';
  message: string;
  /** Facturations acceptées par la modalité (vide si la modalité est inconnue). */
  allowedBillingPlans: readonly BillingPlan[];
}

export type StepCapability = 'questionnaire' | 'documents' | 'contract' | 'review_before_payment' | 'review_after_payment' | 'condition' | 'inspection' | 'deposit' | 'closure';

export type AttributeType = 'text' | 'textarea' | 'money' | 'integer' | 'select' | 'date';

/** Attribut de l'objet de la prestation, stocké en `ServiceAttribute` (valeur texte ≤ 255 car.). */
export interface ProfileAttribute {
  /** Clé `attributeName` (snake_case, ≤ 32 car.). */
  key: string;
  type: AttributeType;
  /** Exigé pour que les flows du profil soient activables (pre-flight `SERVICE_PROFILE_INCOMPLETE`). */
  required?: boolean;
  options?: readonly string[];
  /** Variables de contrat alimentées (contexte `service.attributes.<key>`, alias universels). */
  feeds?: readonly string[];
}

/** Option suggérée : un raccourci qui pré-remplit un `Asset` ; l'organisation le complète (prix, stock…) et le valide. */
export interface SuggestedOption {
  key: string;
  label: string;
}

export interface ServiceProfile {
  code: string;
  family: ProfileFamily;
  label: string;
  kind: ServiceKind;
  uptakeForms: readonly UptakeForm[];
  billingPlans: readonly BillingPlan[];
  supplyTypes: readonly SupplyType[];
  attributes: readonly ProfileAttribute[];
  stepsBeforePayment: readonly StepCapability[];
  stepsAfterPayment: readonly StepCapability[];
  /** Modèle standard mu-contract proposé à la création d'un flow (null : pas de contrat par défaut). */
  defaultContractTemplate: string | null;
  /** Clés des modèles d'automatisation proposés (smp-webapp `lib/automations/model.ts`). */
  defaultAutomations: readonly string[];
  suggestedOptions: readonly SuggestedOption[];
}

export const PROFILE_CODE_ATTRIBUTE = 'profile_code';

// ─── Briques réutilisées ─────────────────────────────────────────────────────

const ALL_UPTAKE: readonly UptakeForm[] = UPTAKE_FORMS;
const ALL_PLANS: readonly BillingPlan[] = BILLING_PLANS;
const ALL_SUPPLY: readonly SupplyType[] = SUPPLY_TYPES;

const BEFORE: readonly StepCapability[] = ['questionnaire', 'documents', 'contract', 'review_before_payment', 'review_after_payment', 'condition'];
const BEFORE_NO_AFTER_REVIEW: readonly StepCapability[] = ['questionnaire', 'documents', 'contract', 'review_before_payment', 'condition'];
const CLOSURE: readonly StepCapability[] = ['closure'];
const RENTAL_AFTER: readonly StepCapability[] = ['inspection', 'deposit', 'closure'];

const scope: ProfileAttribute = { key: 'mission_scope', type: 'textarea', feeds: ['mission_scope', 'mission_description'] };
const deliverables: ProfileAttribute = { key: 'deliverables', type: 'textarea', feeds: ['deliverables'] };
const duration: ProfileAttribute = { key: 'duration_min', type: 'integer', feeds: ['duration'] };
const location: ProfileAttribute = { key: 'location_mode', type: 'select', options: ['on_site', 'remote', 'both'], feeds: ['location_mode'] };
const deposit: ProfileAttribute = { key: 'deposit_amount', type: 'money', feeds: ['deposit_amount'] };
const rateWeek: ProfileAttribute = { key: 'rate_week', type: 'money', feeds: ['weekly_rate'] };
const rateMonth: ProfileAttribute = { key: 'rate_month', type: 'money', feeds: ['monthly_rate', 'monthly_rent'] };
const minDays: ProfileAttribute = { key: 'min_days', type: 'integer' };
const pickup: ProfileAttribute = { key: 'pickup_location', type: 'text', feeds: ['pickup_location', 'delivery_location'] };
const returnLoc: ProfileAttribute = { key: 'return_location', type: 'text', feeds: ['return_location'] };
const warranty: ProfileAttribute = { key: 'warranty_days', type: 'integer', feeds: ['warranty_days'] };

const p = (x: ServiceProfile): ServiceProfile => x;

// ─── Les 32 profils ──────────────────────────────────────────────────────────

export const SERVICE_PROFILES: readonly ServiceProfile[] = [
  // Conseil & expertise
  p({ code: 'consulting_mission', family: 'consulting', label: 'Mission de conseil', kind: 'one_off',
    uptakeForms: ['instant', 'prestation'], billingPlans: ['direct', 'usage', 'mixed'], supplyTypes: ALL_SUPPLY,
    attributes: [{ ...scope, required: true }, deliverables, { key: 'duration_days', type: 'integer', feeds: ['duration_days'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'consulting-agreement',
    defaultAutomations: ['quote_followup', 'post_service_review'], suggestedOptions: [{ key: 'restitution_workshop', label: 'Atelier de restitution' }, { key: 'extra_days', label: 'Jours supplémentaires' }] }),
  p({ code: 'freelance_time', family: 'consulting', label: 'Freelance en régie (temps passé)', kind: 'one_off',
    uptakeForms: ['instant', 'periodic'], billingPlans: ['dayly', 'hourly'], supplyTypes: ALL_SUPPLY,
    attributes: [{ key: 'min_commitment', type: 'integer', feeds: ['min_commitment'] }, scope],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'freelance-agreement',
    defaultAutomations: ['weekly_report', 'post_service_review'], suggestedOptions: [{ key: 'on_call', label: 'Astreinte' }, { key: 'overtime', label: 'Heures supplémentaires' }] }),
  p({ code: 'audit_report', family: 'consulting', label: 'Audit / diagnostic avec livrable', kind: 'one_off',
    uptakeForms: ['instant', 'prestation'], billingPlans: ['direct'], supplyTypes: ALL_SUPPLY,
    attributes: [{ ...scope, key: 'audit_scope', required: true, feeds: ['audit_scope', 'mission_scope'] }, { key: 'report_format', type: 'text', feeds: ['report_format'] }, { key: 'site_visit', type: 'select', options: ['yes', 'no'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'consulting-agreement',
    defaultAutomations: ['missing_documents_reminder'], suggestedOptions: [{ key: 'site_visit', label: 'Visite sur site' }, { key: 'english_version', label: 'Version anglaise du rapport' }] }),
  p({ code: 'training_session', family: 'consulting', label: 'Formation / atelier', kind: 'appointment',
    uptakeForms: ['instant', 'booking_required'], billingPlans: ['unit', 'direct', 'dayly'], supplyTypes: ALL_SUPPLY,
    attributes: [{ key: 'program', type: 'textarea', required: true, feeds: ['training_program'] }, { key: 'max_participants', type: 'integer', feeds: ['max_participants'] }, location],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['reminder_day_before', 'post_service_review'], suggestedOptions: [{ key: 'extra_participant', label: 'Participant supplémentaire' }, { key: 'printed_material', label: 'Support imprimé' }, { key: 'certification', label: 'Certification' }] }),
  p({ code: 'coaching_program', family: 'consulting', label: 'Accompagnement (séances)', kind: 'recurring_service',
    uptakeForms: ['booking_required', 'periodic'], billingPlans: ['unit', 'mensual'], supplyTypes: ALL_SUPPLY,
    attributes: [{ ...duration, key: 'session_duration', required: true, feeds: ['session_duration'] }, { key: 'sessions_count', type: 'integer', feeds: ['sessions_count'] }],
    stepsBeforePayment: BEFORE_NO_AFTER_REVIEW, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['session_reminder', 'abandoned_flow_reminder'], suggestedOptions: [{ key: 'extra_session', label: 'Séance supplémentaire' }, { key: 'messaging_followup', label: 'Suivi par messagerie' }] }),

  // Rendez-vous & personne
  p({ code: 'appointment', family: 'person', label: 'Rendez-vous simple', kind: 'appointment',
    uptakeForms: ['booking_required'], billingPlans: ['direct', 'hourly', 'minute'], supplyTypes: ['irl', 'online', 'mixed'],
    attributes: [{ ...duration, required: true }, location],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: null,
    defaultAutomations: ['reminder_day_before'], suggestedOptions: [{ key: 'extension', label: 'Prolongation' }, { key: 'travel', label: 'Déplacement' }] }),
  p({ code: 'wellness_care', family: 'person', label: 'Soins & bien-être', kind: 'appointment',
    uptakeForms: ['booking_required'], billingPlans: ['direct', 'minute'], supplyTypes: ['irl'],
    attributes: [{ ...duration, required: true }, { key: 'contraindications', type: 'select', required: true, options: ['form_required', 'none'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: null,
    defaultAutomations: ['reminder_day_before', 'post_service_review'], suggestedOptions: [{ key: 'complementary_care', label: 'Soin complémentaire' }, { key: 'extension', label: 'Prolongation' }] }),
  p({ code: 'tutoring', family: 'person', label: 'Cours particuliers', kind: 'appointment',
    uptakeForms: ['booking_required', 'periodic'], billingPlans: ['hourly'], supplyTypes: ALL_SUPPLY,
    attributes: [{ key: 'subject', type: 'text', required: true, feeds: ['subject'] }, { key: 'level', type: 'text', feeds: ['level'] }, location],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: null,
    defaultAutomations: ['session_reminder', 'monthly_report'], suggestedOptions: [{ key: 'extra_hour', label: 'Heure supplémentaire' }, { key: 'course_material', label: 'Support de cours' }] }),
  p({ code: 'regulated_professional', family: 'person', label: 'Profession réglementée (avocat, expert-comptable)', kind: 'appointment',
    uptakeForms: ['booking_required', 'prestation'], billingPlans: ['hourly', 'direct'], supplyTypes: ALL_SUPPLY,
    attributes: [{ key: 'profession', type: 'text', required: true, feeds: ['profession'] }, { key: 'mandate_required', type: 'select', options: ['yes', 'no'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['missing_documents_reminder'], suggestedOptions: [{ key: 'extra_meeting', label: 'Rendez-vous supplémentaire' }, { key: 'priority', label: 'Traitement prioritaire' }] }),

  // Location
  p({ code: 'vehicle_rental', family: 'rental', label: 'Location de véhicule', kind: 'rental',
    uptakeForms: ['instant', 'booking_required'], billingPlans: ['dayly'], supplyTypes: ['irl'],
    attributes: [
      { key: 'vehicle_brand', type: 'text', required: true, feeds: ['vehicle_brand'] },
      { key: 'vehicle_model', type: 'text', required: true, feeds: ['vehicle_model'] },
      { key: 'vehicle_plate', type: 'text', required: true, feeds: ['vehicle_plate'] },
      { key: 'vehicle_year', type: 'text', feeds: ['vehicle_year'] },
      { key: 'vehicle_category', type: 'text', feeds: ['vehicle_category'] },
      { key: 'mileage_included', type: 'integer', feeds: ['mileage_limit', 'mileage_included'] },
      { key: 'mileage_extra_cost', type: 'money', feeds: ['mileage_extra_cost'] },
      { key: 'fuel_policy', type: 'select', options: ['full_to_full', 'same_level', 'prepaid'], feeds: ['fuel_policy'] },
      { ...deposit, required: true }, { key: 'franchise_amount', type: 'money', feeds: ['franchise_amount'] }, { key: 'insurance_type', type: 'text', feeds: ['insurance_type'] },
      rateWeek, rateMonth, minDays, pickup, returnLoc,
    ],
    stepsBeforePayment: BEFORE, stepsAfterPayment: RENTAL_AFTER, defaultContractTemplate: 'car-rental-agreement',
    defaultAutomations: ['abandoned_flow_reminder', 'return_reminder', 'post_service_review'],
    suggestedOptions: [{ key: 'snow_tires', label: 'Pneus neige' }, { key: 'snow_chains', label: 'Chaînes' }, { key: 'child_seat', label: 'Siège enfant' }, { key: 'extra_km', label: 'Kilomètres supplémentaires' }, { key: 'second_driver', label: 'Second conducteur' }, { key: 'franchise_buyout', label: 'Rachat de franchise' }] }),
  p({ code: 'equipment_rental', family: 'rental', label: 'Location de matériel', kind: 'rental',
    uptakeForms: ['instant', 'booking_required'], billingPlans: ['dayly', 'hourly'], supplyTypes: ['irl'],
    attributes: [
      { key: 'equipment_label', type: 'text', required: true, feeds: ['equipment_description', 'equipment_label'] },
      { key: 'serial_number', type: 'text', feeds: ['serial_number'] },
      { key: 'equipment_value', type: 'money', feeds: ['equipment_value'] },
      { ...deposit, required: true }, rateWeek, rateMonth, minDays, pickup,
    ],
    stepsBeforePayment: BEFORE, stepsAfterPayment: RENTAL_AFTER, defaultContractTemplate: 'car-rental-agreement',
    defaultAutomations: ['return_reminder', 'post_service_review'],
    suggestedOptions: [{ key: 'accessories', label: 'Accessoires' }, { key: 'consumables', label: 'Consommables' }, { key: 'delivery_pickup', label: 'Livraison / reprise' }, { key: 'breakage_insurance', label: 'Assurance casse' }] }),
  p({ code: 'space_rental', family: 'rental', label: "Location d'espace (salle, local)", kind: 'rental',
    uptakeForms: ['booking_required'], billingPlans: ['hourly', 'dayly'], supplyTypes: ['irl'],
    attributes: [{ key: 'space_label', type: 'text', required: true, feeds: ['space_label', 'equipment_description'] }, { key: 'capacity', type: 'integer', required: true, feeds: ['capacity'] }, { key: 'surface_m2', type: 'integer', feeds: ['surface_m2'] }, { key: 'opening_hours', type: 'text', feeds: ['opening_hours'] }, deposit, rateWeek, rateMonth],
    stepsBeforePayment: BEFORE, stepsAfterPayment: RENTAL_AFTER, defaultContractTemplate: 'lease-agreement',
    defaultAutomations: ['reminder_day_before', 'post_service_review'],
    suggestedOptions: [{ key: 'projector', label: 'Vidéoprojecteur' }, { key: 'catering', label: 'Traiteur' }, { key: 'extra_hour', label: 'Heure supplémentaire' }, { key: 'cleaning', label: 'Nettoyage' }] }),
  p({ code: 'property_lease', family: 'rental', label: 'Bail immobilier', kind: 'rental',
    uptakeForms: ['prestation', 'periodic'], billingPlans: ['mensual'], supplyTypes: ['irl'],
    attributes: [{ key: 'property_address', type: 'textarea', required: true, feeds: ['property_address'] }, { key: 'surface_m2', type: 'integer', feeds: ['surface_m2'] }, { ...deposit, required: true }, { key: 'lease_months', type: 'integer', required: true, feeds: ['lease_months'] }],
    stepsBeforePayment: BEFORE_NO_AFTER_REVIEW, stepsAfterPayment: RENTAL_AFTER, defaultContractTemplate: 'lease-agreement',
    defaultAutomations: ['missing_documents_reminder', 'due_date_reminder'],
    suggestedOptions: [{ key: 'parking', label: 'Place de parking' }, { key: 'furnished', label: 'Meublé' }, { key: 'cellar', label: 'Cave' }] }),
  p({ code: 'accommodation_stay', family: 'rental', label: 'Hébergement (nuitées)', kind: 'rental',
    uptakeForms: ['booking_required'], billingPlans: ['dayly'], supplyTypes: ['irl'],
    attributes: [{ key: 'capacity', type: 'integer', required: true, feeds: ['capacity'] }, { key: 'check_in', type: 'text', required: true, feeds: ['check_in'] }, { key: 'check_out', type: 'text', required: true, feeds: ['check_out'] }, { key: 'house_rules', type: 'textarea', feeds: ['house_rules'] }, deposit],
    stepsBeforePayment: BEFORE, stepsAfterPayment: RENTAL_AFTER, defaultContractTemplate: 'lease-agreement',
    defaultAutomations: ['arrival_reminder', 'post_service_review'],
    suggestedOptions: [{ key: 'baby_bed', label: 'Lit bébé' }, { key: 'breakfast', label: 'Petit-déjeuner' }, { key: 'final_cleaning', label: 'Ménage de fin de séjour' }, { key: 'pet', label: 'Animal' }] }),

  // Intervention sur site
  p({ code: 'home_service', family: 'on_site', label: 'Service à domicile (ménage, jardin)', kind: 'recurring_service',
    uptakeForms: ['instant', 'booking_required', 'periodic'], billingPlans: ['hourly', 'unit', 'direct'], supplyTypes: ['irl'],
    attributes: [{ key: 'service_area', type: 'text', required: true, feeds: ['service_area'] }, { key: 'access_instructions', type: 'textarea', feeds: ['access_instructions'] }, scope],
    stepsBeforePayment: BEFORE_NO_AFTER_REVIEW, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['reminder_day_before', 'weekly_report'],
    suggestedOptions: [{ key: 'supplies', label: 'Produits fournis' }, { key: 'windows', label: 'Vitres' }, { key: 'ironing', label: 'Repassage' }] }),
  p({ code: 'onsite_subscription', family: 'on_site', label: "Contrat d'entretien / abonnement sur site", kind: 'subscription',
    uptakeForms: ['periodic'], billingPlans: RECURRING_BILLING_PLANS, supplyTypes: ['irl'],
    attributes: [{ key: 'service_area', type: 'text', required: true, feeds: ['service_area'] }, { key: 'visit_frequency', type: 'text', required: true, feeds: ['visit_frequency'] }, { key: 'access_instructions', type: 'textarea', feeds: ['access_instructions'] }, scope],
    stepsBeforePayment: BEFORE_NO_AFTER_REVIEW, stepsAfterPayment: [], defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['due_date_reminder', 'monthly_report'],
    suggestedOptions: [{ key: 'extra_visit', label: 'Passage supplémentaire' }, { key: 'supplies', label: 'Produits / pièces fournis' }, { key: 'priority_callout', label: 'Intervention prioritaire' }] }),
  p({ code: 'repair_intervention', family: 'on_site', label: 'Dépannage / réparation', kind: 'one_off',
    uptakeForms: ['instant', 'booking_required', 'prestation'], billingPlans: ['direct', 'usage', 'mixed'], supplyTypes: ['irl'],
    attributes: [{ key: 'equipment_types', type: 'text', required: true, feeds: ['equipment_types'] }, { key: 'callout_fee', type: 'money', feeds: ['callout_fee'] }, warranty],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['quote_followup', 'post_service_review'],
    suggestedOptions: [{ key: 'parts', label: 'Pièces' }, { key: 'out_of_zone', label: 'Déplacement hors zone' }, { key: 'urgent', label: 'Intervention urgente' }] }),
  p({ code: 'installation', family: 'on_site', label: 'Pose / installation', kind: 'one_off',
    uptakeForms: ['booking_required', 'prestation'], billingPlans: ['direct'], supplyTypes: ['irl'],
    attributes: [{ key: 'product_types', type: 'text', required: true, feeds: ['product_types'] }, { key: 'site_requirements', type: 'textarea', feeds: ['site_requirements'] }, warranty],
    stepsBeforePayment: BEFORE, stepsAfterPayment: ['inspection', 'closure'], defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['reminder_day_before', 'post_service_review'],
    suggestedOptions: [{ key: 'old_equipment_pickup', label: "Reprise de l'ancien matériel" }, { key: 'extended_warranty', label: 'Extension de garantie' }] }),
  p({ code: 'moving_logistics', family: 'on_site', label: 'Déménagement / transport de biens', kind: 'one_off',
    uptakeForms: ['booking_required', 'prestation'], billingPlans: ['direct', 'unit', 'usage'], supplyTypes: ['irl'],
    attributes: [{ key: 'max_volume_m3', type: 'integer', feeds: ['max_volume_m3'] }, { key: 'insurance_type', type: 'text', feeds: ['insurance_type'] }, { key: 'service_area', type: 'text', required: true, feeds: ['service_area'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: ['inspection', 'closure'], defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['quote_followup', 'reminder_day_before'],
    suggestedOptions: [{ key: 'boxes', label: 'Cartons' }, { key: 'packing', label: 'Emballage' }, { key: 'storage', label: 'Garde-meuble' }, { key: 'furniture_lift', label: 'Monte-meuble' }] }),

  // Événementiel & créatif
  p({ code: 'event_service', family: 'event_creative', label: 'Prestation événementielle (traiteur, photo, DJ)', kind: 'appointment',
    uptakeForms: ['booking_required', 'prestation'], billingPlans: ['unit', 'hourly', 'direct'], supplyTypes: ['irl'],
    attributes: [{ key: 'event_types', type: 'text', required: true, feeds: ['event_types'] }, { key: 'min_guests', type: 'integer', feeds: ['min_guests'] }, { key: 'travel_radius_km', type: 'integer', feeds: ['travel_radius_km'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['quote_followup', 'reminder_week_before', 'post_service_review'],
    suggestedOptions: [{ key: 'extra_hour', label: 'Heure supplémentaire' }, { key: 'bar', label: 'Option bar' }, { key: 'sound_equipment', label: 'Matériel son' }] }),
  p({ code: 'creative_deliverable', family: 'event_creative', label: 'Livrable créatif (design, rédaction, vidéo)', kind: 'one_off',
    uptakeForms: ['instant', 'prestation'], billingPlans: ['direct', 'unit'], supplyTypes: ['online', 'mixed'],
    attributes: [{ key: 'deliverable_types', type: 'text', required: true, feeds: ['deliverable_types', 'deliverables'] }, { key: 'revisions_included', type: 'integer', feeds: ['revisions_included'] }, { key: 'rights_transfer', type: 'select', options: ['full', 'limited', 'none'], feeds: ['rights_scope'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'freelance-agreement',
    defaultAutomations: ['brief_reminder', 'post_service_review'],
    suggestedOptions: [{ key: 'extra_revision', label: 'Révision supplémentaire' }, { key: 'express_delivery', label: 'Livraison express' }, { key: 'source_files', label: 'Fichiers sources' }] }),
  p({ code: 'performance_booking', family: 'event_creative', label: 'Cachet artiste / intervenant', kind: 'appointment',
    uptakeForms: ['booking_required', 'prestation'], billingPlans: ['direct'], supplyTypes: ['irl'],
    attributes: [{ key: 'performance_type', type: 'text', required: true, feeds: ['performance_type'] }, duration, { key: 'technical_rider', type: 'textarea', feeds: ['technical_requirements'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['reminder_week_before'],
    suggestedOptions: [{ key: 'extra_set', label: 'Set supplémentaire' }, { key: 'technician', label: 'Technicien' }, { key: 'travel', label: 'Déplacement' }] }),

  // Numérique
  p({ code: 'software_project', family: 'digital', label: 'Projet logiciel', kind: 'quoted_mission',
    uptakeForms: ['prestation'], billingPlans: ['direct', 'usage', 'mixed'], supplyTypes: ['online', 'mixed'],
    attributes: [{ key: 'stack', type: 'text', feeds: ['stack'] }, { key: 'acceptance_process', type: 'textarea', feeds: ['acceptance_criteria'] }, { key: 'ip_terms', type: 'select', options: ['transfer', 'license'], feeds: ['ip_terms'] }],
    stepsBeforePayment: [], stepsAfterPayment: [], defaultContractTemplate: 'freelance-agreement',
    defaultAutomations: ['quote_followup', 'weekly_report'],
    suggestedOptions: [{ key: 'maintenance', label: 'Maintenance post-livraison' }, { key: 'training', label: 'Formation' }, { key: 'hosting', label: 'Hébergement' }] }),
  p({ code: 'managed_service', family: 'digital', label: 'Service managé (infogérance, maintenance)', kind: 'subscription',
    uptakeForms: ['periodic'], billingPlans: ['mensual', 'trimestrial', 'semestrial', 'annual'], supplyTypes: ['online', 'mixed'],
    attributes: [{ key: 'sla_level', type: 'text', required: true, feeds: ['sla_level'] }, { ...scope, required: true }, { key: 'on_call', type: 'select', options: ['yes', 'no'] }],
    stepsBeforePayment: BEFORE_NO_AFTER_REVIEW, stepsAfterPayment: [], defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['monthly_report', 'due_date_reminder'],
    suggestedOptions: [{ key: 'extended_on_call', label: 'Astreinte étendue' }, { key: 'higher_sla', label: 'SLA supérieur' }, { key: 'extra_users', label: 'Utilisateurs supplémentaires' }] }),
  p({ code: 'digital_subscription', family: 'digital', label: 'Abonnement numérique (SaaS)', kind: 'subscription',
    uptakeForms: ['periodic'], billingPlans: ['mensual', 'semestrial', 'annual'], supplyTypes: ['online'],
    attributes: [{ key: 'plan_name', type: 'text', required: true, feeds: ['plan_name'] }, { key: 'quotas', type: 'textarea', feeds: ['quotas'] }, { key: 'cancellation_terms', type: 'textarea', feeds: ['cancellation_terms'] }],
    stepsBeforePayment: BEFORE_NO_AFTER_REVIEW, stepsAfterPayment: [], defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['due_date_reminder', 'churn_followup'],
    suggestedOptions: [{ key: 'module', label: 'Module' }, { key: 'extra_seats', label: 'Sièges supplémentaires' }, { key: 'extra_quota', label: 'Quota étendu' }] }),

  // Transport
  p({ code: 'delivery_run', family: 'transport', label: 'Course / livraison', kind: 'one_off',
    uptakeForms: ['instant', 'booking_required'], billingPlans: ['unit', 'usage'], supplyTypes: ['irl'],
    attributes: [{ key: 'max_weight_kg', type: 'integer', feeds: ['max_weight_kg'] }, { key: 'service_area', type: 'text', required: true, feeds: ['service_area'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: null,
    defaultAutomations: ['slot_reminder'],
    suggestedOptions: [{ key: 'extra_parcel', label: 'Colis supplémentaire' }, { key: 'express_slot', label: 'Créneau express' }, { key: 'insurance', label: 'Assurance' }] }),
  p({ code: 'passenger_transport', family: 'transport', label: 'Transport de personnes', kind: 'appointment',
    uptakeForms: ['instant', 'booking_required'], billingPlans: ['usage', 'direct'], supplyTypes: ['irl'],
    attributes: [{ key: 'vehicle_capacity', type: 'integer', required: true, feeds: ['vehicle_capacity'] }, { key: 'service_area', type: 'text', required: true, feeds: ['service_area'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: null,
    defaultAutomations: ['reminder_day_before'],
    suggestedOptions: [{ key: 'luggage', label: 'Bagage' }, { key: 'child_seat', label: 'Siège enfant' }, { key: 'waiting', label: 'Attente' }] }),

  // Tourisme & loisirs
  p({ code: 'guided_experience', family: 'leisure', label: 'Visite / activité guidée', kind: 'appointment',
    uptakeForms: ['booking_required'], billingPlans: ['unit'], supplyTypes: ['irl'],
    attributes: [{ key: 'max_participants', type: 'integer', required: true, feeds: ['max_participants'] }, { key: 'meeting_point', type: 'text', required: true, feeds: ['meeting_point'] }, duration],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: null,
    defaultAutomations: ['reminder_day_before', 'post_service_review'],
    suggestedOptions: [{ key: 'extra_participant', label: 'Participant supplémentaire' }, { key: 'audio_guide', label: 'Audio-guide' }, { key: 'meal', label: 'Repas' }] }),

  // B2B & administratif
  p({ code: 'subcontracting', family: 'b2b_admin', label: 'Sous-traitance B2B', kind: 'quoted_mission',
    uptakeForms: ['prestation'], billingPlans: ['direct', 'dayly'], supplyTypes: ALL_SUPPLY,
    attributes: [{ key: 'specifications_req', type: 'select', options: ['yes', 'no'] }, { key: 'insurance_required', type: 'select', options: ['yes', 'no'] }, scope],
    stepsBeforePayment: [], stepsAfterPayment: [], defaultContractTemplate: 'subcontracting-agreement',
    defaultAutomations: ['missing_documents_reminder', 'weekly_report'],
    suggestedOptions: [{ key: 'extra_days', label: 'Jours supplémentaires' }, { key: 'on_call', label: 'Astreinte' }] }),
  p({ code: 'administrative_procedure', family: 'b2b_admin', label: 'Démarche administrative', kind: 'one_off',
    uptakeForms: ['instant', 'prestation'], billingPlans: ['direct'], supplyTypes: ['online', 'mixed'],
    attributes: [{ key: 'procedure_types', type: 'text', required: true, feeds: ['procedure_label'] }, { key: 'required_documents', type: 'textarea', feeds: ['required_documents'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['missing_documents_reminder'],
    suggestedOptions: [{ key: 'fast_track', label: 'Traitement accéléré' }, { key: 'sworn_translation', label: 'Traduction assermentée' }] }),
  p({ code: 'product_with_service', family: 'b2b_admin', label: 'Produit + prestation (vente + pose)', kind: 'one_off',
    uptakeForms: ['instant', 'booking_required', 'prestation'], billingPlans: ['direct', 'mixed'], supplyTypes: ['irl'],
    attributes: [{ key: 'product_reference', type: 'text', required: true, feeds: ['product_label'] }, { key: 'warranty_months', type: 'integer', feeds: ['warranty_months'] }],
    stepsBeforePayment: BEFORE, stepsAfterPayment: ['inspection', 'closure'], defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['reminder_day_before', 'post_service_review'],
    suggestedOptions: [{ key: 'extended_warranty', label: 'Extension de garantie' }, { key: 'trade_in', label: 'Reprise' }, { key: 'accessories', label: 'Accessoires' }] }),

  // Repli : la plateforme ne tombe jamais sur un cas inconnu
  p({ code: 'generic_service', family: 'fallback', label: 'Service générique', kind: 'one_off',
    uptakeForms: ALL_UPTAKE, billingPlans: ALL_PLANS, supplyTypes: ALL_SUPPLY,
    attributes: [scope, deliverables],
    stepsBeforePayment: BEFORE, stepsAfterPayment: CLOSURE, defaultContractTemplate: 'service-agreement',
    defaultAutomations: ['post_service_review'], suggestedOptions: [] }),
];

export const PROFILE_BY_CODE: Readonly<Record<string, ServiceProfile>> = Object.freeze(Object.fromEntries(SERVICE_PROFILES.map((x) => [x.code, x])));

export const FAMILY_LABELS: Readonly<Record<ProfileFamily, string>> = {
  consulting: 'Conseil & expertise', person: 'Rendez-vous & personne', rental: 'Location', on_site: 'Intervention sur site',
  event_creative: 'Événementiel & créatif', digital: 'Numérique', transport: 'Transport', leisure: 'Tourisme & loisirs', b2b_admin: 'B2B & administratif', fallback: 'Repli',
};

// ─── Dérivation ──────────────────────────────────────────────────────────────

export interface ServiceShape {
  uptakeForm?: string | null;
  billingPlan?: string | null;
  supplyType?: string | null;
  /** `ServiceAttribute` du service, `attributeName` → `attributeValue`. */
  attributes?: Readonly<Record<string, string>> | null;
}

export interface DerivedProfile {
  profile: ServiceProfile;
  kind: ServiceKind;
  /** `profile_code` lu dans les attributs et compatible avec la modalité. */
  declared: boolean;
  /** Profils compatibles avec la modalité et le plan (pour lever l'ambiguïté). */
  candidates: readonly ServiceProfile[];
  /** La combinaison n'a pas de profil unique : le repli (ou la nature seule) a été retenu. */
  ambiguous: boolean;
  /** Anomalie de la combinaison d'enums (null : exécutable par la plateforme). */
  combinationIssue: CombinationIssue | null;
}

const norm = (v: unknown): string => String(v ?? '').trim().toLowerCase();

/** Nature déduite de la modalité et du plan seuls (quand aucun profil ne s'impose). */
export function kindFromEnums(uptakeForm: string | null | undefined, billingPlan: string | null | undefined): ServiceKind | null {
  const u = norm(uptakeForm); const b = norm(billingPlan);
  switch (u) {
    case 'instant': return b === 'dayly' ? 'rental' : 'one_off';
    case 'booking_required': return b === 'dayly' ? 'rental' : 'appointment';
    case 'periodic': return ['mensual', 'trimestrial', 'semestrial', 'annual'].includes(b) ? 'subscription' : 'recurring_service';
    case 'prestation': return 'quoted_mission';
    default: return null;
  }
}

const includes = (list: readonly string[], v: string): boolean => list.includes(v);

/** Libellés français des réglages (messages d'erreur ; les écrans ont leurs propres traductions). */
export const UPTAKE_FORM_LABELS: Readonly<Record<UptakeForm, string>> = {
  instant: 'Instantané', periodic: 'Périodique', prestation: 'Sur devis', booking_required: 'Sur réservation',
};
export const BILLING_PLAN_LABELS: Readonly<Record<BillingPlan, string>> = {
  usage: "À l'usage", mixed: 'Mixte', direct: 'Prix fixe', minute: 'À la minute', unit: "À l'unité", hourly: "À l'heure",
  dayly: 'À la journée', mensual: 'Mensuel', trimestrial: 'Trimestriel', semestrial: 'Semestriel', annual: 'Annuel',
};
export const SUPPLY_TYPE_LABELS: Readonly<Record<SupplyType, string>> = { irl: 'Sur place', online: 'En ligne', mixed: 'Mixte' };

/** Facturations acceptées par une modalité (vide si la modalité est inconnue). */
export function billingPlansForUptake(uptakeForm: string | null | undefined): readonly BillingPlan[] {
  const u = norm(uptakeForm);
  return includes(UPTAKE_FORMS, u) ? BILLING_PLANS_BY_UPTAKE[u as UptakeForm] as readonly BillingPlan[] : [];
}

/** La modalité et la facturation (si toutes deux renseignées) sont-elles exécutables ensemble ? */
export function isCoherentCombination(uptakeForm: string | null | undefined, billingPlan: string | null | undefined): boolean {
  const u = norm(uptakeForm); const b = norm(billingPlan);
  if (!u || !b) return true;
  return includes(billingPlansForUptake(u), b);
}

/** Le profil accepte-t-il chaque enum renseigné (et la combinaison est-elle cohérente) ? */
export function profileAccepts(profile: ServiceProfile, shape: ServiceShape): boolean {
  const u = norm(shape.uptakeForm); const b = norm(shape.billingPlan); const s = norm(shape.supplyType);
  return (!u || includes(profile.uptakeForms, u))
    && (!b || includes(profile.billingPlans, b))
    && (!s || includes(profile.supplyTypes, s))
    && isCoherentCombination(u, b);
}

export function compatibleProfiles(shape: ServiceShape): ServiceProfile[] {
  return SERVICE_PROFILES.filter((x) => x.code !== 'generic_service' && profileAccepts(x, shape));
}

/**
 * Vérifie qu'une combinaison d'enums est exécutable par la plateforme. Un enum non
 * renseigné n'est pas une anomalie (la base applique son défaut). Renvoie null si
 * la combinaison est exécutable, sinon l'anomalie et le réglage à changer.
 */
export function checkServiceCombination(shape: ServiceShape | null | undefined): CombinationIssue | null {
  const sh = shape ?? {};
  const u = norm(sh.uptakeForm); const b = norm(sh.billingPlan); const s = norm(sh.supplyType);
  if (u && !includes(UPTAKE_FORMS, u)) {
    return { code: 'UPTAKE_FORM_UNKNOWN', field: 'uptakeForm', message: `Modalité d'achat inconnue : « ${u} ».`, allowedBillingPlans: [] };
  }
  if (b && !includes(BILLING_PLANS, b)) {
    return { code: 'BILLING_PLAN_UNKNOWN', field: 'billingPlan', message: `Facturation inconnue : « ${b} ».`, allowedBillingPlans: billingPlansForUptake(u) };
  }
  if (s && !includes(SUPPLY_TYPES, s)) {
    return { code: 'SUPPLY_TYPE_UNKNOWN', field: 'supplyType', message: `Canal de livraison inconnu : « ${s} ».`, allowedBillingPlans: billingPlansForUptake(u) };
  }
  if (!isCoherentCombination(u, b)) {
    const allowed = billingPlansForUptake(u);
    return {
      code: 'BILLING_PLAN_INCOMPATIBLE', field: 'billingPlan', allowedBillingPlans: allowed,
      message: `La facturation « ${BILLING_PLAN_LABELS[b as BillingPlan]} » n'est pas exécutable pour un service « ${UPTAKE_FORM_LABELS[u as UptakeForm]} » : choisissez parmi ${allowed.map((x) => BILLING_PLAN_LABELS[x]).join(', ')}.`,
    };
  }
  if (u && b && s && compatibleProfiles(sh).length === 0) {
    return { code: 'NO_PROFILE', field: 'supplyType', message: 'Aucun profil métier ne couvre cette combinaison.', allowedBillingPlans: billingPlansForUptake(u) };
  }
  return null;
}

/**
 * Combinaison exécutable la plus proche de `shape` pour `profile` : chaque réglage actuel est
 * conservé s'il convient au profil, sinon remplacé par la première valeur exécutable.
 */
export function closestCombination(profile: ServiceProfile, shape: ServiceShape | null | undefined): ServiceCombination {
  const cur = { u: norm(shape?.uptakeForm), b: norm(shape?.billingPlan), s: norm(shape?.supplyType) };
  const all = profileChoices(profile);
  const uptakeForm = includes(all.uptakeForms, cur.u) ? cur.u as UptakeForm : all.uptakeForms[0];
  const plans = profileChoices(profile, uptakeForm).billingPlans;
  const billingPlan = includes(plans, cur.b) ? cur.b as BillingPlan : plans[0];
  const supplyType = includes(all.supplyTypes, cur.s) ? cur.s as SupplyType : all.supplyTypes[0];
  return { uptakeForm, billingPlan, supplyType } as ServiceCombination;
}

/** Valeurs proposables pour un profil choisi : modalités, facturations (filtrées par la modalité), canaux. */
export function profileChoices(profile: ServiceProfile, uptakeForm?: string | null): { uptakeForms: UptakeForm[]; billingPlans: BillingPlan[]; supplyTypes: SupplyType[] } {
  const uptakeForms = profile.uptakeForms.filter((u) => profile.billingPlans.some((b) => isCoherentCombination(u, b)));
  const u = norm(uptakeForm);
  const billingPlans = profile.billingPlans.filter((b) => (u ? isCoherentCombination(u, b) : uptakeForms.some((x) => isCoherentCombination(x, b))));
  return { uptakeForms: [...uptakeForms], billingPlans: [...billingPlans], supplyTypes: [...profile.supplyTypes] };
}

/**
 * Profil d'un service : le `profile_code` déclaré s'il est compatible avec la
 * modalité ; sinon l'unique profil compatible avec la combinaison ; sinon le repli
 * `generic_service` porté par la nature déduite des enums. Jamais null.
 */
export function deriveServiceProfile(shape: ServiceShape | null | undefined): DerivedProfile {
  const sh = shape ?? {};
  const combinationIssue = checkServiceCombination(sh);
  const candidates = compatibleProfiles(sh);
  const declaredCode = norm(sh.attributes?.[PROFILE_CODE_ATTRIBUTE]);
  const declared = declaredCode ? PROFILE_BY_CODE[declaredCode] : undefined;
  if (declared && profileAccepts(declared, sh)) {
    return { profile: declared, kind: declared.kind, declared: true, candidates, ambiguous: false, combinationIssue };
  }
  if (candidates.length === 1) {
    return { profile: candidates[0], kind: candidates[0].kind, declared: false, candidates, ambiguous: false, combinationIssue };
  }
  const kind = kindFromEnums(sh.uptakeForm, sh.billingPlan) ?? 'one_off';
  const sameKind = candidates.filter((c) => c.kind === kind);
  if (sameKind.length === 1) return { profile: sameKind[0], kind, declared: false, candidates, ambiguous: false, combinationIssue };
  return { profile: PROFILE_BY_CODE.generic_service, kind, declared: false, candidates, ambiguous: candidates.length > 0, combinationIssue };
}

/** Attributs obligatoires du profil absents ou vides. */
export function missingProfileAttributes(profile: ServiceProfile, attributes: Readonly<Record<string, string>> | null | undefined): string[] {
  return profile.attributes.filter((a) => a.required && !norm(attributes?.[a.key])).map((a) => a.key);
}

/** Valeur d'attribut invalide pour son type (`money` / `integer` : entier ≥ 0 en texte ; `select` : option connue). */
export function invalidProfileAttributes(profile: ServiceProfile, attributes: Readonly<Record<string, string>> | null | undefined): string[] {
  const out: string[] = [];
  for (const a of profile.attributes) {
    const v = attributes?.[a.key];
    if (v === undefined || v === null || String(v).trim() === '') continue;
    if ((a.type === 'money' || a.type === 'integer') && !/^\d{1,15}$/.test(String(v).trim())) out.push(a.key);
    else if (a.type === 'select' && a.options && !a.options.includes(String(v).trim())) out.push(a.key);
    else if (String(v).length > 255) out.push(a.key);
  }
  return out;
}

/** Étapes autorisées (avant + après paiement) pour un profil. */
export function allowedSteps(profile: ServiceProfile): readonly StepCapability[] {
  return [...profile.stepsBeforePayment, ...profile.stepsAfterPayment];
}
