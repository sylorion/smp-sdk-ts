import { APIClient } from '../../api/APIClient.js';
import { topicQueries } from '../../api/graphql/catalog/queries.js';

export interface TopicEntity {
    topicID: string;
    authorID?: string;
    title?: string;
    description?: string;
    parentTopicID?: string;
    level?: number;
    state?: string;
    createdAt?: string;
    updatedAt?: string;
}

export class Topic {
    private client: APIClient;

    constructor(client: APIClient) {
        this.client = client;
    }

    async list(): Promise<TopicEntity[]> {
        const query = topicQueries.GET_TOPICS;
        const response = await this.client.query(query, {}) as { topics: TopicEntity[] };
        return response.topics;
    }

    async getById(topicID: string): Promise<TopicEntity> {
        const query = topicQueries.GET_TOPIC_BY_ID;
        const variables = { topicID };
        const response = await this.client.query(query, variables) as { topic: TopicEntity };
        return response.topic;
    }
}
