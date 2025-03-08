// smp-sdk-ts/src/api/graphql/queries/transactionQueries.js

const transactionQueries = {
    // QUERY TO GET A LIST OF TRANSACTIONS WITH OPTIONAL PAGINATION, SORTING, AND FILTERING
    GET_TRANSACTIONS: `
      query transactions($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        transactions(pagination: $pagination, sort: $sort, filter: $filter) {
          transactionID
          uniqRef
          slug
          buyerUserID
          sellerOrganizationID
          invoiceID
          totalAmount
          dealMediaProofID
          transactionDateTime
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET A SINGLE TRANSACTION BY ITS UNIQUE ID
    GET_TRANSACTION_BY_ID: `
      query transaction($transactionId: ID!) {
        transactionByID(transactionID: $transactionID) {
          transactionID
          uniqRef
          slug
          buyerUserID
          sellerOrganizationID
          invoiceID
          totalAmount
          dealMediaProofID
          transactionDateTime
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE TRANSACTIONS BY AN ARRAY OF TRANSACTION IDS
    GET_TRANSACTIONS_BY_IDS: `
      query transactionsByIDs($transactionIDs: [ID!]!) {
        transactionsByIDs(transactionIDs: $transactionIDs) {
          transactionID
          uniqRef
          slug
          buyerUserID
          sellerOrganizationID
          invoiceID
          totalAmount
          dealMediaProofID
          transactionDateTime
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET A TRANSACTION BY ITS UNIQUE REFERENCE
    GET_TRANSACTION_BY_UNIQ_REF: `
      query transactionByUniqRef($uniqRef: String!) {
        transactionByUniqRef(uniqRef: $uniqRef) {
          transactionID
          uniqRef
          slug
          buyerUserID
          sellerOrganizationID
          invoiceID
          totalAmount
          dealMediaProofID
          transactionDateTime
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET A TRANSACTION BY ITS SLUG
    GET_TRANSACTION_BY_SLUG: `
      query transactionBySlug($slug: String!) {
        transactionBySlug(slug: $slug) {
          transactionID
          uniqRef
          slug
          buyerUserID
          sellerOrganizationID
          invoiceID
          totalAmount
          dealMediaProofID
          transactionDateTime
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE TRANSACTIONS BY SLUGS
    GET_TRANSACTIONS_BY_SLUGS: `
      query transactionsBySlugs($slugs: [String!]!) {
        transactionsBySlugs(slugs: $slugs) {
          transactionID
          uniqRef
          slug
          buyerUserID
          sellerOrganizationID
          invoiceID
          totalAmount
          dealMediaProofID
          transactionDateTime
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `
  };
  
  export { transactionQueries };
  