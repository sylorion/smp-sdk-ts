import { contractQueries } from '../api/graphql/queries/contract/contractQueries.js';
import { contractMutations } from '../api/graphql/mutations/contract/contractMutations.js';
/**
 * The `Contract` class manages contract-related requests within the application.
 * Provides methods to create, retrieve, update, sign, and send contracts.
 */
export class Contract {
    constructor(client) {
        this.client = client;
    }
    /**
     * Creates a new contract
     */
    async create(data) {
        const query = contractMutations.CREATE_CONTRACT;
        const response = await this.client.mutate(query, { data });
        return response.createContract;
    }
    /**
     * Updates an existing contract
     */
    async update(id, data) {
        const query = contractMutations.UPDATE_CONTRACT;
        const response = await this.client.mutate(query, { id, data });
        return response.updateContract;
    }
    /**
     * Signs a contract (client or provider)
     */
    async sign(data) {
        const query = contractMutations.SIGN_CONTRACT;
        const response = await this.client.mutate(query, { data });
        return response.signContract;
    }
    /**
     * Sends a contract by email
     */
    async send(data) {
        const query = contractMutations.SEND_CONTRACT;
        const response = await this.client.mutate(query, { data });
        return response.sendContract;
    }
    /**
     * Retrieves a contract by its ID
     */
    async getById(contractId) {
        const query = contractQueries.GET_CONTRACT_BY_ID;
        const response = await this.client.query(query, { getContractId: contractId });
        return response.getContract;
    }
    /**
     * Retrieves all contracts.
     */
    async list() {
        const query = contractQueries.GET_ALL_CONTRACTS;
        const response = await this.client.query(query, {});
        return response.contracts;
    }
    /**
     * Retrieves all contracts without filters.
     */
    async getAll() {
        const query = contractQueries.GET_ALL_CONTRACTS;
        const response = await this.client.query(query, {});
        return response.contracts;
    }
    /**
     * Retrieves contracts by organization ID
     */
    async getByOrganizationId(organizationId) {
        const query = contractQueries.GET_CONTRACTS_BY_ORGANIZATION_ID;
        try {
            const response = await this.client.query(query, { organizationId });
            return response?.getContractsByOrganizationId || [];
        }
        catch (error) {
            console.error('Error in getByOrganizationId:', error);
            throw error;
        }
    }
    /**
     * Vérifie la validité d'un token d'invitation
     */
    async verifyToken(token) {
        const query = contractMutations.VERIFY_TOKEN;
        const response = await this.client.mutate(query, {
            data: { token }
        });
        return response.verifyToken;
    }
}
