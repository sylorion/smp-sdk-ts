import { topicQueries } from '../../api/graphql/catalog/queries.js';
export class Topic {
    constructor(client) {
        this.client = client;
    }
    async list() {
        const query = topicQueries.GET_TOPICS;
        const response = await this.client.query(query, {});
        return response.topics;
    }
    async getById(topicID) {
        const query = topicQueries.GET_TOPIC_BY_ID;
        const variables = { topicID };
        const response = await this.client.query(query, variables);
        return response.topic;
    }
}
