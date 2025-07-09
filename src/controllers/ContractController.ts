import { APIClient } from '../api/APIClient';
import { contractQueries } from '../api/graphql/queries/contract/contractQueries';
import { contractMutations } from '../api/graphql/mutations/contract/contractMutations';
import { 
  ContractStatus,
  SignerRole,
  SignatureType
} from '../types/Contract';
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
  GetContractsResponse
} from '../types/Contract';

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
  async send(data: SendContractInput): Promise<{ success: boolean; message: string }> {
    const query = contractMutations.SEND_CONTRACT;
    const response = await this.client.mutate<SendContractResponse>(query, { data });
    return response.sendContract;
  }

  /**
   * Retrieves a contract by its ID
   */
  async getById(contractId: string): Promise<ContractResponse> {
    const query = contractQueries.GET_CONTRACT_BY_ID;
    const response = await this.client.query<GetContractResponse>(query, { id: contractId });
    return response.contract;
  }

  /**
   * Retrieves a list of contracts with optional pagination, sorting, and filters.
   */
  async list(pagination?: any, sort?: any, filter?: any): Promise<ContractResponse[]> {
    const query = contractQueries.GET_CONTRACTS;
    const variables = { pagination, sort, filter };
    const response = await this.client.query<GetContractsResponse>(query, variables);
    return response.contracts;
  }

  /**
   * Retrieves contracts by service ID
   */
  async getByServiceId(serviceId: string): Promise<ContractResponse[]> {
    const query = contractQueries.GET_CONTRACTS_BY_SERVICE_ID;
    const response = await this.client.query<GetContractsResponse>(query, { serviceId });
    return response.contracts;
  }

  /**
   * Retrieves contracts by estimate ID
   */
  async getByEstimateId(estimateId: string): Promise<ContractResponse[]> {
    const query = contractQueries.GET_CONTRACTS_BY_ESTIMATE_ID;
    const response = await this.client.query<GetContractsResponse>(query, { estimateId });
    return response.contracts;
  }

  /**
   * Retrieves contracts by status
   */
  async getByStatus(status: ContractStatus): Promise<ContractResponse[]> {
    const query = contractQueries.GET_CONTRACTS_BY_STATUS;
    const response = await this.client.query<GetContractsResponse>(query, { status });
    return response.contracts;
  }

  /**
   * Signs a contract as a client
   */
  async signAsClient(contractId: string, options?: {
    signatureHash?: string;
    signatureImage?: string;
    signatureFileUrl?: string;
    signerEmail?: string;
    metadata?: {
      ip?: string;
      userAgent?: string;
      timestamp?: string;
      location?: string;
    };
  }): Promise<ContractResponse> {
    const data: SignContractInput = {
      contractId,
      role: SignerRole.CLIENT,
      signatureType: options?.signatureImage ? SignatureType.IMAGE : 
                    options?.signatureFileUrl ? SignatureType.UPLOAD : 
                    SignatureType.HASH,
      signatureHash: options?.signatureHash,
      signatureImage: options?.signatureImage,
      signatureFileUrl: options?.signatureFileUrl,
      signerEmail: options?.signerEmail,
      metadata: options?.metadata
    };
    return this.sign(data);
  }

  /**
   * Signs a contract as a provider
   */
  async signAsProvider(contractId: string, options?: {
    signatureHash?: string;
    signatureImage?: string;
    signatureFileUrl?: string;
    signerEmail?: string;
    metadata?: {
      ip?: string;
      userAgent?: string;
      timestamp?: string;
      location?: string;
    };
  }): Promise<ContractResponse> {
    const data: SignContractInput = {
      contractId,
      role: SignerRole.PROVIDER,
      signatureType: options?.signatureImage ? SignatureType.IMAGE : 
                    options?.signatureFileUrl ? SignatureType.UPLOAD : 
                    SignatureType.HASH,
      signatureHash: options?.signatureHash,
      signatureImage: options?.signatureImage,
      signatureFileUrl: options?.signatureFileUrl,
      signerEmail: options?.signerEmail,
      metadata: options?.metadata
    };
    return this.sign(data);
  }

  /**
   * Sends a contract to a client for signature
   */
  async sendToClient(contractId: string, email: string, options?: {
    message?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ success: boolean; message: string }> {
    const data: SendContractInput = {
      contractId,
      email,
      role: 'client',
      message: options?.message,
      firstName: options?.firstName,
      lastName: options?.lastName
    };
    return this.send(data);
  }

  /**
   * Sends a contract to a provider for signature
   */
  async sendToProvider(contractId: string, email: string, options?: {
    message?: string;
    firstName?: string;
    lastName?: string;
  }): Promise<{ success: boolean; message: string }> {
    const data: SendContractInput = {
      contractId,
      email,
      role: 'provider',
      message: options?.message,
      firstName: options?.firstName,
      lastName: options?.lastName
    };
    return this.send(data);
  }
} 