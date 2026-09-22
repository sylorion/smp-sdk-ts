import { APIClient } from '../api/APIClient.js';
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
    unloggedUser?: string;
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
    unloggedUser?: any;
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
    createEstimate(input: CreateEstimateInput): Promise<Estimate>;
    updateEstimate(updateEstimateId: string, data: UpdateEstimateInput): Promise<Estimate>;
    updateContract(updateContractId: string, data: UpdateContractInput): Promise<any>;
    createOrder(input: CreateOrderInput): Promise<Order>;
    confirmOrder(orderId: string): Promise<Order>;
    addLine(orderId: string, input: AddLineInput): Promise<Order>;
    updateLine(orderId: string, assetId: string, updateData: UpdateLineDataInput): Promise<Order>;
    deleteLine(orderId: string, assetId: string): Promise<Order>;
    markOrderPaid(orderId: string): Promise<Order>;
    markOrderDelivered(orderId: string): Promise<Order>;
    cancelOrder(orderId: string): Promise<Order>;
    ordersByUser(userId: string): Promise<Order[]>;
    getOrder(orderId: string): Promise<Order>;
    getOrders(): Promise<Order[]>;
    getTransaction(transactionId: string): Promise<Transaction>;
    getTransactions(): Promise<Transaction[]>;
    getTransactionsByBuyerUserId(buyerUserId: string): Promise<Transaction[]>;
    getTransactionsByBuyerOrganizationId(buyerOrganizationId: string): Promise<Transaction[]>;
    getTransactionsBySellerOrganizationId(sellerOrganizationId: string): Promise<Transaction[]>;
    initiateTransaction(input: CreateTransactionInput): Promise<Transaction>;
    finalizeTransaction(transactionId: string, status: string): Promise<Transaction>;
    updateTransaction(transactionId: string, input: {
        status: string;
        totalAmount?: number;
        metadata?: string;
    }): Promise<Transaction>;
}
