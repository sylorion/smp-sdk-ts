
export const GET_SERVICE_BY_AUTHOR_ID = `
  query GetServicesByUserId($authorID: String!) {
    servicessByUserId(userID: $authorID) {
      serviceID
      authorID
      organizationID
      title
      slug
      uniqRef
    }
  }
`;

