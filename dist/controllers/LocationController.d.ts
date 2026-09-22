import { APIClient } from '../api/APIClient.js';
export interface Place {
    placeID: string;
    uniqRef: string;
    slug: string;
    authorID: string;
    country: string;
    region: string;
    pstate: string;
    city: string;
    postalCode: string;
    placeKind: string;
    addressLine1: string;
    addressLine2: string;
    coordinates: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export interface CreatePlaceInput {
    state?: string | null;
    postalCode?: string | null;
    placeKind?: string | null;
    country?: string | null;
    addressLine1?: string | null;
    city?: string | null;
    authorID?: number | string;
}
export interface UpdatePlaceInput {
    country?: string;
    region?: string;
    pstate?: string;
    city?: string;
    postalCode?: string;
    placeKind?: string;
    addressLine1?: string;
    addressLine2?: string;
    coordinates?: string;
    state?: string;
}
/**
 * The `Location` class manages place-related requests within the application.
 */
export declare class Location {
    private client;
    constructor(client: APIClient);
    /**
     * Fetches a single place by its ID.
     */
    getById(placeId: string): Promise<Place>;
    /**
     * Creates a new place with the specified input.
     */
    createPlace(input: CreatePlaceInput): Promise<Place>;
    /**
     * Updates an existing place by its ID with the specified input.
     */
    updatePlace(placeId: string, input: UpdatePlaceInput): Promise<Place>;
}
