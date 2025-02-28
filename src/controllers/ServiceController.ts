import { APIClient } from '../api/APIClient';
import { serviceQueries } from '../api/graphql/queries/index';
import { serviceMutations } from '../api/graphql/mutations/catalog/serviceMutation';

// Types pour les entités et les inputs
 interface ServiceEntity {
  serviceID: string;
  uniqRef: string;
  slug: string;
  authorID: string;
  title: string;
  description: string;
  mediaBannerID?: string;
  termsAndConditionsID?: string;
  parentServiceID?: string;
  topicID?: string;
  organizationID?: string;
  locationID?: string;
  paymentConfigID?: string;
  price: number;
  legalVatPercent?: number;
  lowerPrice?: number;
  upperPrice?: number;
  negotiable?: boolean;
  perimeter?: number;
  supplyType: string;
  uptakeForm: string;
  billingPlan: string;
  onlineService?: boolean;
  advancedAttributes?: string; // JSON stringifié
  state: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  deletedAt?: string; // ISO 8601
}

 interface CreateServiceInput {
  authorID: string;
  title: string;
  description: string;
  mediaBannerID?: string;
  termsAndConditionsID?: string;
  parentServiceID?: string;
  topicID?: string;
  organizationID?: string;
  locationID?: string;
  paymentConfigID?: string;
  price: number;
  legalVatPercent: number;
  lowerPrice: number;
  upperPrice: number;
  negotiable?: boolean;
  perimeter?: number;
  supplyType?: string;
  uptakeForm?: string;
  billingPlan?: string;
  onlineService?: boolean;
  advancedAttributes?: JSON; 
  state: string;
}

 interface UpdateServiceInput {
  title?: string;
  description?: string;
  mediaBannerID?: string;
  termsAndConditionsID?: string;
  parentServiceID?: string;
  topicID?: string;
  locationID?: string;
  paymentConfigID?: string;
  price?: number;
  legalVatPercent?: number;
  lowerPrice?: number;
  upperPrice?: number;
  negotiable?: boolean;
  perimeter?: number;
  supplyType?: string;
  uptakeForm?: string;
  billingPlan?: string;
  onlineService?: boolean;
  advancedAttributes?: JSON; 
  state?: string;
}

export interface MutationResponse {
  success: boolean;
  message: string;
}

export interface ServiceToFavorites {
  serviceID: string;
  userID?: string;
  addedAt: string;
}

/**
 * `ServiceController` GÈRE LES REQUÊTES RELATIVES AUX SERVICES DANS L'APPLICATION.
 */
export class Service {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  //========================== QUERIES =============================================================

  async list(pagination?: any, sort?: any, filter?: any): Promise<ServiceEntity[]> {
    const query = serviceQueries.GET_SERVICES;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { services: ServiceEntity[]  };
    return response.services; 
  }

  async getById(serviceID: string): Promise<ServiceEntity> {
    const query = serviceQueries.GET_SERVICE_BY_ID;
    const variables = { serviceID };
    const response = await this.client.query(query, variables) as { data: { service: ServiceEntity } };
    return response.data.service;
  }

  async getByAuthorID(authorID: string): Promise<ServiceEntity[]> {
    const query = serviceQueries.GET_SERVICE_BY_AUTHOR_ID;
    const variables = { authorID };
    const response = await this.client.query(query, variables) as { data: { servicesByUserId: ServiceEntity[] } };
    return response.data.servicesByUserId;
  }

  async getByUniqRef(uniqRef: string): Promise<ServiceEntity> {
    const query = serviceQueries.GET_SERVICE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { serviceByUniqRef: ServiceEntity } };
    return response.data.serviceByUniqRef;
  }

  async getBySlug(slug: string): Promise<ServiceEntity> {
    const query = serviceQueries.GET_SERVICE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { serviceBySlug: ServiceEntity } };
    return response.data.serviceBySlug;
  }

  async getByIDs(serviceIDs: string[]): Promise<ServiceEntity[]> {
    const query = serviceQueries.GET_SERVICES_BY_IDS;
    const variables = { serviceIDs };
    const response = await this.client.query(query, variables) as { data: { servicesByIDs: ServiceEntity[] } };
    return response.data.servicesByIDs;
  }

  async getBySlugs(slugs: string[]): Promise<ServiceEntity[]> {
    const query = serviceQueries.GET_SERVICES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { servicesBySlugs: ServiceEntity[] } };
    return response.data.servicesBySlugs;
  }

  async listByOrganization(input: any): Promise<ServiceEntity[]> {
    const query = serviceQueries.LIST_SERVICES_BY_ORGANIZATION;
    const variables = { input };
    const response = await this.client.query(query, variables) as { data: { listServicesByOrganization: ServiceEntity[] } };
    return response.data.listServicesByOrganization;
  }

  async search(input: string): Promise<ServiceEntity[]> {
    const query = serviceQueries.SEARCH_SERVICES;
    const variables = { input };
    const response = await this.client.query(query, variables) as { data: { searchServices: ServiceEntity[] } };
    return response.data.searchServices;
  }

  //========================== MUTATIONS =============================================================

  async createService(input: CreateServiceInput): Promise<ServiceEntity> {
    const mutation = serviceMutations.CREATE_SERVICE;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createService: ServiceEntity };
    return response.createService;
  }

  async updateService(serviceID: string, input: UpdateServiceInput): Promise<ServiceEntity> {
    const mutation = serviceMutations.UPDATE_SERVICE;
    const variables = { serviceID, input };
    const response = await this.client.mutate(mutation, variables) as { updateService: ServiceEntity };
    return response.updateService;
  }

  async deleteService(serviceID: string): Promise<MutationResponse> {
    const mutation = serviceMutations.DELETE_SERVICE;
    const variables = { serviceID };
    const response = await this.client.mutate(mutation, variables) as { deleteService: MutationResponse };
    return response.deleteService;
  }

  /**
   * Publie un service ajouté aux favoris.
   * @param input - Objet contenant serviceID et optionnellement userID.
   */
  async addServiceToFavorites(input: { serviceID: string; userID?: string }): Promise<ServiceToFavorites> {
    const mutation = serviceMutations.ADD_SERVICE_TO_FAVORITES;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { data: { addServiceToFavorites: ServiceToFavorites } };
    return response.data.addServiceToFavorites;
  }

}
