declare const invoiceMutations: {
    CREATE_INVOICE: string;
    UPDATE_INVOICE: string;
    DELETE_INVOICE: string;
    UPDATE_INVOICE_DOWNLOAD_STATUS: string;
    SEND_INVOICE_EMAIL: string;
    SEND_INVOICE_PAYMENT: string;
    PROCESS_INVOICE_PAYMENT: string;
    VERIFY_INVOICE_PAYMENT_TOKEN: string;
    GENERATE_INVOICE_PDF: string;
    MARK_INVOICE_DOWNLOADED: string;
};
export { invoiceMutations };
declare const paymentMutations: {
    ADD_LINE: string;
    DELETE_LINE: string;
    UPDATE_LINE: string;
    INITIATE_PAYMENT: string;
    INITIATE_SERVICE_SUBSCRIPTION_PAYMENT: string;
    CREATE_ESTIMATE: string;
    UPDATE_ESTIMATE: string;
    SEND_ESTIMATE: string;
    UPDATE_CONTRACT: string;
    CREATE_ORDER: string;
    UPDATE_ORDER: string;
    CONFIRM_ORDER: string;
    MARK_ORDER_PAID: string;
    MARK_ORDER_DELIVERED: string;
    CANCEL_ORDER: string;
    EMIT_NEGOTIATION_PROPOSAL: string;
    EMIT_ESTIMATE_ACCEPTED: string;
    EMIT_ESTIMATE_SUBMITTED: string;
};
export { paymentMutations };
declare const transactionMutations: {
    CREATE_TRANSACTION: string;
    UPDATE_TRANSACTION: string;
};
export { transactionMutations };
declare const walletMutations: {
    CREATE_WALLET: string;
    DEPOSIT: string;
    WITHDRAW: string;
    CONVERT_TO_TOKENS: string;
    CONVERT_TOKENS_TO_MONEY: string;
    PAY_WITH_WALLET: string;
    ADD_REVENUE: string;
    BANK_WITHDRAW: string;
    TRANSFER: string;
    SET_PRIMARY_CURRENCY: string;
    ADJUSTMENT: string;
    CREATE_STRIPE_CONNECT_ACCOUNT: string;
    GENERATE_STRIPE_ONBOARDING_LINK: string;
    CREATE_STRIPE_ACCOUNT_SESSION: string;
};
declare const withdrawalMutations: {
    CREATE_WITHDRAWAL: string;
    SUBMIT_FOR_APPROVAL: string;
    REVIEW_WITHDRAWAL: string;
};
export { withdrawalMutations };
export { walletMutations };
declare const secureTransferMutations: {
    INITIATE_SECURE_TRANSFER: string;
    CONFIRM_SECURE_TRANSFER: string;
};
export { secureTransferMutations };
declare const contractMutations: {
    CREATE_CONTRACT: string;
    UPDATE_CONTRACT: string;
    SIGN_CONTRACT: string;
    SEND_CONTRACT: string;
    VERIFY_TOKEN: string;
};
export { contractMutations };
