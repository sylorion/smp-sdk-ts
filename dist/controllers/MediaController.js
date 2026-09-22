import { mediaMutations } from '../api/graphql/mutations/document/mediaMutation.js';
import { mediaQueries } from '../api/graphql/queries/document/mediaQueries.js';
/**
 * The `Media` class manages media-related requests within the application.
 * Provides methods to create, update, delete, and retrieve media files.
 */
export class Media {
    constructor(client) {
        this.client = client;
    }
    // ======================= MUTATIONS =======================
    async createMedia(input) {
        const mutation = mediaMutations.CREATE_MEDIA;
        const variables = { input };
        const response = await this.client.mutate(mutation, variables);
        return response.createMedia;
    }
    async updateMedia(mediaID, input) {
        const mutation = mediaMutations.UPDATE_MEDIA;
        const variables = { mediaID, input };
        const response = await this.client.mutate(mutation, variables);
        return response.updateMedia;
    }
    async deleteMedia(mediaID) {
        const mutation = mediaMutations.DELETE_MEDIA;
        const variables = { mediaID };
        const response = await this.client.mutate(mutation, variables);
        return response.deleteMedia;
    }
    // ======================= QUERIES =======================
    async getMedia(mediaID) {
        const query = mediaQueries.GET_MEDIA;
        const variables = { mediaID };
        const response = await this.client.query(query, variables);
        return response.media;
    }
    async list(pagination, sort, filter) {
        const query = mediaQueries.GET_MEDIAS;
        const variables = { pagination, sort, filter };
        const response = await this.client.query(query, variables);
        return response.medias;
    }
    async getMediaBySlug(slug) {
        const query = mediaQueries.GET_MEDIA_BY_SLUG;
        const variables = { slug };
        const response = await this.client.query(query, variables);
        return response.mediaBySlug;
    }
    async getMediasByIds(mediaIDs) {
        const query = mediaQueries.GET_MEDIAS_BY_IDS;
        const variables = { mediaIDs };
        const response = await this.client.query(query, variables);
        return response.mediasByIDs;
    }
    async getMediasBySlugs(slugs) {
        const query = mediaQueries.GET_MEDIAS_BY_SLUGS;
        const variables = { slugs };
        const response = await this.client.query(query, variables);
        return response.mediasBySlugs;
    }
    async getMediaByUniqRef(uniqRef) {
        const query = mediaQueries.GET_MEDIA_BY_UNIQ_REF;
        const variables = { uniqRef };
        const response = await this.client.query(query, variables);
        return response.mediaByUniqRef;
    }
}
