import { APIClient } from '../api/APIClient';
import { waitingListMutations } from './../api/graphql/mutations/authentication/waitingListMutations';
import { waitingListQueries } from './../api/graphql/queries/authentication/waitingListQueries';

// Types d'entrée pour les mutations de la liste d'attente
interface WaitingListInput {
  firstName?: string;
  lastName: string;
  email: string;
  city: string;
  details: string;
  age: number;
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

interface WaitingListResponse {
  success: boolean;
  message: string;
  waitingList?: WaitingListEntity;
  errors?: any[];
}

// Contrôleur des mutations et des requêtes pour la liste d'attente
export class WaitingList {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  // ======================= MUTATIONS =======================

  async create(input: WaitingListInput): Promise<WaitingListResponse> {
    const mutation = waitingListMutations.CREATE_WAITING_LIST;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createWaitingList: WaitingListResponse };
    return response.createWaitingList;
  }

  async update(waitingListID: string, input: WaitingListInput): Promise<WaitingListResponse> {
    const mutation = waitingListMutations.UPDATE_WAITING_LIST;
    const variables = { waitingListID, input };
    const response = await this.client.mutate(mutation, variables) as { updateWaitingList: WaitingListResponse };
    return response.updateWaitingList;
  }

  async delete(waitingListID: string): Promise<WaitingListResponse> {
    const mutation = waitingListMutations.DELETE_WAITING_LIST;
    const variables = { waitingListID };
    const response = await this.client.mutate(mutation, variables) as { deleteWaitingList: WaitingListResponse };
    return response.deleteWaitingList;
  }

  async confirm(waitingListID: string): Promise<WaitingListResponse> {
    const mutation = waitingListMutations.CONFIRM_WAITING_LIST;
    const variables = { waitingListID };
    const response = await this.client.mutate(mutation, variables) as { confirmWaitingList: WaitingListResponse };
    return response.confirmWaitingList;
  }

  async resendEmail(waitingListID: string): Promise<WaitingListResponse> {
    const mutation = waitingListMutations.RESEND_WAITING_LIST_EMAIL;
    const variables = { waitingListID };
    const response = await this.client.mutate(mutation, variables) as { resendWaitingListEmail: WaitingListResponse };
    return response.resendWaitingListEmail;
  }

  // ======================= QUERIES =======================

  async get(waitingListID: string): Promise<WaitingListEntity> {
    const query = waitingListQueries.GET_WAITING_LIST;
    const variables = { waitingListID };
    const response = await this.client.query(query, variables) as { waitingList: WaitingListEntity };
    return response.waitingList;
  }

  async list(page?: number, limit?: number, state?: string): Promise<WaitingListEntity[]> {
    const query = waitingListQueries.GET_WAITING_LISTS;
    const variables = { page, limit, state };
    const response = await this.client.query(query, variables) as { waitingLists: WaitingListEntity[] };
    return response.waitingLists;
  }
} 