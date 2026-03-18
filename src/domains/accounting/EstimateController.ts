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
}
