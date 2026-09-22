import { paymentMutations } from '../../api/graphql/accounting/mutations.js';
import { estimateQueries } from '../../api/graphql/accounting/queries.js';
export class Estimate {
    constructor(client) {
        this.client = client;
    }
    async create(input) {
        const mutation = paymentMutations.CREATE_ESTIMATE;
        const variables = { data: input };
        const response = await this.client.mutate(mutation, variables);
        return response.createEstimate;
    }
    async update(updateEstimateId, data) {
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
    async listByBuyerUserId(buyerUserId) {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_USER_ID;
        const variables = { buyerUserId };
        const response = await this.client.query(query, variables);
        return response.estimatesByBuyerUserId;
    }
    async listBySellerOrganizationId(sellerOrganizationId) {
        const query = estimateQueries.GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID;
        const variables = { sellerOrganizationId };
        const response = await this.client.query(query, variables);
        return response.estimatesBySellerOrganizationId;
    }
    async listByBuyerOrganizationId(buyerOrganizationId) {
        const query = estimateQueries.GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID;
        const variables = { buyerOrganizationId };
        const response = await this.client.query(query, variables);
        return response.estimatesByBuyerOrganizationId;
    }
    /**
     * Envoie le devis au client et génère un token de consultation.
     * Déclenche les notifications async via RabbitMQ → mu-notification.
     */
    async send(estimateId) {
        const mutation = paymentMutations.SEND_ESTIMATE;
        const variables = { id: estimateId };
        const response = await this.client.mutate(mutation, variables);
        return response.sendEstimate;
    }
    /**
     * Liste tous les estimates (utilisé pour la résolution de viewToken).
     */
    async listAll() {
        const query = estimateQueries.GET_ALL_MU_CONTRACT_ESTIMATES;
        const response = await this.client.query(query, {});
        return response.estimates ?? [];
    }
    /**
     * Émet les notifications de proposition de négociation via RabbitMQ (async pipeline).
     */
    async emitNegotiationProposal(estimateId, proposedBy, proposedPrice, comment) {
        const mutation = paymentMutations.EMIT_NEGOTIATION_PROPOSAL;
        const variables = { estimateId, proposedBy, proposedPrice: proposedPrice ?? null, comment: comment ?? null };
        const response = await this.client.mutate(mutation, variables);
        return response.emitNegotiationProposal;
    }
    /**
     * Émet les notifications d'acceptation d'un devis via RabbitMQ (async pipeline).
     */
    async emitEstimateAccepted(estimateId) {
        const mutation = paymentMutations.EMIT_ESTIMATE_ACCEPTED;
        const variables = { estimateId };
        const response = await this.client.mutate(mutation, variables);
        return response.emitEstimateAccepted;
    }
    /**
     * Émet les notifications de soumission d'un devis (pipeline PRESTATION).
     * À appeler quand l'estimate était un draft et est finalisé à l'étape COMMENTS.
     */
    async emitEstimateSubmitted(estimateId) {
        const mutation = paymentMutations.EMIT_ESTIMATE_SUBMITTED;
        const variables = { estimateId };
        const response = await this.client.mutate(mutation, variables);
        return response.emitEstimateSubmitted;
    }
}
