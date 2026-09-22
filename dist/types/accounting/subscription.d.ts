export declare enum SubscriptionStatus {
    ACTIVE = "active",
    PAST_DUE = "past_due",
    CANCELED = "canceled",
    TRIALING = "trialing",
    PAUSED = "paused"
}
export declare enum RecurringInterval {
    DAY = "day",
    WEEK = "week",
    MONTH = "month",
    YEAR = "year"
}
/** Intervals incompatibles avec les abonnements Stripe */
export declare const UNSUPPORTED_SUBSCRIPTION_INTERVALS: readonly ["hourly", "minute"];
export interface ServiceSubscriptionDto {
    id: string;
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    buyerUserId: string;
    sellerOrganizationId: string;
    serviceId: string;
    engagementId?: string;
    status: SubscriptionStatus;
    currentPeriodStart: Date | string;
    currentPeriodEnd: Date | string;
    cancelAtPeriodEnd: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface CreateServiceSubscriptionInput {
    stripeSubscriptionId: string;
    stripeCustomerId: string;
    buyerUserId: string;
    sellerOrganizationId: string;
    serviceId: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
}
export interface CancelSubscriptionInput {
    subscriptionId: string;
    cancelImmediately?: boolean;
}
