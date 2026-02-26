export const topicQueries = {
    GET_TOPICS: `
    query GetTopics {
      topics {
        topicID
        authorID
        title
        description
        parentTopicID
        level
        state
        createdAt
        updatedAt
      }
    }
  `,
    GET_TOPIC_BY_ID: `
    query GetTopic($topicID: ID!) {
      topic(topicID: $topicID) {
        topicID
        authorID
        title
        description
        parentTopicID
        level
        state
        createdAt
        updatedAt
      }
    }
  `,
};
