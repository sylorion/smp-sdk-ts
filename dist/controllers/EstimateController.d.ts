import { APIClient } from '../api/APIClient.js';
import type { Negotiation, CreateNegotiationInput, NegotiationResponse, NegotiationStatus } from '../types/Estimate.js';
interface EstimateResponse {
    estimateId: string;
    serviceId: string;
    proposalPrice?: number;
    details: any;
    status: string;
    negotiationCount: number;
    negotiationStatus?: NegotiationStatus;
    currentNegotiationId?: string;
    clientSignDate?: string;
    providerSignDate?: string;
    createdAt: string;
    updatedAt?: string;
    buyerUserId?: string;
    buyerOrganizationId?: string;
    sellerOrganizationId?: string;
}
/**
 * The `Estimate` class manages estimate-related requests within the application.
 * Provides methods to retrieve, list, and search estimates.
 */
export declare class Estimate {
    private client;
    constructor(client: APIClient);
    /**
     * Creates a new estimate
     */
    create(data: {
        serviceId: string;
        proposalPrice?: number;
        buyerUserId?: string;
        buyerOrganizationId?: string;
        negotiationCount?: number;
        details?: any;
    }): Promise<EstimateResponse>;
    /**
     * Updates an existing estimate
     */
    update(id: string, data: {
        proposalPrice?: number;
        details?: any;
    }): Promise<EstimateResponse>;
    /**
     * Validates an estimate
     */
    validate(data: {
        estimateId: string;
        role: string;
        details?: any;
    }): Promise<EstimateResponse>;
    /**
     * Retrieves an estimate by its ID
     */
    getById(estimateId: string): Promise<EstimateResponse>;
    /**
     * Retrieves a list of estimates with optional pagination, sorting, and filters.
     */
    list(pagination?: any, sort?: any, filter?: any): Promise<any[]>;
    /**
     * Fetches multiple estimates by an array of estimate IDs.
     */
    getByIDs(estimateIDs: string[]): Promise<any[]>;
    /**
     * Fetches an estimate by its unique reference (`uniqRef`).
     */
    getByUniqRef(uniqRef: string): Promise<any>;
    /**
     * Fetches an estimate by its slug.
     */
    getBySlug(slug: string): Promise<any>;
    /**
     * Fetches multiple estimates by their slugs.
     */
    getBySlugs(slugs: string[]): Promise<any[]>;
    /**
     * Retrieves estimates by buyer user ID
     */
    getByBuyerUserId(buyerUserId: string): Promise<EstimateResponse[]>;
    /**
     * Retrieves estimates by buyer organization ID
     */
    getByBuyerOrganizationId(buyerOrganizationId: string): Promise<EstimateResponse[]>;
    /**
     * Retrieves estimates by seller organization ID
     */
    getBySellerOrganizationId(sellerOrganizationId: string): Promise<EstimateResponse[]>;
    /**
     * Creates a new negotiation for an estimate
     */
    createNegotiation(input: CreateNegotiationInput): Promise<NegotiationResponse>;
    /**
     * Accepts the current negotiation for an estimate
     */
    acceptNegotiation(estimateId: string): Promise<EstimateResponse>;
    /**
     * Rejects the current negotiation for an estimate
     */
    rejectNegotiation(estimateId: string): Promise<EstimateResponse>;
    /**
     * Retrieves the negotiation history for an estimate
     */
    getNegotiationHistory(estimateId: string): Promise<Negotiation[]>;
    /**
     * Retrieves the current active negotiation for an estimate
     */
    getCurrentNegotiation(estimateId: string): Promise<Negotiation | null>;
}
export {};
