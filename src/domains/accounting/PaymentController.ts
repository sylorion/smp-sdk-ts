// src/api/paymentController.ts
import { APIClient } from '../../api/APIClient.js';
import { paymentMutations } from '../../api/graphql/accounting/mutations.js';
import { orderQueries, estimateQueries, transactionQueries } from '../../api/graphql/accounting/queries.js';
import { transactionMutations } from '../../api/graphql/accounting/mutations.js';
import { BillingInformation } from '../../types/accounting/billing.js';
/* -------------------------------------
   Interfaces d'Input et Types de Retour
------------------------------------- */

// Inputs liés au paiement
export interface CreatePaymentDto {
  transactionId?: string;
  orderId: string;
  type: string;
  amount: number;
  currency: string;
}

// Inputs liés aux orders
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
  orderAssetId: string; // tel que défini dans le schéma (ID!)
  assetId: string;
  quantity: number;
  unitPrice: number;
  title: string;
  description: string;
  legalVatPercent: number;
  details: any; // JSON
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

// Inputs liés aux estimates
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
  details?: any; // JSONObject
}

// Inputs liés aux contrats
export interface UpdateContractInput {
  status?: string;
  additionalData?: any; // JSONObject
}

// Types de retour (basés sur vos schémas GraphQL)
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
  // details: any;
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

  // deletedAt?: string;
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
/* -------------------------------------
   Classe SMPPayment (PaymentController)
------------------------------------- */
export class SMPPayment {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /*---------------------- Paiement ----------------------*/
  async initiatePayment(input: CreatePaymentDto): Promise<CardPaymentResponse> {
    const mutation = paymentMutations.INITIATE_PAYMENT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { initiatePayment: CardPaymentResponse };
    return response.initiatePayment;
  }

  /*---------------------- Estimate ----------------------*/
  async createEstimate(input: CreateEstimateInput): Promise<Estimate> {
    const mutation = paymentMutations.CREATE_ESTIMATE;
    const variables = { data: input };
    const response = await this.client.mutate(mutation, variables) as { createEstimate: Estimate };
    return response.createEstimate;
  }

  async updateEstimate(updateEstimateId: string, data: UpdateEstimateInput): Promise<Estimate> {
    const mutation = paymentMutations.UPDATE_ESTIMATE;
    const variables = { updateEstimateId, data };
    const response = await this.client.mutate(mutation, variables) as { updateEstimate: Estimate };
    return response.updateEstimate;
  }

  async getById(estimateId: string): Promise<Estimate> {
    const query = estimateQueries.GET_ESTIMATE_BY_ID;
    const variables = { estimateId };
    const response = await this.client.query(query, variables) as { estimate: Estimate };
    return response.estimate;
  }

  async getByBuyerUserId(buyerUserId: string): Promise<Estimate[]> {
    const query = estimateQueries.GET_ESTIMATES_BY_BUYER_USER_ID;
    const variables = { buyerUserId };
    const response = await this.client.query(query, variables) as { estimatesByBuyerUserId: Estimate[] };
    return response.estimatesByBuyerUserId;
  }

  async listEstimatesBySellerOrganizationId(sellerOrganizationId: string): Promise<Estimate[]> {
    const query = estimateQueries.GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID;
    const variables = { sellerOrganizationId };
    const response = await this.client.query(query, variables) as { estimatesBySellerOrganizationId: Estimate[] };
    return response.estimatesBySellerOrganizationId;
  }

  async listEstimatesByBuyerOrganizationId(buyerOrganizationId: string): Promise<Estimate[]> {
    const query = estimateQueries.GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID;
    const variables = { buyerOrganizationId };
    const response = await this.client.query(query, variables) as { estimatesByBuyerOrganizationId: Estimate[] };
    return response.estimatesByBuyerOrganizationId;
  }

  /*---------------------- Contrat ----------------------*/
  async updateContract(updateContractId: string, data: UpdateContractInput): Promise<any> {
    const mutation = paymentMutations.UPDATE_CONTRACT;
    const variables = { updateContractId, data };
    const response = await this.client.mutate(mutation, variables) as { updateContract: any };
    return response.updateContract;
  }

