import { APIClient } from '../../api/APIClient.js';
import type { ContractResponse, CreateContractInput, UpdateContractInput, SignContractInput, SendContractInput, OrganizationContractTemplate, SaveContractAsTemplateInput, UpdateOrganizationContractTemplateInput, VerifyTokenResponse, ContractTemplateSummary, ContractTemplateDetail } from '../../types/accounting/index.js';
/**
 * The `Contract` class manages contract-related requests within the application.
 * Provides methods to create, retrieve, update, sign, and send contracts.
 */
export declare class Contract {
    private client;
    constructor(client: APIClient);
    /**
     * Creates a new contract
     */
    create(data: CreateContractInput): Promise<ContractResponse>;
    /**
     * Updates an existing contract
     */
    update(id: string, data: UpdateContractInput): Promise<ContractResponse>;
    /**
     * Signs a contract (client or provider)
     */
    sign(data: SignContractInput): Promise<ContractResponse>;
    /**
     * Sends a contract by email
     */
    send(data: SendContractInput): Promise<{
        success: boolean;
        message: string;
        invitationToken?: string;
        expiresAt?: string;
    }>;
    /**
     * Retrieves a contract by its ID
     */
    getById(contractId: string): Promise<ContractResponse>;
    /**
     * Contrat d'une invitation de signature (page publique de signature) :
     * accessible sans compte, avec le jeton exact et non expiré.
     */
    getByInvitationToken(token: string): Promise<ContractResponse>;
    /**
     * Contrats des organisations de l'appelant (identité requise).
     */
    list(): Promise<ContractResponse[]>;
    /**
     * Retrieves contracts by organization ID
     */
    listByOrganizationId(organizationId: string): Promise<ContractResponse[]>;
    /**
     * Vérifie la validité d'un token d'invitation
     */
    verifyToken(token: string): Promise<VerifyTokenResponse>;
    listOrganizationTemplates(organizationId: string): Promise<OrganizationContractTemplate[]>;
    getOrganizationTemplate(templateId: string): Promise<OrganizationContractTemplate>;
    saveAsTemplate(data: SaveContractAsTemplateInput): Promise<OrganizationContractTemplate>;
    updateOrganizationTemplate(templateId: string, data: UpdateOrganizationContractTemplateInput): Promise<OrganizationContractTemplate>;
    deleteOrganizationTemplate(templateId: string): Promise<boolean>;
    /**
     * Lists all available contract templates (lightweight summary)
     */
    listTemplates(): Promise<ContractTemplateSummary[]>;
    /**
     * Retrieves a full contract template by its ID (includes sections + variables)
     */
    getTemplate(templateId: string): Promise<ContractTemplateDetail>;
}
