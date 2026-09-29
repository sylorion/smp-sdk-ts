declare const estimateQueries: {
    GET_ESTIMATE_BY_ID: string;
    CREATE_ESTIMATE: string;
    VALIDATE_ESTIMATE: string;
    GET_ESTIMATES_BY_BUYER_USER_ID: string;
    GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID: string;
    GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID: string;
    GET_ALL_MU_CONTRACT_ESTIMATES: string;
    GET_NEGOTIATION_HISTORY: string;
    GET_CURRENT_NEGOTIATION: string;
};
export { estimateQueries };
declare const invoiceQueries: {
    GET_INVOICE_BY_ID: string;
    GET_ALL_INVOICES: string;
    GET_INVOICES_BY_SELLER: string;
    GET_INVOICES_BY_BUYER: string;
    GET_INVOICES_BY_BUYER_USER: string;
};
export { invoiceQueries };
declare const transactionQueries: {
    GET_TRANSACTION_BY_ID: string;
    GET_TRANSACTIONS_BY_BUYER_USER_ID: string;
    GET_TRANSACTIONS_BY_BUYER_ORGANIZATION_ID: string;
    GET_TRANSACTIONS_BY_SELLER_ORGANIZATION_ID: string;
};
export { transactionQueries };
declare const walletQueries: {
    GET_WALLET_BY_ID: string;
    GET_WALLETS: string;
    GET_WALLETS_BY_USER: string;
    GET_WALLETS_BY_ORGANIZATION: string;
    GET_USER_WALLETS: string;
    GET_ORGANIZATION_WALLETS: string;
    GET_ALL_WALLETS: string;
    GET_CONVERSION_DETAILS: string;
    TOKEN_USAGE_SUMMARY: string;
    TOKEN_USAGE_HISTORY: string;
    TOKEN_COST_ESTIMATE: string;
    GET_STRIPE_CONNECT_STATUS: string;
    WALLET_LEDGER_HISTORY: string;
};
export { walletQueries };
export declare const orderQueries: {
    GET_AGENT_EXECUTION_STATUS: string;
    GET_ORDER_BY_ID: string;
    GET_ORDERS_BY_USER_ID: string;
    GET_ORDERS_BY_SELLER_ORGANIZATION_ID: string;
    GET_ORDERS_BY_BUYER_ORGANIZATION_ID: string;
};
declare const contractQueries: {
    GET_CONTRACT_BY_ID: string;
    GET_CONTRACT_BY_INVITATION_TOKEN: string;
    GET_ORGANIZATION_CONTRACT_TEMPLATES: string;
    GET_ORGANIZATION_CONTRACT_TEMPLATE: string;
    GET_ALL_CONTRACTS: string;
    GET_CONTRACTS_BY_ORGANIZATION_ID: string;
    GET_CONTRACT_TEMPLATES: string;
    GET_CONTRACT_TEMPLATE: string;
    GET_ORGANIZATION_SIGNATURE_SETTINGS: string;
};
export { contractQueries };
declare const withdrawalQueries: {
    GET_WITHDRAWAL: string;
    LIST_WITHDRAWALS: string;
};
export { withdrawalQueries };
