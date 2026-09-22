import { APIClient } from '../../api/APIClient.js';
interface MediaEntity {
    mediaID: string;
    url: string;
    mediaType: string;
    originalName: string;
    finalName: string;
}
interface AssetMediaEntity {
    assetMediaID: string;
    assetID: string;
    mediaID: string;
    listingPosition: number;
    legend?: string;
    state: string;
    media: MediaEntity;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface AssetEntity {
    assetID: string;
    uniqRef?: string;
    slug?: string;
    title: string;
    authorID?: string;
    organizationID?: string;
    mediaID?: string;
    description?: string;
    price: number;
    legalVatPercent?: number;
    quantity: number;
    stockQuantity?: number;
    maxPerReservation?: number;
    conflictingAssets?: any;
    applyableAssets?: any;
    details?: any;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    medias: AssetMediaEntity[];
}
export interface ServiceAssetPayloadEntity {
    serviceAssetID: string;
    serviceID: string;
    assetID: string;
}
export interface AssetWithServiceAssetEntity {
    asset: AssetEntity;
    serviceAsset: ServiceAssetPayloadEntity;
}
export interface ServiceWithServiceAssetEntity {
    service: {
        serviceID: string;
        uniqRef?: string;
        slug?: string;
        authorID?: string;
        title: string;
        description?: string;
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
        advancedAttributes?: string;
        state: string;
        createdAt?: string;
        updatedAt?: string;
        deletedAt?: string;
    };
    serviceAsset: {
        serviceAssetID: string;
        serviceID: string;
        assetID: string;
    };
}
export interface AssetWithLinksEntity {
    asset: AssetEntity;
    serviceLinks: ServiceWithServiceAssetEntity[];
}
export interface CreateAssetInput {
    title: string;
    stockQuantity?: number;
    organizationID?: string;
    mediaID?: string;
    description?: string;
    price: number;
    legalVatPercent?: number;
    quantity: number;
    maxPerReservation?: number;
    conflictingAssets?: any;
    applyableAssets?: any;
    details?: any;
    state: string;
}
export interface UpdateAssetInput {
    title?: string;
    stockQuantity?: number;
    mediaID?: string;
    description?: string;
    price?: number;
    legalVatPercent?: number;
    quantity?: number;
    maxPerReservation?: number;
    conflictingAssets?: any;
    applyableAssets?: any;
    details?: any;
    state?: string;
}
export interface ListAssetsByServiceInput {
    serviceID: string;
    admin?: boolean;
}
export interface ListServicesByAssetInput {
    assetID: string;
    admin?: boolean;
}
export interface ListAssetsByOrganizationInput {
    organizationID: string;
    admin?: boolean;
}
export interface MutationResponse {
    success: boolean;
    message: string;
}
export interface CreateAssetMediaInput {
    assetID: string;
    mediaID: string;
    listingPosition: number;
    legend?: string;
    state: string;
}
export interface UpdateAssetMediaInput {
    legend?: string;
    listingPosition?: number;
    state?: string;
}
/**
 * AssetController gère les requêtes relatives aux assets dans l'application.
 */
export declare class Asset {
    private client;
    constructor(client: APIClient);
    getById(assetID: string, admin?: boolean): Promise<AssetEntity>;
    list(pagination?: any, sort?: any, filter?: any, admin?: boolean): Promise<AssetEntity[]>;
    getBySlug(slug: string, admin?: boolean): Promise<AssetEntity>;
    getByIds(assetIDs: string[], admin?: boolean): Promise<AssetEntity[]>;
    getBySlugs(slugs: string[], admin?: boolean): Promise<AssetEntity[]>;
    getByUniqRef(uniqRef: string, admin?: boolean): Promise<AssetEntity>;
    /**
     * Récupère la liste des Assets associés à un service, avec pivot.
     */
    listByServiceId(serviceID: string): Promise<AssetWithServiceAssetEntity[]>;
    /**
     * Récupère la liste des Services associés à un asset, avec pivot.
     */
    listServicesByAsset(input: ListServicesByAssetInput): Promise<ServiceWithServiceAssetEntity[]>;
    /**
     * Récupère la liste des Assets d'une organisation, avec tous leurs pivots.
     */
    listByOrganizationId(organizationID: string, admin?: boolean): Promise<AssetWithLinksEntity[]>;
    create(input: CreateAssetInput): Promise<AssetEntity>;
    update(assetID: string, input: UpdateAssetInput): Promise<AssetEntity>;
    delete(assetID: string): Promise<MutationResponse>;
    getMediaById(assetMediaID: string): Promise<AssetMediaEntity>;
    listMedias(pagination?: any, sort?: any, filter?: any): Promise<AssetMediaEntity[]>;
    getMediasByIds(assetMediaIDs: string[]): Promise<AssetMediaEntity[]>;
    createMedia(input: CreateAssetMediaInput): Promise<AssetMediaEntity>;
    updateMedia(assetMediaID: string, input: UpdateAssetMediaInput): Promise<AssetMediaEntity>;
    deleteMedia(assetMediaID: string): Promise<MutationResponse>;
}
export {};
