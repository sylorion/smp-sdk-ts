export var SubscriptionStatus;
(function (SubscriptionStatus) {
    SubscriptionStatus["ACTIVE"] = "active";
    SubscriptionStatus["PAST_DUE"] = "past_due";
    SubscriptionStatus["CANCELED"] = "canceled";
    SubscriptionStatus["TRIALING"] = "trialing";
    SubscriptionStatus["PAUSED"] = "paused";
})(SubscriptionStatus || (SubscriptionStatus = {}));
export var RecurringInterval;
(function (RecurringInterval) {
    RecurringInterval["DAY"] = "day";
    RecurringInterval["WEEK"] = "week";
    RecurringInterval["MONTH"] = "month";
    RecurringInterval["YEAR"] = "year";
})(RecurringInterval || (RecurringInterval = {}));
/** Intervals incompatibles avec les abonnements Stripe */
export const UNSUPPORTED_SUBSCRIPTION_INTERVALS = ['hourly', 'minute'];
