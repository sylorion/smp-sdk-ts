export interface MediaEntity {
    mediaID: string;
    uniqRef?: string;
    slug?: string;
    authorID?: string;
    mediaType: string;
    legend?: string;
    summary?: string;
    originalName: string;
    finalName: string;
    url: string;
    size?: string;
    entityID?: string;
    metadata?: any;
    entityName?: string;
    state?: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
export interface CreateMediaInput {
    mediaType?: string;
    authorID?: string;
    legend?: string;
    summary?: string;
    originalName?: string;
    finalName?: string;
    entityID?: string;
    metadata?: any;
    entityName?: string;
    url?: string;
    size?: string;
    state?: string;
}
export interface UpdateMediaInput {
    legend?: string;
    summary?: string;
    originalName?: string;
    finalName?: string;
    metadata?: any;
    url?: string;
    size?: string;
    state?: string;
}
export interface ServiceMediaEntity {
    serviceMediaID: string;
    uniqRef?: string;
    slug?: string;
    mediaID: string;
    serviceID: string;
    legend?: string;
    listingPosition: number;
    state: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    /** Média résolu (sélectionné par GET_SERVICE(S)_BY_ID(S) : `media { url }`). */
    media?: {
        url: string;
    };
}
export interface CreateServiceMediaInput {
    mediaID: string;
    serviceID: string;
    legend?: string;
    listingPosition?: number;
    state: string;
}
export interface UpdateServiceMediaInput {
    mediaID?: string;
    serviceID?: string;
    legend?: string;
    listingPosition?: number;
    state?: string;
}
export interface ServiceEntity {
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
    /** Devise ISO-4217 des prix (EUR, USD…) — celle de l'organisation vendeuse. */
    currency?: string | null;
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
    state: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    likes?: number;
    /** Note publique moyenne /5 (Rapports de service publiés, mu-review). */
    averageRating?: number | null;
    reviewCount?: number;
    /** Performance Score /100 (mu-review). */
    performanceScore?: number | null;
    serviceMedias?: ServiceMediaEntity[];
    /** Localisation résolue via Apollo Federation (mu-location) — null si locationID absent. */
    location?: {
        placeID: string;
        city?: string | null;
        country?: string | null;
        region?: string | null;
        pstate?: string | null;
        postalCode?: string | null;
        addressLine1?: string | null;
        placeKind?: string | null;
    } | null;
}
export interface CreateServiceInput {
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
    advancedAttributes?: string;
    poweredByAgent?: boolean;
    agentConfiguration?: string;
    state?: string;
}
export interface ListServicesByOrganizationInput {
    organizationID: string;
}
export interface ServiceToFavorites {
    serviceID: string;
    userID?: string;
    addedAt: string;
}
export interface SearchServiceInput {
    searchTerm: String;
}
export interface AssetMediaEntity {
    assetMediaID: string;
    assetID: string;
    mediaID: string;
    listingPosition: number;
    legend?: string;
    state: string;
    media?: MediaEntity;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
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
    /** Devise ISO-4217 des prix (EUR, USD…) — celle de l'organisation vendeuse. */
    currency?: string | null;
    legalVatPercent?: number;
    quantity: number;
    stockQuantity?: number;
    maxPerReservation?: number;
    conflictingAssets?: any;
    applyableAssets?: any;
    details?: any;
    state: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
    medias?: AssetMediaEntity[];
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
}
export interface ListServicesByAssetInput {
    assetID: string;
}
export interface ListAssetsByOrganizationInput {
    organizationID: string;
}
export interface ServiceAssetEntity {
    serviceAssetID: string;
    uniqRef?: string;
    slug: string;
    assetID: string;
    serviceID: string;
    legend?: string;
    state: string;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
}
export interface CreateServiceAssetInput {
    assetID: string;
    serviceID: string;
    legend?: string;
    state: string;
}
export interface UpdateServiceAssetInput {
    assetID?: string;
    serviceID?: string;
    legend?: string;
    state?: string;
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
    service: ServiceEntity;
    serviceAsset: ServiceAssetPayloadEntity;
}
export interface AssetWithLinksEntity {
    asset: AssetEntity;
    serviceLinks: ServiceWithServiceAssetEntity[];
}
