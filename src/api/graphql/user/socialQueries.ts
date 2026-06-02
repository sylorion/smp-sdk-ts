import { gql } from 'graphql-request';

export const socialQueries = {
  GET_INTERACTION_STATUS: gql`
    query GetInteractionStatus($userID: String!, $serviceID: String!) {
      interactionStatus(userID: $userID, serviceID: $serviceID) {
        isLiked
        isFavorited
        likesCount
      }
    }
  `,
};
