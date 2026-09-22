export declare const profileQueries: {
    GET_PROFILE: string;
    GET_PROFILES: string;
    GET_PROFILE_BY_SLUG: string;
    GET_PROFILE_BY_UNIQ_REF: string;
    GET_PROFILES_BY_IDS: string;
    GET_PROFILES_BY_SLUGS: string;
    GET_PROFILES_BY_USER_ID: string;
};
export declare const affiliateQueries: {
    GET_AFFILIATES_BY_REFERRER: string;
};
export declare const userPlanQueries: {
    /**
     * Fetch the authenticated user's live plan data directly from the DB.
     * Bypasses the JWT token (which may be stale after a Stripe subscription event).
     *
     * Usage:
     *   const data = await gqlClient.request(userPlanQueries.GET_MY_PLAN, { userID });
     *   const { plan, stripeCustomerId, planTrialEndsAt, planExpiresAt } = data.getMyPlan;
     */
    GET_MY_PLAN: string;
};
export declare const waitingListQueries: {
    GET_WAITING_LIST: string;
    GET_WAITING_LISTS: string;
};
export declare const preferenceQueries: {
    GET_USER_PREFERENCES: string;
    GET_USER_PREFERENCES_BY_USER_ID: string;
};
