import { gql } from 'graphql-request';

export const socialQueries = {
  GET_INTERACTION_STATUS: gql`
    query GetInteractionStatus($userID: ID!, $serviceID: ID!) {
      interactionStatus(userID: $userID, serviceID: $serviceID) {
        isLiked
        isFavorited
      }
    }
  `,
};
