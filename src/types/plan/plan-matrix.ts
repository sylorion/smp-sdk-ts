/**
 * @fileoverview SMP Plan Matrix — Single Source of Truth
 * 
 * Defines all subscription plan tiers, their limits, features, display config,
 * and provides helper functions for plan verification.
 * 
 * Used by:
 * - Backend microservices (mu-authentication, mu-organization, mu-contract, mu-billing, mu-catalog)
 * - Frontend webapp (hooks, guards, pages)
 * - Landing page (pricing display)
 */

// ============================================================================
// PLAN TIERS
// ============================================================================

export enum PlanTier {
  STANDARD = 'standard',
  STARTER = 'starter',
  PRO = 'pro',
  BUSINESS = 'business',
}

export const PLAN_TIERS_ORDERED: PlanTier[] = [
  PlanTier.STANDARD,
  PlanTier.STARTER,
  PlanTier.PRO,
  PlanTier.BUSINESS,
];

/** Returns the numeric rank of a plan tier for comparison (higher = better) */
export function getPlanRank(plan: string): number {
  const ranks: Record<string, number> = {
    [PlanTier.STANDARD]: 0,
    [PlanTier.STARTER]: 1,
    [PlanTier.PRO]: 2,
    [PlanTier.BUSINESS]: 3,
  };
  return ranks[plan] ?? 0;
}

/** Check if planA is higher tier than planB */
export function isHigherPlan(planA: string, planB: string): boolean {
  return getPlanRank(planA) > getPlanRank(planB);
}

// ============================================================================
// PLAN LIMITS & FEATURES
// ============================================================================

/**
 * Numeric limits for a plan tier.
 * A value of -1 means "unlimited".
 */
export interface PlanLimits {
  maxOrganizations: number;
  maxServicesPerOrg: number;
  maxMembersPerOrg: number;
  maxEstimatesPerMonth: number;
  maxInvoicesPerMonth: number;
  maxContractsPerMonth: number;
  maxAiCreditsPerMonth: number;
  maxNativeAgents: number;
  maxWithdrawalsPerMonth: number;
}

/** Boolean feature flags for a plan tier */
export interface PlanFeatures {
  hasFormAgent: boolean;
  hasPrioritySupport: boolean;
  hasDedicatedSupport: boolean;
  hasAdvancedAnalytics: boolean;
  hasCustomBranding: boolean;
  hasEmailSupport: boolean;
}

export type PlanConfig = PlanLimits & PlanFeatures;

/** Sentinel value for "unlimited" */
export const UNLIMITED = -1;

// ============================================================================
// THE MATRIX
// ============================================================================

export const PLAN_MATRIX: Record<PlanTier, PlanConfig> = {
  [PlanTier.STANDARD]: {
    maxOrganizations: 1,
    maxServicesPerOrg: 2,
    maxMembersPerOrg: 2,
    maxEstimatesPerMonth: 3,
    maxInvoicesPerMonth: 3,
    maxContractsPerMonth: 1,
    maxAiCreditsPerMonth: 20,
    maxNativeAgents: 0,
    maxWithdrawalsPerMonth: 1,
    hasFormAgent: false,
    hasPrioritySupport: false,
    hasDedicatedSupport: false,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    hasEmailSupport: false,
  },
  [PlanTier.STARTER]: {
    maxOrganizations: 1,
    maxServicesPerOrg: 3,
    maxMembersPerOrg: 3,
    maxEstimatesPerMonth: 5,
    maxInvoicesPerMonth: 5,
    maxContractsPerMonth: 3,
    maxAiCreditsPerMonth: 100,
    maxNativeAgents: 1,
    maxWithdrawalsPerMonth: 2,
    hasFormAgent: false,
    hasPrioritySupport: false,
    hasDedicatedSupport: false,
    hasAdvancedAnalytics: false,
    hasCustomBranding: false,
    hasEmailSupport: true,
  },
  [PlanTier.PRO]: {
    maxOrganizations: 3,
    maxServicesPerOrg: 10,
    maxMembersPerOrg: 5,
    maxEstimatesPerMonth: 30,
    maxInvoicesPerMonth: 30,
    maxContractsPerMonth: 20,
    maxAiCreditsPerMonth: 500,
    maxNativeAgents: 3,
    maxWithdrawalsPerMonth: 5,
    hasFormAgent: true,
    hasPrioritySupport: true,
    hasDedicatedSupport: false,
    hasAdvancedAnalytics: true,
    hasCustomBranding: false,
    hasEmailSupport: true,
  },
  [PlanTier.BUSINESS]: {
    maxOrganizations: 10,
    maxServicesPerOrg: UNLIMITED,
    maxMembersPerOrg: 20,
    maxEstimatesPerMonth: UNLIMITED,
    maxInvoicesPerMonth: UNLIMITED,
    maxContractsPerMonth: UNLIMITED,
    maxAiCreditsPerMonth: 2000,
    maxNativeAgents: UNLIMITED,
    maxWithdrawalsPerMonth: UNLIMITED,
    hasFormAgent: true,
    hasPrioritySupport: true,
    hasDedicatedSupport: true,
    hasAdvancedAnalytics: true,
    hasCustomBranding: true,
    hasEmailSupport: true,
  },
};

