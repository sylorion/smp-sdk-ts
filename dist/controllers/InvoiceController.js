// smp-sdk-ts/src/invoice/invoice.ts
import { invoiceQueries } from '../api/graphql/queries/accounting/invoiceQueries.js';
import invoiceMutations from '../api/graphql/mutations/accounting/invoiceMutations.js';
/**
 * The `Invoice` class handles invoice-related requests within the application.
 * It utilizes an `APIClient` to interact with the GraphQL API and provides methods
 * for retrieving, listing, and searching invoices based on various criteria.
 */
export class Invoice {
    /**
     * Initializes the `Invoice` class with an `APIClient` for requests.
     * @param client - An instance of `APIClient` for GraphQL requests.
     */
    constructor(client) {
        this.client = client;
    }
    /**
     * Creates a new invoice
     */
    async create(data) {
        const query = invoiceMutations.CREATE_INVOICE;
        const response = await this.client.mutate(query, { input: data });
        return response.createInvoice;
    }
    /**
     * Updates an existing invoice
     */
    async update(invoiceId, data) {
        const mutation = invoiceMutations.UPDATE_INVOICE;
        const response = await this.client.mutate(mutation, { invoiceId, input: data });
        return response.updateInvoice;
    }
    /**
     * Updates the download status of an invoice
     */
    async updateDownloadStatus(invoiceId, data) {
        const query = invoiceMutations.UPDATE_INVOICE_DOWNLOAD_STATUS;
        const response = await this.client.mutate(query, { invoiceId, input: data });
        return response.updateInvoiceDownloadStatus;
    }
    /**
     * Sends an invoice via email
     */
    async sendEmail(invoiceId, data) {
        const query = invoiceMutations.SEND_INVOICE_EMAIL;
        const response = await this.client.mutate(query, { invoiceId, input: data });
        return response.sendInvoiceEmail;
    }
    /**
     * Retrieves an invoice by its ID
     */
    async getById(invoiceId) {
        const query = invoiceQueries.GET_INVOICE_BY_ID;
        const response = await this.client.query(query, { invoiceId: invoiceId });
        return response.invoice;
    }
    /**
     * Retrieves all invoices
     */
    async list() {
        const query = invoiceQueries.GET_ALL_INVOICES;
        const response = await this.client.query(query);
        return response.invoices;
    }
    /**
     * Retrieves all invoices for a seller organization
     */
    async getBySeller(sellerOrganizationId) {
        const query = invoiceQueries.GET_INVOICES_BY_SELLER;
        const response = await this.client.query(query, { sellerOrganizationId });
        return response.invoicesBySeller;
    }
    /**
     * Retrieves all invoices for a buyer organization
     */
    async getByBuyer(buyerOrganizationId) {
        const query = invoiceQueries.GET_INVOICES_BY_BUYER;
        const response = await this.client.query(query, { buyerOrganizationId });
        return response.invoicesByBuyer;
    }
    /**
     * Retrieves all invoices for a buyer user
     */
    async getByBuyerUser(buyerUserId) {
        const query = invoiceQueries.GET_INVOICES_BY_BUYER_USER;
        const response = await this.client.query(query, { buyerUserId });
        return response.invoicesByBuyerUser;
    }
    /**
     * Fetches multiple invoices by an array of invoice IDs.
     * @param invoiceIDs - An array of invoice IDs.
     * @returns A list of invoices.
     */
    async getByIDs(invoiceIDs) {
        const query = invoiceQueries.GET_INVOICES_BY_IDS;
        const variables = { invoiceIDs };
        const response = await this.client.query(query, variables);
        return response.data.invoicesByIDs;
    }
    /**
     * Fetches an invoice by its slug.
     * @param slug - The slug of the invoice.
     * @returns The details of the invoice.
     */
    async getBySlug(slug) {
        const query = invoiceQueries.GET_INVOICE_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.data.invoiceBySlug;
    }
    /**
     * Fetches multiple invoices by their slugs.
     * @param slugs - An array of invoice slugs.
     * @returns A list of invoices.
     */
    async getBySlugs(slugs) {
        const query = invoiceQueries.GET_INVOICES_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.data.invoicesBySlugs;
    }
    /**
     * Envoie une invitation de paiement pour une facture
     */
    async sendPayment(data) {
        const mutation = invoiceMutations.SEND_INVOICE_PAYMENT;
        const response = await this.client.mutate(mutation, { input: data });
        return response.sendInvoicePayment;
    }
    /**
     * Vérifie un token d'invitation de paiement
     */
    async verifyPaymentToken(token) {
        const query = invoiceMutations.VERIFY_INVOICE_PAYMENT_TOKEN;
        const response = await this.client.query(query, { input: { token } });
        return response.verifyInvoicePaymentToken;
    }
    /**
     * Traite le paiement d'une facture
     */
    async processPayment(token, data) {
        const mutation = invoiceMutations.PROCESS_INVOICE_PAYMENT;
        const response = await this.client.mutate(mutation, { token, input: data });
        return response.processInvoicePayment;
    }
    /**
     * Génère et upload le PDF de la facture (backend sécurisé)
     */
    async generateAndUploadPDF(invoiceId, data) {
        const mutation = invoiceMutations.GENERATE_INVOICE_PDF;
        const response = await this.client.mutate(mutation, { invoiceId, input: data });
        return response.generateInvoicePDF;
    }
}
