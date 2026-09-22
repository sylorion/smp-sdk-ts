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
export declare enum PlanTier {
    STANDARD = "standard",
    STARTER = "starter",
    PRO = "pro",
    BUSINESS = "business"
}
export declare const PLAN_TIERS_ORDERED: PlanTier[];
/** Returns the numeric rank of a plan tier for comparison (higher = better) */
export declare function getPlanRank(plan: string): number;
/** Check if planA is higher tier than planB */
export declare function isHigherPlan(planA: string, planB: string): boolean;
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
    hasServiceSubscriptions: boolean;
    hasServiceAiAgents: boolean;
}
export type PlanConfig = PlanLimits & PlanFeatures;
/** Sentinel value for "unlimited" */
export declare const UNLIMITED = -1;
export declare const PLAN_MATRIX: Record<PlanTier, PlanConfig>;
export interface PlanDisplayConfig {
    name: string;
    label: string;
    description: string;
    color: string;
    colorLight: string;
    gradient: string;
    badgeGlow: string;
    icon: string;
    featured: boolean;
}
export declare const PLAN_DISPLAY_CONFIG: Record<PlanTier, PlanDisplayConfig>;
export interface PlanPricing {
    monthly: number;
    monthlyDisplay: string;
    currency: string;
    trialDays: number;
    isPaid: boolean;
}
export declare const PLAN_PRICING: Record<PlanTier, PlanPricing>;
export declare enum PlanAction {
    CREATE_ORGANIZATION = "CREATE_ORGANIZATION",
    CREATE_SERVICE = "CREATE_SERVICE",
    ADD_MEMBER = "ADD_MEMBER",
    CREATE_ESTIMATE = "CREATE_ESTIMATE",
    CREATE_INVOICE = "CREATE_INVOICE",
    CREATE_CONTRACT = "CREATE_CONTRACT",
    USE_AI_CREDITS = "USE_AI_CREDITS",
    USE_NATIVE_AGENT = "USE_NATIVE_AGENT",
    USE_FORM_AGENT = "USE_FORM_AGENT",
    PERFORM_WITHDRAWAL = "PERFORM_WITHDRAWAL",
    VIEW_ADVANCED_ANALYTICS = "VIEW_ADVANCED_ANALYTICS",
    USE_CUSTOM_BRANDING = "USE_CUSTOM_BRANDING",
    /**
     * Vente d'un service par abonnement. Contrôlée par le backend depuis
     * mu-catalog ; elle manquait ici, si bien que `canPerformAction` retombait
     * dans la branche « action inconnue » et renvoyait `allowed: true` quel que
     * soit le plan.
     */
    USE_SERVICE_SUBSCRIPTIONS = "USE_SERVICE_SUBSCRIPTIONS",
    /** Agents IA attachés à un service. */
    USE_SERVICE_AI_AGENTS = "USE_SERVICE_AI_AGENTS"
}
/**
 * Resolves a plan string to a PlanTier enum value.
 * Falls back to STANDARD if the plan is not recognized.
 */
/**
 * Anciens noms de plans encore présents en base.
 *
 * Doit rester identique à `LEGACY_PLAN_ALIASES` de mu-authentication : sans
 * cette table, `premium` était résolu en `pro` par le backend et en `standard`
 * par le SDK — le même compte était donc Pro pour l'API et Standard pour l'UI.
 */
export declare const LEGACY_PLAN_ALIASES: Readonly<Record<string, PlanTier>>;
export declare function resolvePlanTier(plan?: string | null): PlanTier;
/**
 * Returns the full plan configuration (limits + features) for a given plan.
 */
export declare function getPlanConfig(plan?: string | null): PlanConfig;
/**
 * Returns the display configuration for a given plan.
 */
export declare function getPlanDisplay(plan?: string | null): PlanDisplayConfig;
/**
 * Returns the pricing information for a given plan.
 */
export declare function getPlanPricing(plan?: string | null): PlanPricing;
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
export declare function canPerformAction(plan: string | null | undefined, action: string, currentCount?: number): {
    allowed: boolean;
    limit: number;
    remaining: number;
    message: string;
    upgradeToTier?: PlanTier;
};
/**
 * Returns the features list for a plan, formatted for display.
 * Each item includes label, value (string representation), and whether it's included.
 */
export declare function getPlanFeaturesForDisplay(plan?: string | null): Array<{
    label: string;
    value: string;
    included: boolean;
    category: 'limit' | 'feature';
}>;
/**
 * Returns the minimum plan tier required for a specific action/feature.
 */
export declare function getMinimumPlanForAction(action: string): PlanTier;
