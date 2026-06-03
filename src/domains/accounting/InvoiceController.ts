// smp-sdk-ts/src/invoice/invoice.ts

import { APIClient } from '../../api/APIClient.js';
import { invoiceQueries } from '../../api/graphql/accounting/queries.js';
import { invoiceMutations } from '../../api/graphql/accounting/mutations.js';

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
  // ── JSON string fields (stored as scalar String in GraphQL) ─────────────
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
  // ── PDF / download fields ────────────────────────────────────────────────
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
}

interface CreateInvoiceResponse {
  createInvoice: InvoiceResponse;
}

interface GetInvoiceResponse {
  invoice: InvoiceResponse;
}

interface GetInvoicesResponse {
  invoices: InvoiceResponse[];
}

interface GetInvoicesBySellerResponse {
  invoicesBySeller: InvoiceResponse[];
}

interface GetInvoicesByBuyerResponse {
  invoicesByBuyer: InvoiceResponse[];
}

interface GetInvoicesByBuyerUserResponse {
  invoicesByBuyerUser: InvoiceResponse[];
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
export class Invoice {
  private client: APIClient;

  /**
   * Initializes the `Invoice` class with an `APIClient` for requests.
   * @param client - An instance of `APIClient` for GraphQL requests.
   */
  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Creates a new invoice
   */
  async create(data: {
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
    // disclaimers?: string;
    paymentTerms?: string;
    profile?: string;
  }): Promise<InvoiceResponse> {
    const query = invoiceMutations.CREATE_INVOICE;
    const response = await this.client.mutate<CreateInvoiceResponse>(query, { input: data });
    return response.createInvoice;
  }

  /**
   * Updates an existing invoice
   */
  async update(invoiceId: string, data: any): Promise<InvoiceResponse> {
    const mutation = invoiceMutations.UPDATE_INVOICE;
    const response = await this.client.mutate<{ updateInvoice: InvoiceResponse }>(mutation, { invoiceId, input: data });
    return response.updateInvoice;
  }

  /**
   * Updates the download status of an invoice
   */
  async updateDownloadStatus(invoiceId: string, data: UpdateInvoiceDownloadStatusInput): Promise<InvoiceResponse> {
    const query = invoiceMutations.UPDATE_INVOICE_DOWNLOAD_STATUS;
    const response = await this.client.mutate<{ updateInvoiceDownloadStatus: InvoiceResponse }>(query, { invoiceId, input: data });
    return response.updateInvoiceDownloadStatus;
  }

  /**
   * Sends an invoice via email
   */
  async sendEmail(invoiceId: string, data: SendInvoiceEmailInput): Promise<InvoiceResponse> {
    const query = invoiceMutations.SEND_INVOICE_EMAIL;
    const response = await this.client.mutate<{ sendInvoiceEmail: InvoiceResponse }>(query, { invoiceId, input: data });
    return response.sendInvoiceEmail;
  }

  /**
   * Retrieves an invoice by its ID
   */
  async getById(invoiceId: string): Promise<InvoiceResponse> {
    const query = invoiceQueries.GET_INVOICE_BY_ID;
    const response = await this.client.query<GetInvoiceResponse>(query, { invoiceId: invoiceId });
    return response.invoice;
  }

  /**
   * Retrieves all invoices
   */
  async list(): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_ALL_INVOICES;
    const response = await this.client.query<GetInvoicesResponse>(query);
    return response.invoices;
  }

  /**
   * Retrieves all invoices for a seller organization
   */
  async listBySellerOrganizationId(sellerOrganizationId: string): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_INVOICES_BY_SELLER;
    const response = await this.client.query<GetInvoicesBySellerResponse>(query, { sellerOrganizationId });
    return response.invoicesBySeller;
  }

  async listByBuyerOrganizationId(buyerOrganizationId: string): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_INVOICES_BY_BUYER;
    const response = await this.client.query<GetInvoicesByBuyerResponse>(query, { buyerOrganizationId });
    return response.invoicesByBuyer;
  }

  async listByBuyerUserId(buyerUserId: string): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_INVOICES_BY_BUYER_USER;
    const response = await this.client.query<GetInvoicesByBuyerUserResponse>(query, { buyerUserId });
    return response.invoicesByBuyerUser;
  }

  /**
   * Fetches multiple invoices by an array of invoice IDs.
   * @param invoiceIDs - An array of invoice IDs.
   * @returns A list of invoices.
   */
  async getByIds(invoiceIDs: string[]) {
    const query = invoiceQueries.GET_INVOICES_BY_IDS;
    const variables = { invoiceIDs };
    const response = await this.client.query(query, variables) as { data: { invoicesByIDs: any[] } };
    return response.data.invoicesByIDs;
  }



  /**
   * Fetches an invoice by its slug.
   * @param slug - The slug of the invoice.
   * @returns The details of the invoice.
   */
  async getBySlug(slug: string) {
    const query = invoiceQueries.GET_INVOICE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { invoiceBySlug: any } };
    return response.data.invoiceBySlug;
  }

  /**
   * Fetches multiple invoices by their slugs.
   * @param slugs - An array of invoice slugs.
   * @returns A list of invoices.
   */
  async getBySlugs(slugs: string[]) {
    const query = invoiceQueries.GET_INVOICES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { invoicesBySlugs: any[] } };
    return response.data.invoicesBySlugs;
  }

  /**
   * Envoie une invitation de paiement pour une facture
   */
  async sendPayment(data: {
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
  }> {
    const mutation = invoiceMutations.SEND_INVOICE_PAYMENT;
    const response = await this.client.mutate(mutation, { input: data }) as { sendInvoicePayment: any };
    return response.sendInvoicePayment;
  }

  /**
   * Vérifie un token d'invitation de paiement
   */
  async verifyPaymentToken(token: string): Promise<{
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
  }> {
    const query = invoiceMutations.VERIFY_INVOICE_PAYMENT_TOKEN;
    const response = await this.client.query(query, { input: { token } }) as { verifyInvoicePaymentToken: any };
    return response.verifyInvoicePaymentToken;
  }

  /**
   * Traite le paiement d'une facture
   */
  async processPayment(token: string, data: {
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
  }> {
    const mutation = invoiceMutations.PROCESS_INVOICE_PAYMENT;
    const response = await this.client.mutate(mutation, { token, input: data }) as { processInvoicePayment: any };
    return response.processInvoicePayment;
  }

  /**
   * Génère et upload le PDF de la facture (backend sécurisé)
   */
  async generateAndUploadPDF(invoiceId: string, data: {
    userId: string;
    sellerOrganizationId: string;
    buyerOrganizationId?: string;
    ipAddress?: string;
    /** Force draft mode (watermark) regardless of invoice paymentStatus in DB */
    forceDraft?: boolean;
    /**
     * Logo de l'organisation vendeuse en base64 (data:image/...;base64,... ou raw base64).
     * Prioritaire sur le logo Services par défaut. Non stocké en DB.
     */
    sellerLogoBase64?: string;
  }): Promise<{
    success: boolean;
    message: string;
    filePath?: string;
    downloadUrl?: string;
    digitalSignature?: string;
    downloadCount?: number;
    pdfBase64?: string;
  }> {
    const mutation = invoiceMutations.GENERATE_INVOICE_PDF;
    const response = await this.client.mutate(mutation, { invoiceId, input: data }) as { generateInvoicePDF: any };
    return response.generateInvoicePDF;
  }

  // Note: getSecurePDFUrl et markAsDownloaded sont supprimées
  // L'URL de téléchargement est maintenant stockée directement dans invoice.pdfData.downloadUrl
  // après avoir appelé generateAndUploadPDF
}
