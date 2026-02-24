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
  transactionData?: any; // JSON object
  notes?: string;
  // disclaimers?: string;
  paymentTerms?: string;
  profile?: string;
  // Champs PDF existants dans Prisma
  downloadStatus?: {
    downloaded: boolean;
    downloadedAt?: string;
    downloadCount: number;
    ipAddress?: string;
  };
  pdfGeneratedAt?: string;
  pdfHash?: string;
  additionalInfo?: string; // JSON string contenant pdfDownloadUrl, pdfFilePath, etc.
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
  async listBySeller(sellerOrganizationId: string): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_INVOICES_BY_SELLER;
    const response = await this.client.query<GetInvoicesBySellerResponse>(query, { sellerOrganizationId });
    return response.invoicesBySeller;
  }

  /**
   * Retrieves all invoices for a buyer organization
   */
  async listByBuyer(buyerOrganizationId: string): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_INVOICES_BY_BUYER;
    const response = await this.client.query<GetInvoicesByBuyerResponse>(query, { buyerOrganizationId });
    return response.invoicesByBuyer;
  }

  /**
   * Retrieves all invoices for a buyer user
   */
  async listByBuyerUser(buyerUserId: string): Promise<InvoiceResponse[]> {
    const query = invoiceQueries.GET_INVOICES_BY_BUYER_USER;
    const response = await this.client.query<GetInvoicesByBuyerUserResponse>(query, { buyerUserId });
    return response.invoicesByBuyerUser;
  }

  /**
   * Fetches multiple invoices by an array of invoice IDs.
   * @param invoiceIDs - An array of invoice IDs.
   * @returns A list of invoices.
   */
  async getByIDs(invoiceIDs: string[]) {
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
  }): Promise<{
    success: boolean;
    message: string;
    filePath?: string;
    downloadUrl?: string;
    digitalSignature?: string;
    downloadCount?: number;
  }> {
    const mutation = invoiceMutations.GENERATE_INVOICE_PDF;
    const response = await this.client.mutate(mutation, { invoiceId, input: data }) as { generateInvoicePDF: any };
    return response.generateInvoicePDF;
  }

  // Note: getSecurePDFUrl et markAsDownloaded sont supprimées
  // L'URL de téléchargement est maintenant stockée directement dans invoice.pdfData.downloadUrl
  // après avoir appelé generateAndUploadPDF
}
