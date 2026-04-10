import { gql } from 'graphql-request';

export const socialMutations = {
  TOGGLE_LIKE: gql`
    mutation ToggleLike($userID: ID!, $serviceID: ID!) {
      toggleLike(userID: $userID, serviceID: $serviceID)
    }
  `,
  TOGGLE_FAVORITE: gql`
    mutation ToggleFavorite($userID: ID!, $serviceID: ID!) {
      toggleFavorite(userID: $userID, serviceID: $serviceID)
    }
  `,
};
