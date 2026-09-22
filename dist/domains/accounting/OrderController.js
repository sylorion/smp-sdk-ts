import { orderQueries } from '../../api/graphql/accounting/queries.js';
export class Order {
    constructor(client) {
        this.client = client;
    }
    /**
     * Retrieves an order by its ID
     */
    async getById(orderId) {
        const query = orderQueries.GET_ORDER_BY_ID;
        const response = await this.client.query(query, { orderId });
        return response.order;
    }
    /**
     * Retrieves orders by user ID
     */
    async listByUserId(userId) {
        const query = orderQueries.GET_ORDERS_BY_USER_ID;
        const response = await this.client.query(query, { userId });
        return response.ordersByUser;
    }
    /**
     * Retrieves orders by seller organization ID
     */
    async listBySellerOrganizationId(sellerOrganizationId) {
        const query = orderQueries.GET_ORDERS_BY_SELLER_ORGANIZATION_ID;
        const response = await this.client.query(query, { sellerOrganizationId });
        return response.ordersBySellerOrganization;
    }
    /**
     * Retrieves orders by buyer organization ID
     */
    async listByBuyerOrganizationId(buyerOrganizationId) {
        const query = orderQueries.GET_ORDERS_BY_BUYER_ORGANIZATION_ID;
        const response = await this.client.query(query, { buyerOrganizationId });
        return response.ordersByBuyerOrganization;
    }
}
