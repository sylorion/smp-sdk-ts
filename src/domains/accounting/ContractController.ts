import { APIClient } from '../../api/APIClient.js';
import { logger } from '../../utils/Logger.js';
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
  GetContractByInvitationTokenResponse,
  OrganizationContractTemplate,
  SaveContractAsTemplateInput,
  UpdateOrganizationContractTemplateInput,
  GetContractsResponse,
  GetContractsByOrganizationIdResponse,
  VerifyTokenResponse,
  VerifyTokenGraphQLResponse,
  ContractTemplateSummary,
  ContractTemplateDetail,
  GetContractTemplatesResponse,
  GetContractTemplateResponse,
  RejectContractInput,
  ResendContractInvitationResponse,
  OrganizationSignatureSettings,
  UpdateOrganizationSignatureSettingsInput,
  SaveOrganizationSignerInput,
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
    // `UpdateContractInput.contractId` est obligatoire dans le schéma de mu-contract.
    const response = await this.client.mutate<UpdateContractResponse>(query, { id, data: { ...data, contractId: data.contractId ?? id } });
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
   * Contrat d'une invitation de signature (page publique de signature) :
   * accessible sans compte, avec le jeton exact et non expiré.
   */
  async getByInvitationToken(token: string): Promise<ContractResponse> {
    const query = contractQueries.GET_CONTRACT_BY_INVITATION_TOKEN;
    const response = await this.client.query<GetContractByInvitationTokenResponse>(query, { token });
    return response.getContractByInvitationToken;
  }

  /**
   * Contrats des organisations de l'appelant (identité requise).
   */
  async list(): Promise<ContractResponse[]> {
    const query = contractQueries.GET_ALL_CONTRACTS;
    const response = await this.client.query<GetContractsResponse>(query, {});
    // Le champ GraphQL est `getContracts` (lire `contracts` renvoyait toujours undefined).
    return response.getContracts ?? [];
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
      logger.error('Error in getByOrganizationId:', error);
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

  // ── Suivi, refus, relance, nouvelle version ─────────────────────────

  /** Refus du client, par son jeton d'invitation ; le motif est stocké dans `details.rejection`. */
  async reject(data: RejectContractInput): Promise<ContractResponse> {
    const r = await this.client.mutate<{ rejectContract: ContractResponse }>(contractMutations.REJECT_CONTRACT, { data });
    return r.rejectContract;
  }

  /** Renvoie l'invitation au dernier destinataire (l'ancien lien est révoqué). Le jeton n'est pas renvoyé. */
  async resendInvitation(contractId: string): Promise<ResendContractInvitationResponse> {
    const r = await this.client.mutate<{ resendContractInvitation: ResendContractInvitationResponse }>(
      contractMutations.RESEND_CONTRACT_INVITATION, { contractId });
    return r.resendContractInvitation;
  }

  /** Première ouverture du lien de signature (page publique) ; déclenche `contract.opened` si demandé à l'envoi. */
  async markInvitationOpened(invitationToken: string): Promise<boolean> {
    const r = await this.client.mutate<{ markContractInvitationOpened: boolean }>(
      contractMutations.MARK_CONTRACT_INVITATION_OPENED, { invitationToken });
    return !!r.markContractInvitationOpened;
  }

  /** Nouvelle version (v+1) d'un contrat figé ou refusé : les signatures sont à refaire. */
  async duplicate(contractId: string): Promise<ContractResponse> {
    const r = await this.client.mutate<{ duplicateContract: ContractResponse }>(contractMutations.DUPLICATE_CONTRACT, { contractId });
    return r.duplicateContract;
  }

  // ── Signature de l'organisation (contre-signature) ──────────────────

  async getSignatureSettings(organizationId: string): Promise<OrganizationSignatureSettings> {
    const r = await this.client.query<{ organizationSignatureSettings: OrganizationSignatureSettings }>(
      contractQueries.GET_ORGANIZATION_SIGNATURE_SETTINGS, { organizationId });
    return r.organizationSignatureSettings;
  }

  /** `autoCountersign: true` exige le plan Pro (erreur `PLAN_REQUIRED`). */
  async updateSignatureSettings(organizationId: string, data: UpdateOrganizationSignatureSettingsInput): Promise<OrganizationSignatureSettings> {
    const r = await this.client.mutate<{ updateOrganizationSignatureSettings: OrganizationSignatureSettings }>(
      contractMutations.UPDATE_ORGANIZATION_SIGNATURE_SETTINGS, { organizationId, data });
    return r.updateOrganizationSignatureSettings;
  }

  /** L'appelant enregistre SA signature pour l'organisation. */
  async saveSigner(organizationId: string, data: SaveOrganizationSignerInput): Promise<OrganizationSignatureSettings> {
    const r = await this.client.mutate<{ saveOrganizationSigner: OrganizationSignatureSettings }>(
      contractMutations.SAVE_ORGANIZATION_SIGNER, { organizationId, data });
    return r.saveOrganizationSigner;
  }

  /** L'appelant retire sa propre signature. */
  async removeSigner(organizationId: string, userId: string): Promise<OrganizationSignatureSettings> {
    const r = await this.client.mutate<{ removeOrganizationSigner: OrganizationSignatureSettings }>(
      contractMutations.REMOVE_ORGANIZATION_SIGNER, { organizationId, userId });
    return r.removeOrganizationSigner;
  }

  // ── Modèles de l'organisation (contrats réutilisables) ──────────────

  async listOrganizationTemplates(organizationId: string): Promise<OrganizationContractTemplate[]> {
    const r = await this.client.query<{ organizationContractTemplates: OrganizationContractTemplate[] }>(
      contractQueries.GET_ORGANIZATION_CONTRACT_TEMPLATES, { organizationId });
    return r.organizationContractTemplates ?? [];
  }

  async getOrganizationTemplate(templateId: string): Promise<OrganizationContractTemplate> {
    const r = await this.client.query<{ organizationContractTemplate: OrganizationContractTemplate }>(
      contractQueries.GET_ORGANIZATION_CONTRACT_TEMPLATE, { templateId });
    return r.organizationContractTemplate;
  }

  async saveAsTemplate(data: SaveContractAsTemplateInput): Promise<OrganizationContractTemplate> {
    const r = await this.client.mutate<{ saveContractAsTemplate: OrganizationContractTemplate }>(
      contractMutations.SAVE_CONTRACT_AS_TEMPLATE, { data });
    return r.saveContractAsTemplate;
  }

  async updateOrganizationTemplate(templateId: string, data: UpdateOrganizationContractTemplateInput): Promise<OrganizationContractTemplate> {
    const r = await this.client.mutate<{ updateOrganizationContractTemplate: OrganizationContractTemplate }>(
      contractMutations.UPDATE_ORGANIZATION_CONTRACT_TEMPLATE, { templateId, data });
    return r.updateOrganizationContractTemplate;
  }

  async deleteOrganizationTemplate(templateId: string): Promise<boolean> {
    const r = await this.client.mutate<{ deleteOrganizationContractTemplate: boolean }>(
      contractMutations.DELETE_ORGANIZATION_CONTRACT_TEMPLATE, { templateId });
    return !!r.deleteOrganizationContractTemplate;
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