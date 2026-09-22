declare const profileMutations: {
    CREATE_PROFILE: string;
    UPDATE_PROFILE: string;
    DELETE_PROFILE: string;
};
export { profileMutations };
export declare const affiliateMutations: {
    GENERATE_AFFILIATE_TOKEN: string;
    CREATE_AFFILIATE: string;
    DECODE_AFFILIATE_TOKEN: string;
    SEND_AFFILIATION_INVITATION: string;
};
export declare const waitingListMutations: {
    CREATE_WAITING_LIST: string;
    UPDATE_WAITING_LIST: string;
    DELETE_WAITING_LIST: string;
    CONFIRM_WAITING_LIST: string;
    RESEND_WAITING_LIST_EMAIL: string;
    VERIFY_WAITING_LIST_TOKEN: string;
};
export declare const MUTATION_AUTH_APP = "\n  mutation AuthenticateApp($appLoginInput: AppLoginInput!) {\n    authenticateApp(input: $appLoginInput) {\n      accessToken\n      refreshToken\n      accessValidityDuration\n      refreshValidityDuration\n      application {\n        applicationID\n        uniqRef\n        slug\n        authKey\n        appID\n        description\n        title\n        email\n        logo\n        url\n        plan\n        isOfficialApp\n        appConfiguration\n        developerID\n        authorID\n        state\n        createdAt\n        updatedAt\n      }\n    }\n  }\n";
export declare const MUTATION_AUTH_USER = "\n  mutation AuthenticateUser($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n        accessToken  \n        refreshToken  \n        accessValidityDuration\n        refreshValidityDuration\n        user {\n          userID        \n          uniqRef       \n          slug          \n          username      \n          email         \n          plan\n          stripeCustomerId\n          planSubscriptionId\n          planTrialEndsAt\n          planExpiresAt\n          profileID    \n          lastLogin     \n          loginDuration  \n          state         \n          updatedAt     \n          twoFactorEnabled \n      }\n      message \n      errors {\n        code\n        field\n        message\n      }\n    }\n  }\n";
export declare const MUTATION_REFRESH_APP_TOKEN = "\n  mutation RefreshAppToken($refreshToken: String!) {\n    refreshAppToken(token: $refreshToken) {\n      accessToken\n      expiresIn \n    } \n  }\n";
export declare const MUTATION_REFRESH_USER_TOKEN = "\n  mutation RefreshUserToken($refreshToken: String!) {\n    refreshUserToken(token: $refreshToken) {\n      accessToken\n      expiresIn\n    } \n  }\n";
export declare const MUTATION_AUTH_LOGOUT_USER = "\n  mutation logout($input: LogoutInput!) {\n  logout(input: $input) {\n    message\n    success\n  }\n}\n";
export declare const MUTATION_AUTH_LOGOUT_APP = "\n  mutation LogoutApp($appID: ID!) {\n    logoutApp(appID: $appID) {\n      message\n      success\n    } \n  }\n";
export declare const MUTATION_CREATE_USER = "\n  mutation Signup($input: CreateUserInput!, $affiliateToken: String) {\n    signup(input: $input, affiliateToken: $affiliateToken) {\n      userID\n      uniqRef\n      slug\n      username\n      email\n      plan\n      profileID\n      userKind\n      lastLogin\n      twoFactorEnabled\n      loginDuration\n      rsaPublicKey\n      state\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n";
export declare const MUTATION_FORGOT_PASSWORD = "\n mutation ForgotPassword($email: String!) {\n  forgotPassword(email: $email) {\n    success\n    message\n    token\n  }\n}\n";
export declare const MUTATION_RESET_PASSWORD = "\nmutation resetPassword($input: ResetPasswordInput!) {\n  resetPassword(input: $input) {\n    success\n    message\n  }\n}";
export declare const preferenceMutations: {
    CREATE_USER_PREFERENCES: string;
    UPDATE_USER_PREFERENCES: string;
};
export declare const MUTATION_REQUEST_EMAIL_CHANGE = "\n  mutation RequestEmailChange($input: RequestEmailChangeInput!, $userID: ID!) {\n    requestEmailChange(input: $input, userID: $userID) {\n      success\n      message\n    }\n  }\n";
export declare const MUTATION_CONFIRM_EMAIL_CHANGE = "\n  mutation ConfirmEmailChange($input: ConfirmEmailChangeInput!, $userID: ID!) {\n    confirmEmailChange(input: $input, userID: $userID) {\n      success\n      message\n    }\n  }\n";
