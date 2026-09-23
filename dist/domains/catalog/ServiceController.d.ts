import { APIClient } from '../../api/APIClient.js';
import type { Place } from './LocationController.js';
/** Asset imbriqué dans ServiceAsset — chargé via la query service */
interface ServiceAssetMediaEntity {
    listingPosition?: number;
    legend?: string;
    state?: string;
    media?: {
        url: string;
    };
}
interface AssetEntity {
    assetID: string;
    title?: string;
    description?: string;
    price?: number;
    legalVatPercent?: number;
    quantity?: number;
    maxPerReservation?: number;
    details?: Record<string, any>;
    state?: string;
    mediaID?: string;
    medias?: ServiceAssetMediaEntity[];
}
interface ServiceAssetEntity {
    serviceAssetID: string;
    assetID?: string;
    serviceID?: string;
    legend?: string;
    state?: string;
    /** Asset complet — source de vérité unique, résolu par mu-catalog */
    asset?: AssetEntity | null;
}
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
    likes?: number;
    /** Agrégats d'avis exposés par mu-catalog (null tant qu'aucun avis). */
    averageRating?: number | null;
    reviewCount?: number | null;
    serviceMedias?: ServiceMediaEntity[];
    /** Localisation résolue via Apollo Federation (null si locationID absent) */
    location?: Place | null;
    /** Assets (options) inclus dans la query — source de vérité unique, plus de fetch cascade */
    serviceAssets?: ServiceAssetEntity[];
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
    /** Média résolu (`media { url }` dans les queries service). */
    media?: {
        url: string;
    };
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
    searchTerm: String;
}
/**
 * `ServiceController` GÈRE LES REQUÊTES RELATIVES AUX SERVICES DANS L'APPLICATION.
 */
export declare class Service {
    private client;
    constructor(client: APIClient);
    list(pagination?: any, sort?: any, filter?: any, admin?: boolean): Promise<ServiceEntity[]>;
    getById(serviceID: string, admin?: boolean): Promise<ServiceEntity>;
    listByAuthorId(authorID: string, admin?: boolean): Promise<ServiceEntity[]>;
    getByUniqRef(uniqRef: string, admin?: boolean): Promise<ServiceEntity>;
    getBySlug(slug: string, admin?: boolean): Promise<ServiceEntity>;
    getByIds(serviceIDs: string[], admin?: boolean): Promise<ServiceEntity[]>;
    getBySlugs(slugs: string[], admin?: boolean): Promise<ServiceEntity[]>;
    listByOrganizationId(organizationID: string, admin?: boolean): Promise<ServiceEntity[]>;
    search(input: SearchServiceInput): Promise<ServiceEntity[]>;
    getByAgentID(agentID: string, admin?: boolean): Promise<ServiceEntity[]>;
    getMediaById(serviceMediaID: string): Promise<ServiceMediaEntity>;
    listMedias(pagination?: any, sort?: any, filter?: any): Promise<ServiceMediaEntity[]>;
    getMediaBySlug(slug: string): Promise<ServiceMediaEntity>;
    getMediasByIds(serviceMediaIDs: string[]): Promise<ServiceMediaEntity[]>;
    getMediasBySlugs(slugs: string[]): Promise<ServiceMediaEntity[]>;
    getMediaByUniqRef(uniqRef: string): Promise<ServiceMediaEntity>;
    create(input: CreateServiceInput): Promise<ServiceEntity>;
    update(serviceID: string, input: UpdateServiceInput): Promise<ServiceEntity>;
    delete(serviceID: string): Promise<MutationResponse>;
    /**
     * Publie un service ajouté aux favoris.
     * @param input - Objet contenant serviceID et optionnellement userID.
     */
    addServiceToFavorites(input: {
        serviceID: string;
        userID?: string;
    }): Promise<ServiceToFavorites>;
    createMedia(input: CreateServiceMediaInput): Promise<ServiceMediaEntity>;
    updateMedia(serviceMediaID: string, input: UpdateServiceMediaInput): Promise<ServiceMediaEntity>;
    deleteMedia(serviceMediaID: string): Promise<MutationResponse>;
}
export {};
