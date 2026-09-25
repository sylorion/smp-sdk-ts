import { logger } from '../../utils/Logger.js';
import { contractQueries } from '../../api/graphql/accounting/queries.js';
import { contractMutations } from '../../api/graphql/accounting/mutations.js';
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
     * Contrat d'une invitation de signature (page publique de signature) :
     * accessible sans compte, avec le jeton exact et non expiré.
     */
    async getByInvitationToken(token) {
        const query = contractQueries.GET_CONTRACT_BY_INVITATION_TOKEN;
        const response = await this.client.query(query, { token });
        return response.getContractByInvitationToken;
    }
    /**
     * Contrats des organisations de l'appelant (identité requise).
     */
    async list() {
        const query = contractQueries.GET_ALL_CONTRACTS;
        const response = await this.client.query(query, {});
        return response.contracts;
    }
    /**
     * Retrieves contracts by organization ID
     */
    async listByOrganizationId(organizationId) {
        const query = contractQueries.GET_CONTRACTS_BY_ORGANIZATION_ID;
        try {
            const response = await this.client.query(query, { organizationId });
            return response?.getContractsByOrganizationId || [];
        }
        catch (error) {
            logger.error('Error in getByOrganizationId:', error);
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
    // ── Modèles de l'organisation (contrats réutilisables) ──────────────
    async listOrganizationTemplates(organizationId) {
        const r = await this.client.query(contractQueries.GET_ORGANIZATION_CONTRACT_TEMPLATES, { organizationId });
        return r.organizationContractTemplates ?? [];
    }
    async getOrganizationTemplate(templateId) {
        const r = await this.client.query(contractQueries.GET_ORGANIZATION_CONTRACT_TEMPLATE, { templateId });
        return r.organizationContractTemplate;
    }
    async saveAsTemplate(data) {
        const r = await this.client.mutate(contractMutations.SAVE_CONTRACT_AS_TEMPLATE, { data });
        return r.saveContractAsTemplate;
    }
    async updateOrganizationTemplate(templateId, data) {
        const r = await this.client.mutate(contractMutations.UPDATE_ORGANIZATION_CONTRACT_TEMPLATE, { templateId, data });
        return r.updateOrganizationContractTemplate;
    }
    async deleteOrganizationTemplate(templateId) {
        const r = await this.client.mutate(contractMutations.DELETE_ORGANIZATION_CONTRACT_TEMPLATE, { templateId });
        return !!r.deleteOrganizationContractTemplate;
    }
    // ── Template Methods ────────────────────────────────────────────────
    /**
     * Lists all available contract templates (lightweight summary)
     */
    async listTemplates() {
        const query = contractQueries.GET_CONTRACT_TEMPLATES;
        const response = await this.client.query(query, {});
        return response.getContractTemplates;
    }
    /**
     * Retrieves a full contract template by its ID (includes sections + variables)
     */
    async getTemplate(templateId) {
        const query = contractQueries.GET_CONTRACT_TEMPLATE;
        const response = await this.client.query(query, { templateId });
        return response.getContractTemplate;
    }
}
