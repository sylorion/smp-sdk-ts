import { APIClient } from '../../api/APIClient.js';
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
/** Réalisation d'un service par un agent : `none` si aucun agent n'est rattaché à la commande. */
export interface AgentExecutionStatus {
    orderId: string;
    engagementId?: string | null;
    executionId?: string | null;
    agentId?: string | null;
    status: 'none' | 'pending' | 'running' | 'completed' | 'failed' | string;
    error?: string | null;
    attempts?: number | null;
    startedAt?: string | null;
    completedAt?: string | null;
    result?: unknown;
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
    listByUserId(userId: string): Promise<OrderResponse[]>;
    /**
     * Retrieves orders by seller organization ID
     */
    listBySellerOrganizationId(sellerOrganizationId: string): Promise<OrderResponse[]>;
    /**
     * Retrieves orders by buyer organization ID
     */
    listByBuyerOrganizationId(buyerOrganizationId: string): Promise<OrderResponse[]>;
    /** Suivi de l'exécution par un agent pour la commande donnée. */
    getAgentExecutionStatus(orderId: string): Promise<AgentExecutionStatus>;
}
export {};
