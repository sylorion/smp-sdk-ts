import { APIClient } from '../../api/APIClient.js';
import type { Place } from '../catalog/LocationController.js';
export interface Organization {
    organizationID: string;
    uniqRef: string;
    slug: string;
    authorID: number;
    ownerID?: number;
    orgRef?: string;
    sectorID?: number;
    legalName: string;
    brand?: string;
    sigle?: string;
    smallLogo?: string;
    bigLogo?: string;
    banner?: string;
    smallLogoUrl?: string;
    bigLogoUrl?: string;
    bannerUrl?: string;
    oSize?: string;
    juridicForm?: string;
    juridicCatLabel?: string;
    juridicCatCode?: string;
    currency?: string;
    legalUniqIdentifier?: string;
    vatNumber?: string;
    communityVATNumber?: string;
    capital?: number;
    insuranceRef?: string;
    insuranceName?: string;
    activityStartedAt?: number;
    activityEndedAt?: number;
    description: string;
    summary?: string;
    locationID?: string;
    parentOrganizationID?: string;
    advancedAttributes?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    /** Localisation résolue via Apollo Federation (null si locationID absent) */
    location?: Place | null;
}
export interface UserRoleInOrganization {
    roleID: string;
    roleName: string;
}
export interface OrganizationByUser {
    organizationID: string;
    organizationName: string;
    smallLogoUrl: string | null;
    userRole: UserRoleInOrganization;
}
export interface CreateOrganizationInput {
    authorID: number;
    ownerID?: number;
    orgRef?: string;
    sectorID?: number;
    legalName: string;
    brand?: string;
    sigle?: string;
    smallLogo?: string;
    bigLogo?: string;
    banner?: string;
    oSize?: string;
    juridicForm?: string;
    juridicCatLabel?: string;
    juridicCatCode?: string;
    currency?: string;
    legalUniqIdentifier?: string;
    vatNumber?: string;
    communityVATNumber?: string;
    capital?: number;
    insuranceRef?: string;
    insuranceName?: string;
    activityStartedAt?: number;
    activityEndedAt?: number;
    description: string;
    summary?: string;
    locationID?: string;
    parentOrganizationID?: string;
    advancedAttributes?: string;
    state: string;
}
export interface UpdateOrganizationInput {
    ownerID?: number;
    orgRef?: string;
    sectorID?: number;
    legalName?: string;
    brand?: string;
    sigle?: string;
    smallLogo?: string;
    bigLogo?: string;
    banner?: string;
    oSize?: string;
    juridicForm?: string;
    juridicCatLabel?: string;
    juridicCatCode?: string;
    currency?: string;
    legalUniqIdentifier?: string;
    vatNumber?: string;
    communityVATNumber?: string;
    capital?: number;
    insuranceRef?: string;
    insuranceName?: string;
    activityStartedAt?: number;
    activityEndedAt?: number;
    description?: string;
    summary?: string;
    locationID?: string;
    parentOrganizationID?: string;
    advancedAttributes?: string;
    state?: string;
}
export interface OrganizationMedia {
    organizationMediaID: string;
    mediaID: string;
    legend?: string;
    listingPosition?: number;
    state: string;
    media?: {
        mediaID: string;
        url: string;
        originalName: string;
        finalName: string;
    };
}
export interface CreateOrganizationMediaInput {
    mediaID: string;
    organizationID: string;
    legend?: string;
    listingPosition?: number;
    state?: string;
}
export interface UpdateOrganizationMediaInput {
    legend?: string;
    listingPosition?: number;
    state?: string;
}
/**
 * The `Organization` class manages organization-related requests within the application.
 */
export declare class Organization {
    private client;
    constructor(client: APIClient);
    /**
     * Fetches a list of organizations with optional pagination, sorting, and filters.
     */
    list(pagination?: any, sort?: any, filter?: any, admin?: boolean): Promise<Organization[]>;
    /**
     * Fetches a single organization by its ID.
     */
    getById(organizationID: string, admin?: boolean): Promise<Organization>;
    /**
     * Fetches multiple organizations by their IDs.
     */
    getByIds(organizationIDs: string[], admin?: boolean): Promise<Organization[]>;
    /**
     * Fetches a single organization by its unique reference.
     */
    getByUniqRef(uniqRef: string, admin?: boolean): Promise<Organization>;
    /**
     * Fetches a single organization by its slug.
     */
    getBySlug(slug: string, admin?: boolean): Promise<Organization>;
    /**
     * Fetches multiple organizations by their slugs.
     */
    getBySlugs(slugs: string[], admin?: boolean): Promise<Organization[]>;
    /**
     * Creates a new organization with the specified input.
     */
    create(input: CreateOrganizationInput): Promise<Organization>;
    /**
     * Updates an existing organization by its ID with the specified input.
     */
    update(organizationID: string, input: UpdateOrganizationInput): Promise<Organization>;
    /**
     * Deletes an organization by its ID.
     */
    delete(organizationID: string): Promise<boolean>;
    /**
     * Fetches a single organization media by its ID.
     */
    getMediaById(organizationMediaID: string): Promise<OrganizationMedia>;
    /**
     * Fetches all media for an organization.
     */
    listMedias(organizationID: string): Promise<OrganizationMedia[]>;
    /**
     * Creates a new organization media.
     */
    createMedia(input: CreateOrganizationMediaInput): Promise<OrganizationMedia>;
    /**
     * Updates an existing organization media.
     */
    updateMedia(organizationMediaID: string, input: UpdateOrganizationMediaInput): Promise<OrganizationMedia>;
    /**
     * Deletes an organization media.
     */
    deleteMedia(organizationMediaID: string): Promise<boolean>;
}
