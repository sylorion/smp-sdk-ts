import { APIClient } from '../../api/APIClient.js';
import { socialMutations } from '../../api/graphql/user/socialMutations.js';
import { socialQueries } from '../../api/graphql/user/socialQueries.js';

export interface InteractionStatus {
  isLiked: boolean;
  isFavorited: boolean;
  likesCount?: number;
}

export class Social {
  private client: APIClient;

  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Toggle like for a service
   */
  async toggleLike(userID: string, serviceID: string): Promise<boolean> {
    const mutation = socialMutations.TOGGLE_LIKE;
    const variables = { userID, serviceID };
    const response = await this.client.mutate(mutation, variables) as { toggleLike: boolean };
    return response.toggleLike;
  }

  /**
   * Toggle favorite for a service
   */
  async toggleFavorite(userID: string, serviceID: string): Promise<boolean> {
    const mutation = socialMutations.TOGGLE_FAVORITE;
    const variables = { userID, serviceID };
    const response = await this.client.mutate(mutation, variables) as { toggleFavorite: boolean };
    return response.toggleFavorite;
  }

  /**
   * Get interaction status (liked/favorited) for a user on a service
   */
  async getStatus(userID: string, serviceID: string): Promise<InteractionStatus> {
    const query = socialQueries.GET_INTERACTION_STATUS;
    const variables = { userID, serviceID };
    const response = await this.client.query(query, variables) as { interactionStatus: InteractionStatus };
    return response.interactionStatus;
  }
}
