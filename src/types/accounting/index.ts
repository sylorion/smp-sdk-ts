// ==============================
// BILLING & INVOICING
// ==============================
export * from './billing.js';
import { BillingInformation } from './billing.js';


// ==============================
// CONTRACT
// ==============================
export enum ContractStatus {
    PENDING = 'PENDING',
    PROVIDER_SIGNED = 'PROVIDER_SIGNED',
    CLIENT_SIGNED = 'CLIENT_SIGNED',
    ACTIVE = 'ACTIVE',
    REJECTED = 'REJECTED'
}

export enum SignerRole {
    CLIENT = 'client',
    PROVIDER = 'provider'
}

export enum SignatureType {
    HASH = 'hash',
    IMAGE = 'image',
    UPLOAD = 'upload',
    DIGITAL = 'digital'
}

export interface ContractResponse {
    contractId: string;
    estimateId?: string;
    serviceId: string;
    organizationId?: string;
    clientSignHash?: string;
    providerSignHash?: string;
    status: ContractStatus;
    content: any;
    variables: any;
    details: any;
    clientSignDate?: string;
    providerSignDate?: string;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateContractInput {
    serviceId: string;
    estimateId?: string;
    organizationId?: string;
    status?: string;
    content: any;
    variables: any;
    details?: any;
    authorId?: string;
    /**
     * 'manual'   : created by org owner from dashboard → counts toward plan limits.
     * 'pipeline' : auto-created after order.paid → does NOT count.
     */
    source?: 'manual' | 'pipeline';
}

export interface UpdateContractInput {
    contractId?: string;
    status?: string;
    content?: any;
    variables?: any;
    details?: any;
    organizationId?: string;
    additionalData?: any;
}

export interface SignContractInput {
    contractId: string;
    role: SignerRole;
    signatureText?: string;
}

export interface SendContractInput {
    contractId: string;
    email: string;
    message?: string;
    firstName?: string;
    lastName?: string;
    expirationDays?: number;
}

export interface CreateContractResponse {
    createContract: ContractResponse;
}

export interface UpdateContractResponse {
    updateContract: ContractResponse;
}

export interface SignContractResponse {
    signContract: ContractResponse;
}

export interface SendContractResponse {
    sendContract: {
        success: boolean;
        message: string;
        invitationToken?: string;
        expiresAt?: string;
    };
}

export interface GetContractResponse {
    getContract: ContractResponse;
}

export interface GetContractsResponse {
    contracts: ContractResponse[];
}

export interface GetContractsByOrganizationIdResponse {
    getContractsByOrganizationId: ContractResponse[];
}

export interface VerifyTokenInput {
    token: string;
}

export interface VerifyTokenResponse {
    isValid: boolean;
    message?: string;
    contractId?: string;
    email?: string;
    role?: string;
    expiresAt?: string;
    isExpired?: boolean;
}

export interface VerifyTokenGraphQLResponse {
    verifyToken: VerifyTokenResponse;
}

// ==============================
// ESTIMATE
// ==============================
export enum NegotiationStatus {
    NONE = 'NONE',
    IN_PROGRESS = 'IN_PROGRESS',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}

export enum EstimateStatus {
    PENDING = 'PENDING',
    NEGOTIATING = 'NEGOTIATING',
    CLIENT_VALIDATED = 'CLIENT_VALIDATED',
    PROVIDER_VALIDATED = 'PROVIDER_VALIDATED',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    CLOSED = 'CLOSED'
}

export interface Negotiation {
    id: string;
    estimateId: string;
    proposedPrice: number;
    details?: Record<string, any>;
    iterationCount: number;
    status: NegotiationStatus;
    proposedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface EstimateDetails {
    estimateId: string;
    estimateNumber: string;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId: string;
    proposalPrice?: number;
    currentNegotiationId?: string;
    negotiationStatus: NegotiationStatus;
    details: {
        services: Array<{
            serviceID: string;
            title: string;
            description: string;
            synthese: string;
            price: number;
            items: Array<{
                id: string;
                title: string;
                description: string;
                quantity: number;
                unitPrice: number;
                total: number;
            }>;
            actions: any[];
            isNegotiable: boolean;
        }>;
        from: {
            name: string;
            address: string;
        };
        to: {
            name: string;
            address: string;
        };
        estimateNumber: string;
        issueDate: string;
        validUntil: string;
        tax: number;
        subTotal: number;
        total: number;
        actions: any[];
        isNegotiable: boolean;
        booking?: {
            slotDate?: string;
            slotStartTime?: number;
            slotEndTime?: number;
            slotDuration?: number;
            timeSlotId?: string;
            location?: string;
        };
    };
    items: any[];
}

export interface CreateNegotiationInput {
    estimateId: string;
    proposedPrice: number;
    proposedBy: string;
    details?: Record<string, any>;
}

export interface NegotiationResponse {
    estimate: EstimateDetails;
    negotiation: Negotiation;
}

export interface EstimateResponse {
    estimateId: string;
    serviceId: string;
    proposalPrice?: number;
    details?: any;
    status: string;
    negotiationCount: number;
    negotiationStatus?: NegotiationStatus;
    currentNegotiationId?: string;
    clientSignDate?: any;
    providerSignDate?: any;
    createdAt: any;
    updatedAt?: any;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId?: string;
}

export interface CreateEstimateInput {
    serviceId: string;
    proposalPrice?: number;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId?: string;
    negotiationCount?: number;
    details?: any;
    /**
     * Discriminates manual creations (dashboard) from automated pipeline creations.
     * - 'manual'   : created by the org owner → counts toward plan limits.
     * - 'pipeline' : created by the payment/booking flow → does NOT count.
     * Defaults to 'manual' if omitted.
     */
    source?: 'manual' | 'pipeline';
}

export interface UpdateEstimateInput {
    estimateId?: string;
    status?: string;
    proposalPrice?: number;
    details?: any;
}

// ==============================
// PLAN LIMIT ERROR  (returned in HTTP 402 responses)
// ==============================

/**
 * Structured payload returned by Next.js API routes when a plan limit is exceeded.
 * Present in the JSON body as { planLimitError: PlanLimitError }.
 */
export interface PlanLimitError {
    code: 'PLAN_LIMIT_EXCEEDED';
    action: string;
    limit: number;
    currentCount: number;
    remaining: number;
    upgradeToTier: string;
    message: string;
}

// ==============================
// INVOICE
// ==============================
export interface InvoiceResponse {
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
    downloadStatus?: {
        downloaded: boolean;
        downloadedAt?: string;
        downloadCount: number;
        ipAddress?: string;
    };
    pdfGeneratedAt?: string;
    pdfHash?: string;
    additionalInfo?: string;
}

export interface UpdateInvoiceDownloadStatusInput {
    downloaded: boolean;
    downloadedAt: string;
    downloadCount: number;
    ipAddress: string;
}

export interface SendInvoiceEmailInput {
    recipientEmail: string;
    recipientName: string;
    subject?: string;
    message?: string;
}

// ==============================
// ORDER
// ==============================
export interface OrderAsset {
    orderAssetId: string;
    assetId: string;
    quantity: number;
    unitPrice: number;
    title: string;
    description: string;
    legalVatPercent: number;
    details?: any;
}

export interface OrderResponse {
    orderId: string;
    userId?: string;
    sellerOrganizationId?: string;
    buyerOrganizationId?: string;
    transactionId?: string;
    destinationWalletId?: string;
    sourceWalletId?: string;
    currency?: string;
    estimateId: string;
    serviceId?: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
    billingInformation?: BillingInformation;
    lines: OrderAsset[];
}

export interface CreateOrderInput {
    userId?: string;
    serviceId: string;
    estimateId: string;
    totalPrice: number;
    transactionId?: string;
    sellerOrganizationId: string;
    buyerOrganizationId: string;
    currency: string;
    billingInformation?: BillingInformation;
}

export interface AddLineInput {
    orderAssetId: string;
    assetId: string;
    quantity: number;
    unitPrice: number;
    title: string;
    description: string;
    legalVatPercent: number;
    details: any;
}

export interface UpdateLineDataInput {
    quantity: number;
    unitPrice?: number;
    title?: string;
    description?: string;
    legalVatPercent?: number;
}

export interface DeleteLineInput {
    orderId: string;
    assetId: string;
}

// ==============================
// TRANSACTION
// ==============================
export interface TransactionResponse {
    transactionId: string;
    serviceId: string;
    slug?: string;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerUserContactId?: string;
    sellerOrganizationId: string;
    currency: string;
    totalAmount?: number;
    state: string;
    status: string;
    metadata: string;
    createdAt: string;
    updatedAt?: string;
    deletedAt?: string;
}

export interface CreateTransactionInput {
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId: string;
    totalAmount?: number;
    currency?: string;
    serviceId: string;
    sellerUserContactId?: string;
    metadata?: string;
}

// ==============================
// PAYMENT
// ==============================
export interface CreatePaymentDto {
    transactionId?: string;
    orderId: string;
    type: string;
    amount: number;
    currency: string;
}

export interface PaymentIntent {
    paymentIntent: string;
    clientSecret: string;
    amount: number;
    currency: string;
    orderId?: string;
    organizationId?: string;
    userId?: string;
    transfertId?: string;
    status: string;
    metadata?: string;
    createdAt: string;
}

export interface CardPaymentResponse {
    success: boolean;
    data?: PaymentIntent;
    error?: string;
    code?: string;
}
export * from './Wallet.js';
