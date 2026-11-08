// smp-sdk-ts/src/invoice/invoice.ts
import { invoiceQueries } from '../../api/graphql/accounting/queries.js';
import { invoiceMutations } from '../../api/graphql/accounting/mutations.js';
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
    async listBySellerOrganizationId(sellerOrganizationId) {
        const query = invoiceQueries.GET_INVOICES_BY_SELLER;
        const response = await this.client.query(query, { sellerOrganizationId });
        return response.invoicesBySeller;
    }
    async listByBuyerOrganizationId(buyerOrganizationId) {
        const query = invoiceQueries.GET_INVOICES_BY_BUYER;
        const response = await this.client.query(query, { buyerOrganizationId });
        return response.invoicesByBuyer;
    }
    async listByBuyerUserId(buyerUserId) {
        const query = invoiceQueries.GET_INVOICES_BY_BUYER_USER;
        const response = await this.client.query(query, { buyerUserId });
        return response.invoicesByBuyerUser;
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
     * Montant dû pour régler la facture par lien de paiement (C115) : TTC + commission + frais sur une
     * vente de la place de marché, TTC + frais de paiement sur une facture manuelle. C'est ce montant,
     * et non `totalAmount`, qu'il faut passer à `initiatePayment` ; mu-billing le recalcule au règlement.
     * `cardCountry` (ISO 3166-1 alpha-2) affine les frais de paiement ; défaut : pays de l'acheteur.
     */
    async getPaymentDue(invoiceId, cardCountry) {
        const response = await this.client.query(invoiceQueries.INVOICE_PAYMENT_DUE, { invoiceId, cardCountry: cardCountry ?? null });
        return response.invoicePaymentDue ?? null;
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
    // Note: getSecurePDFUrl et markAsDownloaded sont supprimées
    // L'URL de téléchargement est maintenant stockée directement dans invoice.pdfData.downloadUrl
    // après avoir appelé generateAndUploadPDF
    /**
     * Export comptable — nombre de factures exportables sur la période.
     * Réservé aux services internes : `client` doit porter `x-smp-internal-secret`
     * (`httpApiClient.withHeaders(...)`) ; l'appelant a vérifié le droit `invoices.export`.
     */
    async getExportPreview(input) {
        const response = await this.client.query(invoiceQueries.INVOICE_EXPORT_PREVIEW, { input });
        return response.invoiceExportPreview;
    }
    /**
     * Export comptable SYNCHRONE — archive ZIP produite pendant l'appel (service interne). Préférer
     * `requestExport` : l'export asynchrone ne bloque pas l'appel, notifie à la fin et débite au fil de l'eau.
     */
    async exportInvoices(input) {
        const response = await this.client.mutate(invoiceMutations.EXPORT_INVOICES, { input });
        return response.exportInvoices;
    }
    /**
     * Export comptable ASYNCHRONE (service interne) : répond aussitôt (`queued`) ; mu-billing produit
     * l'archive en tâche de fond, débite les STK au fil de l'eau selon la charge réelle et prévient le
     * membre à la fin (in-app, push, e-mail — ZIP joint s'il est léger).
     */
    async requestExport(input) {
        const response = await this.client.mutate(invoiceMutations.REQUEST_INVOICE_EXPORT, { input });
        return response.requestInvoiceExport;
    }
    /** État et avancement d'un export de l'organisation (service interne). */
    async getExportStatus(input) {
        const response = await this.client.query(invoiceQueries.INVOICE_EXPORT_STATUS, { input });
        return response.invoiceExportStatus;
    }
    /**
     * Reprise d'un export mis en pause faute de STK (service interne ; l'appelant vérifie le solde) :
     * les tranches déjà payées ne sont pas redébitées.
     */
    async resumeExport(input) {
        const response = await this.client.mutate(invoiceMutations.RESUME_INVOICE_EXPORT, { input });
        return response.resumeInvoiceExport;
    }
    /** Lien signé d'une heure d'une archive livrée ; le premier téléchargement programme sa suppression (service interne). */
    async downloadExport(input) {
        const response = await this.client.mutate(invoiceMutations.DOWNLOAD_INVOICE_EXPORT, { input });
        return response.downloadInvoiceExport;
    }
}
