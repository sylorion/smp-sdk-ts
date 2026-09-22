import { APIClient } from '../api/APIClient.js';
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
export declare class Topic {
    private client;
    constructor(client: APIClient);
    list(): Promise<TopicEntity[]>;
    getById(topicID: string): Promise<TopicEntity>;
}
