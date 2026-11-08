import { APIClient } from '../../api/APIClient.js';
import type { InvoiceExportDownload, InvoiceExportInput, InvoiceExportJob, InvoiceExportPreview, InvoiceExportResult, InvoiceExportStatusInput, RequestInvoiceExportInput } from '../../types/accounting/invoiceExport.js';
import type { InvoicePaymentDue } from '../../types/accounting/invoicePaymentDue.js';
interface InvoiceResponse {
    invoiceId: string;
    transactionId: string;
    slug: string;
    orderId: string;
    thirdPartyFees: number;
    servicesFees: number;
    servicesVatPercent: number;
    prestationsVatPercent: number;
    totalAmount: number;
    sellerOrganizationId: string;
    buyerOrganizationId?: string;
    buyerUserId?: string;
    paymentStatus: string;
    emittedDate: string;
    dueDate: string;
    digitalSignature: string;
    state: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    transactionData?: any;
    notes?: string;
    paymentTerms?: string;
    profile?: string;
    /** JSON string — payment info: { dueDate?, paymentTermsText?, ... } */
    payment?: string;
    /** JSON string — buyer billing address & contact info */
    buyer?: string;
    /** JSON string — array of invoice line items */
    lines?: string;
    /** JSON string — array of VAT totals: { taxRate, taxableAmount, taxAmount }[] */
    taxTotals?: string;
    /** JSON string — seller identity & legal info */
    seller?: string;
    /** JSON string — document header metadata { invoiceNumber, issueDate, ... } */
    header?: string;
    downloadStatus?: {
        downloaded: boolean;
        downloadedAt?: string;
        downloadCount: number;
        ipAddress?: string;
    };
    pdfGeneratedAt?: string;
    pdfHash?: string;
    /** JSON string — { pdfDownloadUrl, pdfFilePath, ... } */
    additionalInfo?: string;
    /**
     * Présentation à utiliser pour afficher la facture EXACTEMENT comme son PDF
     * (renseignée par les requêtes d'UNE facture : invoice, invoiceBySlug).
     */
    documentPresentation?: import('../../types/accounting/documentPresentation.js').InvoiceDocumentPresentation | null;
}
interface UpdateInvoiceDownloadStatusInput {
    downloaded: boolean;
    downloadedAt: string;
    downloadCount: number;
    ipAddress: string;
}
interface SendInvoiceEmailInput {
    recipientEmail: string;
    recipientName: string;
    subject?: string;
    message?: string;
}
/**
 * The `Invoice` class handles invoice-related requests within the application.
 * It utilizes an `APIClient` to interact with the GraphQL API and provides methods
 * for retrieving, listing, and searching invoices based on various criteria.
 */
