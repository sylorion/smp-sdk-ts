import { APIClient } from '../../api/APIClient.js';
import { BillingInformation } from '../../types/accounting/billing.js';
export interface CreatePaymentDto {
    transactionId?: string;
    orderId: string;
    type: string;
    amount: number;
    currency: string;
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
export interface CreateEstimateInput {
    serviceId: string;
    proposalPrice?: number;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId?: string;
    negotiationCount?: number;
    details?: any;
    /**
     * 'manual'   : org dashboard creation → counts toward plan limits.
     * 'pipeline' : payment/booking flow → excluded from plan limit counting.
     * Defaults to 'manual' if omitted (safe for dashboard calls).
     */
    source?: 'manual' | 'pipeline';
}
export interface UpdateEstimateInput {
    estimateId?: string;
    status?: string;
    proposalPrice?: number;
    details?: any;
}
export interface UpdateContractInput {
    status?: string;
    additionalData?: any;
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
export interface Estimate {
    estimateId: string;
    serviceId: string;
    proposalPrice?: number;
    details?: any;
    status: string;
    negotiationCount: number;
    clientSignDate?: Date;
    providerSignDate?: Date;
    createdAt: Date;
    updatedAt?: Date;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId: string;
}
export interface OrderAsset {
    orderAssetId: string;
    assetId: string;
    quantity: number;
    unitPrice: number;
    title: string;
    description: string;
    legalVatPercent: number;
}
export interface Order {
    orderId: string;
    estimateId: string;
    userId?: string;
    totalPrice: number;
    status: string;
    billingInformation?: BillingInformation;
    lines: OrderAsset[];
    createdAt: string;
}
export interface Transaction {
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
export declare class SMPPayment {
    private client;
    constructor(client: APIClient);
    initiatePayment(input: CreatePaymentDto): Promise<CardPaymentResponse>;
    initiateServiceSubscriptionPayment(input: CreatePaymentDto): Promise<CardPaymentResponse>;
    createEstimate(input: CreateEstimateInput): Promise<Estimate>;
    updateEstimate(updateEstimateId: string, data: UpdateEstimateInput): Promise<Estimate>;
    getById(estimateId: string): Promise<Estimate>;
    getByBuyerUserId(buyerUserId: string): Promise<Estimate[]>;
    listEstimatesBySellerOrganizationId(sellerOrganizationId: string): Promise<Estimate[]>;
    listEstimatesByBuyerOrganizationId(buyerOrganizationId: string): Promise<Estimate[]>;
    updateContract(updateContractId: string, data: UpdateContractInput): Promise<any>;
    createOrder(input: CreateOrderInput): Promise<Order>;
    confirmOrder(orderId: string): Promise<Order>;
    addLine(orderId: string, input: AddLineInput): Promise<Order>;
    updateLine(orderId: string, assetId: string, updateData: UpdateLineDataInput): Promise<Order>;
    deleteLine(orderId: string, assetId: string): Promise<Order>;
    markOrderPaid(orderId: string): Promise<Order>;
    markOrderDelivered(orderId: string): Promise<Order>;
    cancelOrder(orderId: string): Promise<Order>;
    listOrdersByUserId(userId: string): Promise<Order[]>;
    getOrderById(orderId: string): Promise<Order>;
    listOrders(): Promise<Order[]>;
    getTransactionById(transactionId: string): Promise<Transaction>;
    listTransactions(): Promise<Transaction[]>;
    listTransactionsByBuyerUserId(buyerUserId: string): Promise<Transaction[]>;
    listTransactionsByBuyerOrganizationId(buyerOrganizationId: string): Promise<Transaction[]>;
    listTransactionsBySellerOrganizationId(sellerOrganizationId: string): Promise<Transaction[]>;
    createTransaction(input: CreateTransactionInput): Promise<Transaction>;
    finalizeTransaction(transactionId: string, status: string): Promise<Transaction>;
    updateTransaction(transactionId: string, input: {
        status: string;
        totalAmount?: number;
        metadata?: string;
    }): Promise<Transaction>;
}