// ============================================================================
// DISPLAY CONFIGURATION
// ============================================================================

export interface PlanDisplayConfig {
  name: string;
  label: string;
  description: string;
  color: string;         // Primary HEX color
  colorLight: string;    // Light variant for backgrounds
  gradient: string;      // CSS gradient
  badgeGlow: string;     // Glow effect for animations
  icon: string;          // Emoji icon
  featured: boolean;
}

export const PLAN_DISPLAY_CONFIG: Record<PlanTier, PlanDisplayConfig> = {
  [PlanTier.STANDARD]: {
    name: 'Standard',
    label: 'Gratuit',
    description: 'Découvrez la plateforme avec les fonctionnalités essentielles.',
    color: '#6B7280',
    colorLight: '#F3F4F6',
    gradient: 'from-gray-400 to-gray-600',
    badgeGlow: '0 0 20px rgba(107, 114, 128, 0.3)',
    icon: 'S',
    featured: false,
  },
  [PlanTier.STARTER]: {
    name: 'Starter',
    label: '5,99€/mois',
    description: 'Parfait pour lancer votre activité avec les outils essentiels.',
    color: '#3B82F6',
    colorLight: '#EFF6FF',
    gradient: 'from-blue-400 to-blue-600',
    badgeGlow: '0 0 20px rgba(59, 130, 246, 0.4)',
    icon: 'St',
    featured: false,
  },
  [PlanTier.PRO]: {
    name: 'Pro',
    label: '9,99€/mois',
    description: 'Accélérez votre croissance avec une automatisation avancée.',
    color: '#FF315D',
    colorLight: '#FFF1F2',
    gradient: 'from-pink-500 to-rose-600',
    badgeGlow: '0 0 20px rgba(255, 49, 93, 0.4)',
    icon: 'P',
    featured: true,
  },
  [PlanTier.BUSINESS]: {
    name: 'Business',
    label: '49€/mois',
    description: 'La puissance totale pour les entreprises en pleine expansion.',
    color: '#F59E0B',
    colorLight: '#FFFBEB',
    gradient: 'from-amber-400 to-yellow-600',
    badgeGlow: '0 0 20px rgba(245, 158, 11, 0.4)',
    icon: 'B',
    featured: false,
  },
};

// ============================================================================
// PRICING
// ============================================================================

export interface PlanPricing {
  monthly: number;       // Price in cents (EUR)
  monthlyDisplay: string; // Human-readable price
  currency: string;
  trialDays: number;
  isPaid: boolean;
}

export const PLAN_PRICING: Record<PlanTier, PlanPricing> = {
  [PlanTier.STANDARD]: {
    monthly: 0,
    monthlyDisplay: 'Gratuit',
    currency: 'EUR',
    trialDays: 0,
    isPaid: false,
  },
  [PlanTier.STARTER]: {
    monthly: 599,
    monthlyDisplay: '5,99€',
    currency: 'EUR',
    trialDays: 30,
    isPaid: true,
  },
  [PlanTier.PRO]: {
    monthly: 999,
    monthlyDisplay: '9,99€',
    currency: 'EUR',
    trialDays: 30,
    isPaid: true,
  },
  [PlanTier.BUSINESS]: {
    monthly: 4900,
    monthlyDisplay: '49€',
    currency: 'EUR',
    trialDays: 30,
    isPaid: true,
  },
};

// ============================================================================
// PLAN ACTIONS (used for canPerformAction)
// ============================================================================

export enum PlanAction {
  CREATE_ORGANIZATION = 'CREATE_ORGANIZATION',
  CREATE_SERVICE = 'CREATE_SERVICE',
  ADD_MEMBER = 'ADD_MEMBER',
  CREATE_ESTIMATE = 'CREATE_ESTIMATE',
  CREATE_INVOICE = 'CREATE_INVOICE',
  CREATE_CONTRACT = 'CREATE_CONTRACT',
  USE_AI_CREDITS = 'USE_AI_CREDITS',
  USE_NATIVE_AGENT = 'USE_NATIVE_AGENT',
  USE_FORM_AGENT = 'USE_FORM_AGENT',
  PERFORM_WITHDRAWAL = 'PERFORM_WITHDRAWAL',
  VIEW_ADVANCED_ANALYTICS = 'VIEW_ADVANCED_ANALYTICS',
  USE_CUSTOM_BRANDING = 'USE_CUSTOM_BRANDING',
}

