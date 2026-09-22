import { APIClient } from '../../api/APIClient.js';
export interface InteractionStatus {
    isLiked: boolean;
    isFavorited: boolean;
    likesCount?: number;
}
export declare class Social {
    private client;
    constructor(client: APIClient);
    /**
     * Toggle like for a service
     */
    toggleLike(userID: string, serviceID: string): Promise<boolean>;
    /**
     * Toggle favorite for a service
     */
    toggleFavorite(userID: string, serviceID: string): Promise<boolean>;
    /**
     * Get interaction status (liked/favorited) for a user on a service
     */
    getStatus(userID: string, serviceID: string): Promise<InteractionStatus>;
}
