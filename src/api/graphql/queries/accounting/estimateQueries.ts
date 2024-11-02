// smp-sdk-ts/src/api/graphql/queries/estimateQueries.js

const estimateQueries = {
    GET_ESTIMATES: `
      query GetEstimates($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        estimates(pagination: $pagination, sort: $sort, filter: $filter) {
          estimateID
          uniqRef
          slug
          authorID
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          comment
          negociatedPrice
          discountID
          propositionCount
          lastProposition
          stage
          state
          createdAt
          updatedAt
        }
      }
    `,
  
    GET_ESTIMATE_BY_ID: `
      query GetEstimateByID($estimateID: String!) {
        estimate(estimateID: $estimateID) {
          estimateID
          uniqRef
          slug
          authorID
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          comment
          negociatedPrice
          discountID
          propositionCount
          lastProposition
          stage
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    GET_ESTIMATE_BY_UNIQ_REF: `
      query GetEstimateByUniqRef($uniqRef: String!) {
        estimateByUniqRef(uniqRef: $uniqRef) {
          estimateID
          uniqRef
          slug
          authorID
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          comment
          negociatedPrice
          discountID
          propositionCount
          lastProposition
          stage
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    GET_ESTIMATE_BY_SLUG: `
      query GetEstimateBySlug($slug: String!) {
        estimateBySlug(slug: $slug) {
          estimateID
          uniqRef
          slug
          authorID
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          comment
          negociatedPrice
          discountID
          propositionCount
          lastProposition
          stage
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    GET_ESTIMATES_BY_IDS: `
      query GetEstimatesByIDs($estimateIDs: [String!]!) {
        estimatesByIDs(estimateIDs: $estimateIDs) {
          estimateID
          uniqRef
          slug
          authorID
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          comment
          negociatedPrice
          discountID
          propositionCount
          lastProposition
          stage
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    GET_ESTIMATES_BY_SLUGS: `
      query GetEstimatesBySlugs($slugs: [String!]!) {
        estimatesBySlugs(slugs: $slugs) {
          estimateID
          uniqRef
          slug
          authorID
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          comment
          negociatedPrice
          discountID
          propositionCount
          lastProposition
          stage
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
}
  
    
  
  export { estimateQueries };
  