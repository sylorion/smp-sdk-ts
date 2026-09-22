import { APIClient } from '../api/APIClient.js';
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
    advancedAttributes?: string;
    poweredByAgent?: boolean;
    agentConfiguration?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    serviceMedias?: ServiceMediaEntity[];
}
interface CreateServiceInput {
    authorID: string;
    title: string;
    description: string;
    mediaBannerID?: string;
    termsAndConditionsID?: string;
    parentServiceID?: string;
    topicID?: string;
    organizationID: string;
    locationID: string;
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
    advancedAttributes?: string;
    poweredByAgent?: boolean;
    agentConfiguration?: string;
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
    advancedAttributes?: string;
    poweredByAgent?: boolean;
    agentConfiguration?: string;
    state?: string;
}
interface ServiceMediaEntity {
    serviceMediaID: string;
    uniqRef: string;
    slug: string;
    mediaID: string;
    serviceID: string;
    legend: string;
    listingPosition: number;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
interface CreateServiceMediaInput {
    mediaID: string;
    serviceID: string;
    legend?: string;
    listingPosition?: number;
    state: string;
}
interface UpdateServiceMediaInput {
    mediaID?: string;
    serviceID?: string;
    legend?: string;
    listingPosition?: number;
    state?: string;
}
export interface MutationResponse {
    success: boolean;
    message: string;
}
export interface ListServicesByOrganizationInput {
    organizationID: string;
    admin?: boolean;
}
export interface ServiceToFavorites {
    serviceID: string;
    userID?: string;
    addedAt: string;
}
export interface SearchServiceInput {
    searchTerm?: String;
    priceMin?: number;
    priceMax?: number;
    performance?: number;
    topicID?: string;
}
/**
 * `ServiceController` GÈRE LES REQUÊTES RELATIVES AUX SERVICES DANS L'APPLICATION.
 */
export declare class Service {
    private client;
    constructor(client: APIClient);
    list(pagination?: any, sort?: any, filter?: any): Promise<ServiceEntity[]>;
    getById(serviceID: string, admin?: boolean): Promise<ServiceEntity>;
    getByAuthorID(authorID: string): Promise<ServiceEntity[]>;
    getByUniqRef(uniqRef: string, admin?: boolean): Promise<ServiceEntity>;
    getBySlug(slug: string, admin?: boolean): Promise<ServiceEntity>;
    getByIDs(serviceIDs: string[], admin?: boolean): Promise<ServiceEntity[]>;
    getBySlugs(slugs: string[], admin?: boolean): Promise<ServiceEntity[]>;
    listByOrganization(input: ListServicesByOrganizationInput): Promise<ServiceEntity[]>;
    search(input: SearchServiceInput): Promise<ServiceEntity[]>;
    getByAgentID(agentID: string): Promise<ServiceEntity[]>;
    getServiceMedia(serviceMediaID: string): Promise<ServiceMediaEntity>;
    listServiceMedias(pagination?: any, sort?: any, filter?: any): Promise<ServiceMediaEntity[]>;
    getServiceMediaBySlug(slug: string): Promise<ServiceMediaEntity>;
    getServiceMediasByIds(serviceMediaIDs: string[]): Promise<ServiceMediaEntity[]>;
    getServiceMediasBySlugs(slugs: string[]): Promise<ServiceMediaEntity[]>;
    getServiceMediaByUniqRef(uniqRef: string): Promise<ServiceMediaEntity>;
    createService(input: CreateServiceInput): Promise<ServiceEntity>;
    updateService(serviceID: string, input: UpdateServiceInput): Promise<ServiceEntity>;
    deleteService(serviceID: string): Promise<MutationResponse>;
    /**
     * Publie un service ajouté aux favoris.
     * @param input - Objet contenant serviceID et optionnellement userID.
     */
    addServiceToFavorites(input: {
        serviceID: string;
        userID?: string;
    }): Promise<ServiceToFavorites>;
    createServiceMedia(input: CreateServiceMediaInput): Promise<ServiceMediaEntity>;
    updateServiceMedia(serviceMediaID: string, input: UpdateServiceMediaInput): Promise<ServiceMediaEntity>;
    deleteServiceMedia(serviceMediaID: string): Promise<MutationResponse>;
}
export {};
