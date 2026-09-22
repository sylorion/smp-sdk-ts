import { paymentMutations } from '../api/graphql/mutations/accounting/paymentMutations.js';
import { orderQueries } from '../api/graphql/queries/accounting/orderQueries.js';
import { transactionQueries } from '../api/graphql/queries/accounting/transactionQueries.js';
import { transactionMutations } from '../api/graphql/mutations/accounting/transactionMutations.js';
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
    async ordersByUser(userId) {
        const query = orderQueries.ORDERS_BY_USER;
        const variables = { userId };
        const response = await this.client.query(query, variables);
        return response.ordersByUser;
    }
    async getOrder(orderId) {
        const query = orderQueries.ORDER;
        const variables = { orderId };
        const response = await this.client.query(query, variables);
        return response.order;
    }
    async getOrders() {
        const query = orderQueries.ORDERS;
        const response = await this.client.query(query, {});
        return response.orders;
    }
    /*---------------------- Transaction Queries ----------------------*/
    async getTransaction(transactionId) {
        const query = transactionQueries.GET_TRANSACTION_BY_ID;
        const variables = { input: { transactionId } };
        const response = await this.client.query(query, variables);
        return response.transaction;
    }
    async getTransactions() {
        const query = transactionQueries.GET_TRANSACTIONS;
        const response = await this.client.query(query, {});
        return response.transactions;
    }
    async getTransactionsByBuyerUserId(buyerUserId) {
        const query = transactionQueries.GET_TRANSACTIONS_BY_BUYER_USER_ID;
        const response = await this.client.query(query, { buyerUserId });
        return response.transactionsByBuyerUserId;
    }
    async getTransactionsByBuyerOrganizationId(buyerOrganizationId) {
        const query = transactionQueries.GET_TRANSACTIONS_BY_BUYER_ORGANIZATION_ID;
        const response = await this.client.query(query, { buyerOrganizationId });
        return response.transactionsByBuyerOrganizationId;
    }
    async getTransactionsBySellerOrganizationId(sellerOrganizationId) {
        const query = transactionQueries.GET_TRANSACTIONS_BY_SELLER_ORGANIZATION_ID;
        const response = await this.client.query(query, { sellerOrganizationId });
        return response.transactionsBySellerOrganizationId;
    }
    /*---------------------- Transaction Mutations ----------------------*/
    async initiateTransaction(input) {
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