export declare class Invoice {
    private client;
    /**
     * Initializes the `Invoice` class with an `APIClient` for requests.
     * @param client - An instance of `APIClient` for GraphQL requests.
     */
    constructor(client: APIClient);
    /**
     * Creates a new invoice
     */
    create(data: {
        orderId: string;
        totalAmount: number;
        sellerOrganizationId: string;
        emittedDate: string;
        dueDate: string;
        transactionId: string;
        state?: string;
        paymentStatus?: string;
        notes?: string;
        transactionData?: any;
        thirdPartyFees?: number;
        servicesFees?: number;
        paymentTerms?: string;
        profile?: string;
    }): Promise<InvoiceResponse>;
    /**
     * Updates an existing invoice
     */
    update(invoiceId: string, data: any): Promise<InvoiceResponse>;
    /**
     * Updates the download status of an invoice
     */
    updateDownloadStatus(invoiceId: string, data: UpdateInvoiceDownloadStatusInput): Promise<InvoiceResponse>;
    /**
     * Sends an invoice via email
     */
    sendEmail(invoiceId: string, data: SendInvoiceEmailInput): Promise<InvoiceResponse>;
    /**
     * Retrieves an invoice by its ID
     */
    getById(invoiceId: string): Promise<InvoiceResponse>;
    /**
     * Retrieves all invoices
     */
    list(): Promise<InvoiceResponse[]>;
    /**
     * Retrieves all invoices for a seller organization
     */
    listBySellerOrganizationId(sellerOrganizationId: string): Promise<InvoiceResponse[]>;
    listByBuyerOrganizationId(buyerOrganizationId: string): Promise<InvoiceResponse[]>;
    listByBuyerUserId(buyerUserId: string): Promise<InvoiceResponse[]>;
    /**
     * Envoie une invitation de paiement pour une facture
     */
    sendPayment(data: {
        invoiceId: string;
        email: string;
        message?: string;
        firstName?: string;
        lastName?: string;
        expirationDays?: number;
    }): Promise<{
        success: boolean;
        message: string;
        invitationToken?: string;
        expiresAt?: string;
    }>;
    /**
     * Vérifie un token d'invitation de paiement
     */
    verifyPaymentToken(token: string): Promise<{
        isValid: boolean;
        message?: string;
        invoiceId?: string;
        email?: string;
        role?: string;
        expiresAt?: string;
        isExpired?: boolean;
        firstName?: string;
        lastName?: string;
        sentAt?: string;
        status?: string;
    }>;
    /**
     * Montant dû pour régler la facture par lien de paiement (C115) : TTC + commission + frais sur une
     * vente de la place de marché, TTC + frais de paiement sur une facture manuelle. C'est ce montant,
     * et non `totalAmount`, qu'il faut passer à `initiatePayment` ; mu-billing le recalcule au règlement.
     * `cardCountry` (ISO 3166-1 alpha-2) affine les frais de paiement ; défaut : pays de l'acheteur.
     */
    getPaymentDue(invoiceId: string, cardCountry?: string | null): Promise<InvoicePaymentDue | null>;
    /**
     * Traite le paiement d'une facture
     */
    processPayment(token: string, data: {
        paymentMethod: string;
        paymentReference: string;
        amount: number;
        currency: string;
        transactionId?: string;
    }): Promise<{
        success: boolean;
        message: string;
        invitationToken?: string;
        expiresAt?: string;
    }>;
    /**
     * Génère et upload le PDF de la facture (backend sécurisé)
     */
    generateAndUploadPDF(invoiceId: string, data: {
        userId: string;
        sellerOrganizationId: string;
        buyerOrganizationId?: string;
        ipAddress?: string;
        /** Force draft mode (watermark) regardless of invoice paymentStatus in DB */
        forceDraft?: boolean;
        /**
         * URL du logo de l'organisation vendeuse (PNG/JPEG).
         * Le backend fetch l'image depuis cette URL. Si absent, aucun logo.
         */
        sellerLogoUrl?: string;
    }): Promise<{
        success: boolean;
        message: string;
        filePath?: string;
        downloadUrl?: string;
        digitalSignature?: string;
        downloadCount?: number;
        pdfBase64?: string;
    }>;
    /**
     * Export comptable — nombre de factures exportables sur la période.
     * Réservé aux services internes : `client` doit porter `x-smp-internal-secret`
     * (`httpApiClient.withHeaders(...)`) ; l'appelant a vérifié le droit `invoices.export`.
     */
    getExportPreview(input: InvoiceExportInput): Promise<InvoiceExportPreview>;
    /**
     * Export comptable SYNCHRONE — archive ZIP produite pendant l'appel (service interne). Préférer
     * `requestExport` : l'export asynchrone ne bloque pas l'appel, notifie à la fin et débite au fil de l'eau.
     */
    exportInvoices(input: InvoiceExportInput): Promise<InvoiceExportResult>;
    /**
     * Export comptable ASYNCHRONE (service interne) : répond aussitôt (`queued`) ; mu-billing produit
     * l'archive en tâche de fond, débite les STK au fil de l'eau selon la charge réelle et prévient le
     * membre à la fin (in-app, push, e-mail — ZIP joint s'il est léger).
     */
    requestExport(input: RequestInvoiceExportInput): Promise<InvoiceExportJob>;
    /** État et avancement d'un export de l'organisation (service interne). */
    getExportStatus(input: InvoiceExportStatusInput): Promise<InvoiceExportJob>;
    /**
     * Reprise d'un export mis en pause faute de STK (service interne ; l'appelant vérifie le solde) :
     * les tranches déjà payées ne sont pas redébitées.
     */
    resumeExport(input: InvoiceExportStatusInput): Promise<InvoiceExportJob>;
    /** Lien signé d'une heure d'une archive livrée ; le premier téléchargement programme sa suppression (service interne). */
    downloadExport(input: InvoiceExportStatusInput): Promise<InvoiceExportDownload>;
}
export {};
