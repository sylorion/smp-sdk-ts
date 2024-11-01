// smp-sdk-ts/src/api/graphql/queries/invoiceQueries.js

const invoiceQueries = {
    // QUERY TO GET AN INVOICE BY ITS UNIQUE ID
    GET_INVOICE_BY_ID: `
      query invoice($invoiceID: ID!) {
        invoice(invoiceID: $invoiceID) {
          invoiceID
          uniqRef
          slug
          estimateID
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          paymentStatus
          emitDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE INVOICES BY AN ARRAY OF INVOICE IDS
    GET_INVOICES_BY_IDS: `
      query invoiceByIDs($invoiceIDs: [ID!]!) {
        invoicesByIDs(invoiceIDs: $invoiceIDs) {
          invoiceID
          uniqRef
          slug
          estimateID
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          paymentStatus
          emitDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET AN INVOICE BY ITS UNIQUE REFERENCE
    GET_INVOICE_BY_UNIQ_REF: `
      query invoiceByUniqRef($uniqRef: String!) {
        invoiceByUniqRef(uniqRef: $uniqRef) {
          invoiceID
          uniqRef
          slug
          estimateID
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          paymentStatus
          emitDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET AN INVOICE BY ITS SLUG
    GET_INVOICE_BY_SLUG: `
      query invoiceBySlug($slug: String!) {
        invoiceBySlug(slug: $slug) {
          invoiceID
          uniqRef
          slug
          estimateID
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          paymentStatus
          emitDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE INVOICES BY SLUGS
    GET_INVOICES_BY_SLUGS: `
      query invoiceBySlugs($slugs: [String!]!) {
        invoicesBySlugs(slugs: $slugs) {
          invoiceID
          uniqRef
          slug
          estimateID
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          paymentStatus
          emitDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // QUERY TO LIST INVOICES WITH OPTIONAL PAGINATION, SORTING, AND FILTERING
    GET_INVOICES: `
      query invoices($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        invoices(pagination: $pagination, sort: $sort, filter: $filter) {
          invoiceID
          uniqRef
          slug
          estimateID
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          paymentStatus
          emitDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `
  };
  
  export { invoiceQueries };
  