/** Maps PlanAction to the relevant limit key in PlanLimits */
const ACTION_TO_LIMIT_KEY: Record<string, keyof PlanLimits | null> = {
  [PlanAction.CREATE_ORGANIZATION]: 'maxOrganizations',
  [PlanAction.CREATE_SERVICE]: 'maxServicesPerOrg',
  [PlanAction.ADD_MEMBER]: 'maxMembersPerOrg',
  [PlanAction.CREATE_ESTIMATE]: 'maxEstimatesPerMonth',
  [PlanAction.CREATE_INVOICE]: 'maxInvoicesPerMonth',
  [PlanAction.CREATE_CONTRACT]: 'maxContractsPerMonth',
  [PlanAction.USE_AI_CREDITS]: 'maxAiCreditsPerMonth',
  [PlanAction.USE_NATIVE_AGENT]: 'maxNativeAgents',
  [PlanAction.PERFORM_WITHDRAWAL]: 'maxWithdrawalsPerMonth',
  // Feature-based (no numeric limit, check boolean)
  [PlanAction.USE_FORM_AGENT]: null,
  [PlanAction.VIEW_ADVANCED_ANALYTICS]: null,
  [PlanAction.USE_CUSTOM_BRANDING]: null,
};

/** Maps PlanAction to the relevant feature key for boolean checks */
const ACTION_TO_FEATURE_KEY: Partial<Record<string, keyof PlanFeatures>> = {
  [PlanAction.USE_FORM_AGENT]: 'hasFormAgent',
  [PlanAction.VIEW_ADVANCED_ANALYTICS]: 'hasAdvancedAnalytics',
  [PlanAction.USE_CUSTOM_BRANDING]: 'hasCustomBranding',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Resolves a plan string to a PlanTier enum value.
 * Falls back to STANDARD if the plan is not recognized.
 */
export function resolvePlanTier(plan?: string | null): PlanTier {
  if (!plan) return PlanTier.STANDARD;
  const normalized = plan.toLowerCase().trim();
  if (Object.values(PlanTier).includes(normalized as PlanTier)) {
    return normalized as PlanTier;
  }
  return PlanTier.STANDARD;
}

/**
 * Returns the full plan configuration (limits + features) for a given plan.
 */
export function getPlanConfig(plan?: string | null): PlanConfig {
  return PLAN_MATRIX[resolvePlanTier(plan)];
}

/**
 * Returns the display configuration for a given plan.
 */
export function getPlanDisplay(plan?: string | null): PlanDisplayConfig {
  return PLAN_DISPLAY_CONFIG[resolvePlanTier(plan)];
}

/**
 * Returns the pricing information for a given plan.
 */
export function getPlanPricing(plan?: string | null): PlanPricing {
  return PLAN_PRICING[resolvePlanTier(plan)];
}

/**
 * Core verification function.
 * Checks if a user with the given plan can perform the specified action,
 * given the current count of that resource.
 * 
 * @param plan - The user's current plan string
 * @param action - The action to verify (PlanAction enum value)
 * @param currentCount - How many of that resource the user currently has/used
 * @returns Object with allowed status, limit, and user-friendly message
 */
export function canPerformAction(
  plan: string | null | undefined,
  action: string,
  currentCount: number = 0
): { allowed: boolean; limit: number; remaining: number; message: string; upgradeToTier?: PlanTier } {
  const tier = resolvePlanTier(plan);
  const config = PLAN_MATRIX[tier];
  const display = PLAN_DISPLAY_CONFIG[tier];

  // Check feature-based actions first (boolean flags)
  const featureKey = ACTION_TO_FEATURE_KEY[action];
  if (featureKey) {
    const hasFeature = config[featureKey];
    if (!hasFeature) {
      // Find the minimum plan that has this feature
      const upgradeTo = PLAN_TIERS_ORDERED.find(t => PLAN_MATRIX[t][featureKey]);
      return {
        allowed: false,
        limit: 0,
        remaining: 0,
        message: `La fonctionnalité "${action}" nécessite un plan ${upgradeTo ? PLAN_DISPLAY_CONFIG[upgradeTo].name : 'supérieur'}.`,
        upgradeToTier: upgradeTo,
      };
    }
    return { allowed: true, limit: UNLIMITED, remaining: UNLIMITED, message: '' };
  }

  // Check numeric limit-based actions
  const limitKey = ACTION_TO_LIMIT_KEY[action];
  if (!limitKey) {
    // Unknown action — allow by default (fail-open for unknown actions)
    return { allowed: true, limit: UNLIMITED, remaining: UNLIMITED, message: '' };
  }

  const limit = config[limitKey];

  // Unlimited
  if (limit === UNLIMITED) {
    return { allowed: true, limit: UNLIMITED, remaining: UNLIMITED, message: '' };
  }

  const remaining = Math.max(0, limit - currentCount);
  const allowed = currentCount < limit;

  if (!allowed) {
    // Find the minimum plan that has a higher limit for this action
    const upgradeTo = PLAN_TIERS_ORDERED.find(t => {
      const targetLimit = PLAN_MATRIX[t][limitKey];
      return targetLimit === UNLIMITED || targetLimit > limit;
    });

    return {
      allowed: false,
      limit,
      remaining: 0,
      message: `Vous avez atteint la limite de ${limit} pour votre plan ${display.name}. Passez au plan ${upgradeTo ? PLAN_DISPLAY_CONFIG[upgradeTo].name : 'supérieur'} pour continuer.`,
      upgradeToTier: upgradeTo,
    };
  }

  return { allowed: true, limit, remaining, message: '' };
}

/**
 * Returns the features list for a plan, formatted for display.
 * Each item includes label, value (string representation), and whether it's included.
 */
export function getPlanFeaturesForDisplay(plan?: string | null): Array<{
  label: string;
  value: string;
  included: boolean;
  category: 'limit' | 'feature';
}> {
  const config = getPlanConfig(plan);

  const formatLimit = (val: number): string => {
    if (val === UNLIMITED) return 'Illimité';
    return val.toString();
  };

  return [
    { label: 'Organisations', value: formatLimit(config.maxOrganizations), included: true, category: 'limit' },
    { label: 'Services actifs / org', value: formatLimit(config.maxServicesPerOrg), included: true, category: 'limit' },
    { label: 'Membres / org', value: formatLimit(config.maxMembersPerOrg), included: true, category: 'limit' },
    { label: 'Devis / mois', value: formatLimit(config.maxEstimatesPerMonth), included: true, category: 'limit' },
    { label: 'Factures / mois', value: formatLimit(config.maxInvoicesPerMonth), included: true, category: 'limit' },
    { label: 'Contrats digitaux / mois', value: formatLimit(config.maxContractsPerMonth), included: true, category: 'limit' },
    { label: 'Crédits IA / mois', value: formatLimit(config.maxAiCreditsPerMonth), included: true, category: 'limit' },
    { label: 'Agents IA natifs', value: formatLimit(config.maxNativeAgents), included: config.maxNativeAgents > 0, category: 'limit' },
    { label: 'Agent Formulaire', value: config.hasFormAgent ? 'Inclus' : 'Non inclus', included: config.hasFormAgent, category: 'feature' },
    { label: 'Support email', value: config.hasEmailSupport ? 'Inclus' : 'Non inclus', included: config.hasEmailSupport, category: 'feature' },
    { label: 'Support prioritaire', value: config.hasPrioritySupport ? 'Inclus' : 'Non inclus', included: config.hasPrioritySupport, category: 'feature' },
    { label: 'Support dédié 24/7', value: config.hasDedicatedSupport ? 'Inclus' : 'Non inclus', included: config.hasDedicatedSupport, category: 'feature' },
    { label: 'Analytics avancés', value: config.hasAdvancedAnalytics ? 'Inclus' : 'Non inclus', included: config.hasAdvancedAnalytics, category: 'feature' },
    { label: 'Branding personnalisé', value: config.hasCustomBranding ? 'Inclus' : 'Non inclus', included: config.hasCustomBranding, category: 'feature' },
    { label: 'Retraits / mois', value: formatLimit(config.maxWithdrawalsPerMonth), included: true, category: 'limit' },
  ];
}

/**
 * Returns the minimum plan tier required for a specific action/feature.
 */
export function getMinimumPlanForAction(action: string): PlanTier {
  const featureKey = ACTION_TO_FEATURE_KEY[action];
  if (featureKey) {
    return PLAN_TIERS_ORDERED.find(t => PLAN_MATRIX[t][featureKey]) ?? PlanTier.BUSINESS;
  }

  const limitKey = ACTION_TO_LIMIT_KEY[action];
  if (limitKey) {
    return PLAN_TIERS_ORDERED.find(t => {
      const val = PLAN_MATRIX[t][limitKey];
      return val === UNLIMITED || val > 0;
    }) ?? PlanTier.STANDARD;
  }

  return PlanTier.STANDARD;
}
