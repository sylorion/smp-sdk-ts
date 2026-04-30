import { APIClient } from '../../api/APIClient.js';
import { contractQueries } from '../../api/graphql/accounting/queries.js';
import { contractMutations } from '../../api/graphql/accounting/mutations.js';
import {
  ContractStatus
} from '../../types/accounting/index.js';
import type {
  ContractResponse,
  CreateContractInput,
  UpdateContractInput,
  SignContractInput,
  SendContractInput,
  CreateContractResponse,
  UpdateContractResponse,
  SignContractResponse,
  SendContractResponse,
  GetContractResponse,
  GetContractsResponse,
  GetContractsByOrganizationIdResponse,
  VerifyTokenResponse,
  VerifyTokenGraphQLResponse,
  ContractTemplateSummary,
  ContractTemplateDetail,
  GetContractTemplatesResponse,
  GetContractTemplateResponse,
} from '../../types/accounting/index.js';

/**
 * The `Contract` class manages contract-related requests within the application.
 * Provides methods to create, retrieve, update, sign, and send contracts.
 */
export class Contract {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Creates a new contract
   */
  async create(data: CreateContractInput): Promise<ContractResponse> {
    const query = contractMutations.CREATE_CONTRACT;
    const response = await this.client.mutate<CreateContractResponse>(query, { data });
    return response.createContract;
  }

  /**
   * Updates an existing contract
   */
  async update(id: string, data: UpdateContractInput): Promise<ContractResponse> {
    const query = contractMutations.UPDATE_CONTRACT;
    const response = await this.client.mutate<UpdateContractResponse>(query, { id, data });
    return response.updateContract;
  }

  /**
   * Signs a contract (client or provider)
   */
  async sign(data: SignContractInput): Promise<ContractResponse> {
    const query = contractMutations.SIGN_CONTRACT;
    const response = await this.client.mutate<SignContractResponse>(query, { data });
    return response.signContract;
  }

  /**
   * Sends a contract by email
   */
  async send(data: SendContractInput): Promise<{ success: boolean; message: string; invitationToken?: string; expiresAt?: string }> {
    const query = contractMutations.SEND_CONTRACT;
    const response = await this.client.mutate<SendContractResponse>(query, { data });
    return response.sendContract;
  }

  /**
   * Retrieves a contract by its ID
   */
  async getById(contractId: string): Promise<ContractResponse> {
    const query = contractQueries.GET_CONTRACT_BY_ID;
    const response = await this.client.query<GetContractResponse>(query, { getContractId: contractId });
    return response.getContract;
  }

  /**
   * Retrieves all contracts.
   */
  async list(): Promise<ContractResponse[]> {
    const query = contractQueries.GET_ALL_CONTRACTS;
    const response = await this.client.query<GetContractsResponse>(query, {});
    return response.contracts;
  }

  /**
   * Retrieves contracts by organization ID
   */
  async listByOrganizationId(organizationId: string): Promise<ContractResponse[]> {
    const query = contractQueries.GET_CONTRACTS_BY_ORGANIZATION_ID;

    try {
      const response = await this.client.query<GetContractsByOrganizationIdResponse>(query, { organizationId });
      return response?.getContractsByOrganizationId || [];
    } catch (error) {
      console.error('Error in getByOrganizationId:', error);
      throw error;
    }
  }

  /**
   * Vérifie la validité d'un token d'invitation
   */
  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    const query = contractMutations.VERIFY_TOKEN;
    const response = await this.client.mutate<VerifyTokenGraphQLResponse>(query, {
      data: { token }
    });
    return response.verifyToken;
  }

  // ── Template Methods ────────────────────────────────────────────────

  /**
   * Lists all available contract templates (lightweight summary)
   */
  async listTemplates(): Promise<ContractTemplateSummary[]> {
    const query = contractQueries.GET_CONTRACT_TEMPLATES;
    const response = await this.client.query<GetContractTemplatesResponse>(query, {});
    return response.getContractTemplates;
  }

  /**
   * Retrieves a full contract template by its ID (includes sections + variables)
   */
  async getTemplate(templateId: string): Promise<ContractTemplateDetail> {
    const query = contractQueries.GET_CONTRACT_TEMPLATE;
    const response = await this.client.query<GetContractTemplateResponse>(query, { templateId });
    return response.getContractTemplate;
  }
} 