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
export default invoiceMutations;