  /*---------------------- Orders ----------------------*/
  async createOrder(input: CreateOrderInput): Promise<Order> {
    const mutation = paymentMutations.CREATE_ORDER;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createOrder: Order };
    return response.createOrder;
  }

  async confirmOrder(orderId: string): Promise<Order> {
    const mutation = paymentMutations.CONFIRM_ORDER;
    const variables = { orderId };
    const response = await this.client.mutate(mutation, variables) as { confirmOrder: Order };
    return response.confirmOrder;
  }

  async addLine(orderId: string, input: AddLineInput): Promise<Order> {
    const mutation = paymentMutations.ADD_LINE;
    const variables = { orderId, input };
    const response = await this.client.mutate(mutation, variables) as { addLine: Order };
    return response.addLine;
  }

  async updateLine(orderId: string, assetId: string, updateData: UpdateLineDataInput): Promise<Order> {
    const mutation = paymentMutations.UPDATE_LINE;
    const variables = { orderId, assetId, updateData };
    const response = await this.client.mutate(mutation, variables) as { updateLine: Order };
    return response.updateLine;
  }

  async deleteLine(orderId: string, assetId: string): Promise<Order> {
    const mutation = paymentMutations.DELETE_LINE;
    const variables = { input: { orderId, assetId } };
    const response = await this.client.mutate(mutation, variables) as { deleteLine: Order };
    return response.deleteLine;
  }

  async markOrderPaid(orderId: string): Promise<Order> {
    const mutation = paymentMutations.MARK_ORDER_PAID;
    const variables = { orderId };
    const response = await this.client.mutate(mutation, variables) as { markOrderPaid: Order };
    return response.markOrderPaid;
  }

  async markOrderDelivered(orderId: string): Promise<Order> {
    const mutation = paymentMutations.MARK_ORDER_DELIVERED;
    const variables = { orderId };
    const response = await this.client.mutate(mutation, variables) as { markOrderDelivered: Order };
    return response.markOrderDelivered;
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const mutation = paymentMutations.CANCEL_ORDER;
    const variables = { orderId };
    const response = await this.client.mutate(mutation, variables) as { cancelOrder: Order };
    return response.cancelOrder;
  }

  /*---------------------- Orders Queries ----------------------*/
  async listOrdersByUserId(userId: string): Promise<Order[]> {
    const query = orderQueries.GET_ORDERS_BY_USER_ID;
    const variables = { userId };
    const response = await this.client.query(query, variables) as { ordersByUser: Order[] };
    return response.ordersByUser;
  }

  async getOrderById(orderId: string): Promise<Order> {
    const query = orderQueries.GET_ORDER_BY_ID;
    const variables = { orderId };
    const response = await this.client.query(query, variables) as { order: Order };
    return response.order;
  }

  async listOrders(): Promise<Order[]> {
    const query = orderQueries.GET_ORDERS_BY_USER_ID;
    const response = await this.client.query(query, {}) as { orders: Order[] };
    return response.orders;
  }

  /*---------------------- Transaction Queries ----------------------*/
  async getTransactionById(transactionId: string): Promise<Transaction> {
    const query = transactionQueries.GET_TRANSACTION_BY_ID;
    const variables = { input: { transactionId } };
    const response = await this.client.query(query, variables) as { transaction: Transaction };
    return response.transaction;
  }

  async listTransactions(): Promise<Transaction[]> {
    const query = transactionQueries.GET_TRANSACTIONS;
    const response = await this.client.query(query, {}) as { transactions: Transaction[] };
    return response.transactions;
  }

  async listTransactionsByBuyerUserId(buyerUserId: string): Promise<Transaction[]> {
    const query = transactionQueries.GET_TRANSACTIONS_BY_BUYER_USER_ID;
    const response = await this.client.query(query, { buyerUserId }) as { transactionsByBuyerUserId: Transaction[] };
    return response.transactionsByBuyerUserId;
  }

  async listTransactionsByBuyerOrganizationId(buyerOrganizationId: string): Promise<Transaction[]> {
    const query = transactionQueries.GET_TRANSACTIONS_BY_BUYER_ORGANIZATION_ID;
    const response = await this.client.query(query, { buyerOrganizationId }) as { transactionsByBuyerOrganizationId: Transaction[] };
    return response.transactionsByBuyerOrganizationId;
  }

  async listTransactionsBySellerOrganizationId(sellerOrganizationId: string): Promise<Transaction[]> {
    const query = transactionQueries.GET_TRANSACTIONS_BY_SELLER_ORGANIZATION_ID;
    const response = await this.client.query(query, { sellerOrganizationId }) as { transactionsBySellerOrganizationId: Transaction[] };
    return response.transactionsBySellerOrganizationId;
  }

  /*---------------------- Transaction Mutations ----------------------*/
  async createTransaction(input: CreateTransactionInput): Promise<Transaction> {
    const mutation = transactionMutations.CREATE_TRANSACTION;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { initiateTransaction: Transaction };
    return response.initiateTransaction;
  }

  async finalizeTransaction(transactionId: string, status: string): Promise<Transaction> {
    const mutation = transactionMutations.UPDATE_TRANSACTION;
    const variables = { transactionId, input: { status } };
    const response = await this.client.mutate(mutation, variables) as { updateTransaction: Transaction };
    return response.updateTransaction;
  }

  async updateTransaction(transactionId: string, input: { status: string; totalAmount?: number; metadata?: string }): Promise<Transaction> {
    const mutation = transactionMutations.UPDATE_TRANSACTION;
    const variables = { transactionId, input };
    const response = await this.client.mutate(mutation, variables) as { updateTransaction: Transaction };
    return response.updateTransaction;
  }
}

