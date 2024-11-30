import { APIClient } from '../api/APIClient';
import { serviceQueries } from '../api/graphql/queries/index';
import { serviceMutations } from '../api/graphql/mutations/catalog/serviceMutation';

// Types pour les réponses et les inputs
export interface Service {
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
  supplyType?: string;
  uptakeForm?: string;
  billingPlan?: string;
  onlineService?: boolean;
  advancedAttributes?: string; // JSON stringifié
  state: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  deletedAt?: string; // ISO 8601
}

export interface CreateServiceInput {
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
  advancedAttributes?: string; // JSON stringifié
  state: string;
}

export interface UpdateServiceInput {
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
  advancedAttributes?: string; // JSON stringifié
  state?: string;
}

/**
 * THE `Service` CLASS MANAGES SERVICE-RELATED REQUESTS WITHIN THE APPLICATION.
 */
export class Service {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  //========================== QUERIES =============================================================

  async list(pagination?: any, sort?: any, filter?: any): Promise<Service[]> {
    const query = serviceQueries.GET_SERVICES;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as { data: { services: Service[] } };
    return response.data.services;
  }

  async getById(serviceID: string): Promise<Service> {
    const query = serviceQueries.GET_SERVICE_BY_ID;
    const variables = { serviceID };
    const response = await this.client.query(query, variables) as { data: { service: Service } };
    return response.data.service;
  }

  async getByAuthorID(authorID: string): Promise<Service[]> {
    const query = serviceQueries.GET_SERVICE_BY_AUTHOR_ID;
    const variables = { authorID };
    const response = await this.client.query(query, variables) as { data: { servicesByUserId: Service[] } };
    return response.data.servicesByUserId;
  }

  async getByUniqRef(uniqRef: string): Promise<Service> {
    const query = serviceQueries.GET_SERVICE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { serviceByUniqRef: Service } };
    return response.data.serviceByUniqRef;
  }

  async getBySlug(slug: string): Promise<Service> {
    const query = serviceQueries.GET_SERVICE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { serviceBySlug: Service } };
    return response.data.serviceBySlug;
  }

  async getByIDs(serviceIDs: string[]): Promise<Service[]> {
    const query = serviceQueries.GET_SERVICES_BY_IDS;
    const variables = { serviceIDs };
    const response = await this.client.query(query, variables) as { data: { servicesByIDs: Service[] } };
    return response.data.servicesByIDs;
  }

  async getBySlugs(slugs: string[]): Promise<Service[]> {
    const query = serviceQueries.GET_SERVICES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { servicesBySlugs: Service[] } };
    return response.data.servicesBySlugs;
  }

  async listByOrganization(input: any): Promise<Service[]> {
    const query = serviceQueries.LIST_SERVICES_BY_ORGANIZATION;
    const variables = { input };
    const response = await this.client.query(query, variables) as { data: { listServicesByOrganization: Service[] } };
    return response.data.listServicesByOrganization;
  }

  async search(input: string): Promise<Service[]> {
    const query = serviceQueries.SEARCH_SERVICES;
    const variables = { input };
    const response = await this.client.query(query, variables) as { data: { searchServices: Service[] } };
    return response.data.searchServices;
  }

  //========================== MUTATIONS =============================================================

  async createService(input: CreateServiceInput): Promise<Service> {
    const mutation = serviceMutations.CREATE_SERVICE;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createService: Service };
    return response.createService;
  }

  async updateService(serviceID: string, input: UpdateServiceInput): Promise<Service> {
    const mutation = serviceMutations.UPDATE_SERVICE;
    const variables = { serviceID, input };
    const response = await this.client.mutate(mutation, variables) as { updateService: Service };
    return response.updateService;
  }

  async deleteService(serviceID: string): Promise<{ success: boolean; message: string }> {
    const mutation = serviceMutations.DELETE_SERVICE;
    const variables = { serviceID };
    const response = await this.client.mutate(mutation, variables) as { deleteService: { success: boolean; message: string } };
    return response.deleteService;
  }
}
