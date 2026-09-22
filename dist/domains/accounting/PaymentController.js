import { paymentMutations } from '../../api/graphql/accounting/mutations.js';
import { orderQueries, estimateQueries, transactionQueries } from '../../api/graphql/accounting/queries.js';
import { transactionMutations } from '../../api/graphql/accounting/mutations.js';
/* -------------------------------------
   Classe SMPPayment (PaymentController)
------------------------------------- */
export class SMPPayment {
    constructor(client) {
        this.client = client;
    }
    /*---------------------- Paiement ----------------------*/
    async initiatePayment(input) {
        const mutation = paymentMutations.INITIATE_PAYMENT;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.initiatePayment;
    }
    async initiateServiceSubscriptionPayment(input) {
        const mutation = paymentMutations.INITIATE_SERVICE_SUBSCRIPTION_PAYMENT;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.initiateServiceSubscriptionPayment;
    }
    /*---------------------- Estimate ----------------------*/
    async createEstimate(input) {
        const mutation = paymentMutations.CREATE_ESTIMATE;
        const variables = { data: input };
        const response = await this.client.mutate(mutation, variables);
        return response.createEstimate;
    }
    async updateEstimate(updateEstimateId, data) {
        const mutation = paymentMutations.UPDATE_ESTIMATE;
        const variables = { updateEstimateId, data };
        const response = await this.client.mutate(mutation, variables);
        return response.updateEstimate;
    }
    async getById(estimateId) {
        const query = estimateQueries.GET_ESTIMATE_BY_ID;
        const variables = { estimateId };
        const response = await this.client.query(query, variables);
        return response.estimate;
    }
    async getByBuyerUserId(buyerUserId) {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_USER_ID;
        const variables = { buyerUserId };
        const response = await this.client.query(query, variables);
        return response.estimatesByBuyerUserId;
    }
    async listEstimatesBySellerOrganizationId(sellerOrganizationId) {
        const query = estimateQueries.GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID;
        const variables = { sellerOrganizationId };
        const response = await this.client.query(query, variables);
        return response.estimatesBySellerOrganizationId;
    }
    async listEstimatesByBuyerOrganizationId(buyerOrganizationId) {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID;
        const variables = { buyerOrganizationId };
        const response = await this.client.query(query, variables);
        return response.estimatesByBuyerOrganizationId;
    }
    /*---------------------- Contrat ----------------------*/
    async updateContract(updateContractId, data) {
        const mutation = paymentMutations.UPDATE_CONTRACT;
        const variables = { updateContractId, data };
        const response = await this.client.mutate(mutation, variables);
        return response.updateContract;
    }
    /*---------------------- Orders ----------------------*/
    async createOrder(input) {
        const mutation = paymentMutations.CREATE_ORDER;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createOrder;
    }
    async confirmOrder(orderId) {
        const mutation = paymentMutations.CONFIRM_ORDER;
        const variables = { orderId };
        const response = await this.client.mutate(mutation, variables);
        return response.confirmOrder;
    }
    async addLine(orderId, input) {
        const mutation = paymentMutations.ADD_LINE;
        const variables = { orderId, input };
        const response = await this.client.mutate(mutation, variables);
        return response.addLine;
    }
    async updateLine(orderId, assetId, updateData) {
        const mutation = paymentMutations.UPDATE_LINE;
        const variables = { orderId, assetId, updateData };
        const response = await this.client.mutate(mutation, variables);
        return response.updateLine;
    }
    async deleteLine(orderId, assetId) {
        const mutation = paymentMutations.DELETE_LINE;
        const variables = { input: { orderId, assetId } };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteLine;
    }
    async markOrderPaid(orderId) {
        const mutation = paymentMutations.MARK_ORDER_PAID;
        const variables = { orderId };
        const response = await this.client.mutate(mutation, variables);
        return response.markOrderPaid;
    }
    async markOrderDelivered(orderId) {
        const mutation = paymentMutations.MARK_ORDER_DELIVERED;
        const variables = { orderId };
        const response = await this.client.mutate(mutation, variables);
        return response.markOrderDelivered;
    }
    async cancelOrder(orderId) {
        const mutation = paymentMutations.CANCEL_ORDER;
        const variables = { orderId };
        const response = await this.client.mutate(mutation, variables);
        return response.cancelOrder;
    }
    /*---------------------- Orders Queries ----------------------*/
    async listOrdersByUserId(userId) {
        const query = orderQueries.GET_ORDERS_BY_USER_ID;
        const variables = { userId };
        const response = await this.client.query(query, variables);
        return response.ordersByUser;
    }
    async getOrderById(orderId) {
        const query = orderQueries.GET_ORDER_BY_ID;
        const variables = { orderId };
        const response = await this.client.query(query, variables);
        return response.order;
    }
    async listOrders() {
        const query = orderQueries.GET_ORDERS_BY_USER_ID;
        const response = await this.client.query(query, {});
        return response.orders;
    }
    /*---------------------- Transaction Queries ----------------------*/
    async getTransactionById(transactionId) {
        const query = transactionQueries.GET_TRANSACTION_BY_ID;
        const variables = { input: { transactionId } };
        const response = await this.client.query(query, variables);
        return response.transaction;
    }
    async listTransactions() {
        const query = transactionQueries.GET_TRANSACTIONS;
        const response = await this.client.query(query, {});
        return response.transactions;
    }
    async listTransactionsByBuyerUserId(buyerUserId) {
        const query = transactionQueries.GET_TRANSACTIONS_BY_BUYER_USER_ID;
        const response = await this.client.query(query, { buyerUserId });
        return response.transactionsByBuyerUserId;
    }
    async listTransactionsByBuyerOrganizationId(buyerOrganizationId) {
        const query = transactionQueries.GET_TRANSACTIONS_BY_BUYER_ORGANIZATION_ID;
        const response = await this.client.query(query, { buyerOrganizationId });
        return response.transactionsByBuyerOrganizationId;
    }
    async listTransactionsBySellerOrganizationId(sellerOrganizationId) {
        const query = transactionQueries.GET_TRANSACTIONS_BY_SELLER_ORGANIZATION_ID;
        const response = await this.client.query(query, { sellerOrganizationId });
        return response.transactionsBySellerOrganizationId;
    }
    /*---------------------- Transaction Mutations ----------------------*/
    async createTransaction(input) {
        const mutation = transactionMutations.CREATE_TRANSACTION;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.initiateTransaction;
    }
    async finalizeTransaction(transactionId, status) {
        const mutation = transactionMutations.UPDATE_TRANSACTION;
        const variables = { transactionId, input: { status } };
        const response = await this.client.mutate(mutation, variables);
        return response.updateTransaction;
    }
    async updateTransaction(transactionId, input) {
        const mutation = transactionMutations.UPDATE_TRANSACTION;
        const variables = { transactionId, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateTransaction;
    }
}
