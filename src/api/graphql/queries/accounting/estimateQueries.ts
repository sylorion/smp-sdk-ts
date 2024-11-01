// smp-sdk-ts/src/api/graphql/queries/estimateQueries.js

const estimateQueries = {
    GET_ESTIMATES: `
      query estimates($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
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
      query estimate($estimateID: String!) {
        estimateByID(estimateID: $estimateID) {
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
      query estimateByUniqRef($uniqRef: String!) {
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
      query estimateBySlug($slug: String!) {
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
      query estimatesByIDs($estimateIDs: [String!]!) {
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
      query estimatesBySlugs($slugs: [String!]!) {
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
  