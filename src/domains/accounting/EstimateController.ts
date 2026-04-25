import { APIClient } from '../../api/APIClient.js';
import { paymentMutations } from '../../api/graphql/accounting/mutations.js';
import { estimateQueries } from '../../api/graphql/accounting/queries.js';
import { CreateEstimateInput, UpdateEstimateInput, Estimate as EstimateEntity } from './PaymentController.js';

export class Estimate {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    async create(input: CreateEstimateInput): Promise<EstimateEntity> {
        const mutation = paymentMutations.CREATE_ESTIMATE;
        const variables = { data: input };
        const response = await this.client.mutate(mutation, variables) as { createEstimate: EstimateEntity };
        return response.createEstimate;
    }

    async update(updateEstimateId: string, data: UpdateEstimateInput): Promise<EstimateEntity> {
        const mutation = paymentMutations.UPDATE_ESTIMATE;
        const variables = { updateEstimateId, data };
        const response = await this.client.mutate(mutation, variables) as { updateEstimate: EstimateEntity };
        return response.updateEstimate;
    }

    async getById(estimateId: string): Promise<EstimateEntity> {
        const query = estimateQueries.GET_ESTIMATE_BY_ID;
        const variables = { estimateId };
        const response = await this.client.query(query, variables) as { estimate: EstimateEntity };
        return response.estimate;
    }

    async listByBuyerUserId(buyerUserId: string): Promise<EstimateEntity[]> {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_USER_ID;
        const variables = { buyerUserId };
        const response = await this.client.query(query, variables) as { estimatesByBuyerUserId: EstimateEntity[] };
        return response.estimatesByBuyerUserId;
    }

    async listBySellerOrganizationId(sellerOrganizationId: string): Promise<EstimateEntity[]> {
        const query = estimateQueries.GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID;
        const variables = { sellerOrganizationId };
        const response = await this.client.query(query, variables) as { estimatesBySellerOrganizationId: EstimateEntity[] };
        return response.estimatesBySellerOrganizationId;
    }

    async listByBuyerOrganizationId(buyerOrganizationId: string): Promise<EstimateEntity[]> {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID;
        const variables = { buyerOrganizationId };
        const response = await this.client.query(query, variables) as { estimatesByBuyerOrganizationId: EstimateEntity[] };
        return response.estimatesByBuyerOrganizationId;
    }

    /**
     * Envoie le devis au client et génère un token de consultation.
     * Déclenche les notifications async via RabbitMQ → mu-notification.
     */
    async send(estimateId: string): Promise<EstimateEntity> {
        const mutation = paymentMutations.SEND_ESTIMATE;
        const variables = { id: estimateId };
        const response = await this.client.mutate(mutation, variables) as { sendEstimate: EstimateEntity };
        return response.sendEstimate;
    }

    /**
     * Liste tous les estimates (utilisé pour la résolution de viewToken).
     */
    async listAll(): Promise<EstimateEntity[]> {
        const query = estimateQueries.GET_ALL_MU_CONTRACT_ESTIMATES;
        const response = await this.client.query(query, {}) as { estimates: EstimateEntity[] };
        return response.estimates ?? [];
    }

    /**
     * Émet les notifications de proposition de négociation via RabbitMQ (async pipeline).
     */
    async emitNegotiationProposal(estimateId: string, proposedBy: string, proposedPrice?: number | null, comment?: string | null): Promise<EstimateEntity> {
        const mutation = paymentMutations.EMIT_NEGOTIATION_PROPOSAL;
        const variables = { estimateId, proposedBy, proposedPrice: proposedPrice ?? null, comment: comment ?? null };
        const response = await this.client.mutate(mutation, variables) as { emitNegotiationProposal: EstimateEntity };
        return response.emitNegotiationProposal;
    }

    /**
     * Émet les notifications d'acceptation d'un devis via RabbitMQ (async pipeline).
     */
    async emitEstimateAccepted(estimateId: string): Promise<EstimateEntity> {
        const mutation = paymentMutations.EMIT_ESTIMATE_ACCEPTED;
        const variables = { estimateId };
        const response = await this.client.mutate(mutation, variables) as { emitEstimateAccepted: EstimateEntity };
        return response.emitEstimateAccepted;
    }
}
