import { APIClient } from '../../api/APIClient.js';
interface CreateMediaInput {
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
interface UpdateMediaInput {
    legend?: string;
    summary?: string;
    originalName?: string;
    finalName?: string;
    metadata?: any;
    url?: string;
    size?: string;
    state?: string;
}
interface MediaEntity {
    mediaID: string;
    uniqRef: string;
    slug: string;
    authorID: string;
    mediaType: string;
    legend: string;
    summary: string;
    originalName: string;
    finalName: string;
    url: string;
    size: string;
    entityID: string;
    metadata: any;
    entityName: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
interface MutationResponse {
    success: boolean;
    message: string;
}
/**
 * The `Media` class manages media-related requests within the application.
 * Provides methods to create, update, delete, and retrieve media files.
 */
export declare class Media {
    private client;
    constructor(client: APIClient);
    create(input: CreateMediaInput): Promise<MediaEntity>;
    update(mediaID: string, input: UpdateMediaInput): Promise<MediaEntity>;
    delete(mediaID: string): Promise<MutationResponse>;
    getById(mediaID: string): Promise<MediaEntity>;
    list(pagination?: any, sort?: any, filter?: any[]): Promise<MediaEntity[]>;
    getBySlug(slug: string): Promise<MediaEntity>;
    getByIds(mediaIDs: string[]): Promise<MediaEntity[]>;
    getBySlugs(slugs: string[]): Promise<MediaEntity[]>;
    getByUniqRef(uniqRef: string): Promise<MediaEntity>;
}
export {};
