import { gql } from 'graphql-request';

export const socialMutations = {
  TOGGLE_LIKE: gql`
    mutation ToggleLike($userID: String!, $serviceID: String!) {
      toggleLike(userID: $userID, serviceID: $serviceID)
    }
  `,
  TOGGLE_FAVORITE: gql`
    mutation ToggleFavorite($userID: String!, $serviceID: String!) {
      toggleFavorite(userID: $userID, serviceID: $serviceID)
    }
  `,
};
