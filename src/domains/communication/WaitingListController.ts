import { APIClient } from '../../api/APIClient.js';
import { waitingListMutations } from '../../api/graphql/user/mutations.js';
import { waitingListQueries } from '../../api/graphql/user/queries.js';

// Types d'entrée — alignés sur mu-authentication (CreateWaitingListInput / UpdateWaitingListInput)
export interface CreateWaitingListInput {
  firstName?: string;
  lastName: string;
  email: string;
  city: string;
  details: string;
  age: number;
}

export type UpdateWaitingListInput = Partial<CreateWaitingListInput>;

/** Filtres de `waitingLists(page, limit, state)` ; `state` est un ObjectStatus (online, offline…). */
export interface WaitingListListOptions {
  page?: number;
  limit?: number;
  state?: string;
}

// Types de réponse pour les mutations et les requêtes
interface WaitingListEntity {
  waitingListID: string;
  uniqRef: string;
  firstName?: string;
  lastName: string;
  email: string;
  city: string;
  details: string;
  age: number;
  jwt?: string;
  mailSent: boolean;
  lastMailSentAt?: string;
  state: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

interface MutationResponse {
  success: boolean;
  message: string;
}

interface WaitingListResponse {
  success: boolean;
  message: string;
  waitingList: WaitingListEntity | null;
}

/** mu-authentication renvoie `waitingList: null` avec `success: false` en cas de refus métier. */
function unwrapWaitingList(response: WaitingListResponse | null | undefined, action: string): WaitingListEntity {
  if (!response?.waitingList) {
    throw new Error(response?.message || `Échec de ${action} de l'inscription en liste d'attente`);
  }
  return response.waitingList;
}

// Types pour la vérification du token
interface WaitingListTokenData {
  waitingListID: string;
  firstName?: string;
  lastName: string;
  email: string;
  age: number;
  isUserExists: boolean;
  userState?: string;
}

interface WaitingListTokenResponse {
  success: boolean;
  message: string;
  data: WaitingListTokenData;
}

// Contrôleur des mutations et des requêtes pour la liste d'attente
export class WaitingList {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ======================= MUTATIONS =======================

  async create(input: CreateWaitingListInput): Promise<WaitingListEntity> {
    const mutation = waitingListMutations.CREATE_WAITING_LIST;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createWaitingList: WaitingListResponse };
    return unwrapWaitingList(response?.createWaitingList, 'la création');
  }

  async update(waitingListID: string, input: UpdateWaitingListInput): Promise<WaitingListEntity> {
    const mutation = waitingListMutations.UPDATE_WAITING_LIST;
    const variables = { waitingListID, input };
    const response = await this.client.mutate(mutation, variables) as { updateWaitingList: WaitingListResponse };
    return unwrapWaitingList(response?.updateWaitingList, 'la mise à jour');
  }

  async delete(waitingListID: string): Promise<MutationResponse> {
    const mutation = waitingListMutations.DELETE_WAITING_LIST;
    const variables = { waitingListID };
    const response = await this.client.mutate(mutation, variables) as { deleteWaitingList: MutationResponse };
    return response.deleteWaitingList;
  }

  async confirm(waitingListID: string): Promise<WaitingListEntity> {
    const mutation = waitingListMutations.CONFIRM_WAITING_LIST;
    const variables = { waitingListID };
    const response = await this.client.mutate(mutation, variables) as { confirmWaitingList: WaitingListResponse };
    return unwrapWaitingList(response?.confirmWaitingList, 'la confirmation');
  }

  async resendEmail(waitingListID: string): Promise<WaitingListEntity> {
    const mutation = waitingListMutations.RESEND_WAITING_LIST_EMAIL;
    const variables = { waitingListID };
    const response = await this.client.mutate(mutation, variables) as { resendWaitingListEmail: WaitingListResponse };
    return unwrapWaitingList(response?.resendWaitingListEmail, "le renvoi de l'e-mail");
  }

  async verifyToken(token: string): Promise<WaitingListTokenData> {
    const mutation = waitingListMutations.VERIFY_WAITING_LIST_TOKEN;
    const variables = { token };
    const response = await this.client.mutate(mutation, variables) as { verifyWaitingListToken: WaitingListTokenResponse };
    return response.verifyWaitingListToken.data;
  }

  // ======================= QUERIES =======================

  async getById(waitingListID: string): Promise<WaitingListEntity> {
    const query = waitingListQueries.GET_WAITING_LIST;
    const variables = { waitingListID };
    const response = await this.client.query(query, variables) as { waitingList: WaitingListEntity };
    return response.waitingList;
  }

  async list(options: WaitingListListOptions = {}): Promise<WaitingListEntity[]> {
    const query = waitingListQueries.GET_WAITING_LISTS;
    const { page, limit, state } = options;
    const response = await this.client.query(query, { page, limit, state }) as { waitingLists: WaitingListEntity[] };
    return response?.waitingLists ?? [];
  }
} 