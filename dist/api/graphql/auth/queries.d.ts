export declare const affiliateQueries: {
    GET_AFFILIATES_BY_REFERRER: string;
    GET_AFFILIATE_LINKS_BY_REFERRER: string;
    GET_AFFILIATE_LINK_BY_TOKEN: string;
};
export declare const QUERY_CHECK_USERNAME_AVAILABILITY = "\n  query CheckUsernameAvailability($input: CheckUsernameInput!) {\n    checkUsernameAvailability(input: $input) {\n      available\n      message\n    }\n  }\n";
export declare const adminAuthQueries: {
    ADMIN_SEARCH_USERS: string;
    ADMIN_GET_USER_BY_ID: string;
    ADMIN_GET_USER_BY_EMAIL: string;
    ADMIN_GET_PLAN_STATS: string;
    ADMIN_GET_USER_COUNT: string;
};
