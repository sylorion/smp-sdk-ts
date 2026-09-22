import { APIClient } from '../api/APIClient.js';
interface OrderResponse {
    orderId: string;
    userId: string;
    sellerOrganizationId: string;
    buyerOrganizationId: string;
    transactionId: string;
    destinationWalletId: string;
    sourceWalletId: string;
    currency: string;
    estimateId: string;
    serviceId: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    unloggedUser: any;
    lines: {
        assetId: string;
        quantity: number;
        unitPrice: number;
        details: any;
        title: string;
        description: string;
        legalVatPercent: number;
    }[];
}
export declare class Order {
    private client;
    constructor(client: APIClient);
    /**
     * Retrieves an order by its ID
     */
    getById(orderId: string): Promise<OrderResponse>;
    /**
     * Retrieves orders by user ID
     */
    getByUserId(userId: string): Promise<OrderResponse[]>;
    /**
     * Retrieves orders by seller organization ID
     */
    getBySellerOrganizationId(sellerOrganizationId: string): Promise<OrderResponse[]>;
    /**
     * Retrieves orders by buyer organization ID
     */
    getByBuyerOrganizationId(buyerOrganizationId: string): Promise<OrderResponse[]>;
}
export {};
