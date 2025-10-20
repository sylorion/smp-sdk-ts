// smp-sdk-ts/src/api/graphql/queries/accounting/invoiceQueries.ts

const invoiceQueries = {
    // QUERY TO GET AN INVOICE BY ITS UNIQUE ID
    GET_INVOICE_BY_ID: `
      query Invoice($invoiceId: String!) {
        invoice(invoiceId: $invoiceId) {
          invoiceId
          transactionId
          slug
          orderId
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          sellerOrganizationId
          paymentStatus
          emittedDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          buyerOrganizationId
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
          pdfGeneratedAt
          pdfHash
          downloadStatus
          additionalInfo
        }
      }
    `,

    // QUERY TO GET ALL INVOICES
    GET_ALL_INVOICES: `
      query GetInvoices {
        invoices {
          invoiceId
          transactionId
          slug
          orderId
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          sellerOrganizationId
          paymentStatus
          emittedDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
          transactionData
          notes
          paymentTerms
          profile
        }
      }
    `,

    // QUERY TO GET INVOICES BY SELLER
    GET_INVOICES_BY_SELLER: `
      query GetInvoicesBySeller($sellerOrganizationId: String!) {
        invoicesBySeller(sellerOrganizationId: $sellerOrganizationId) {
          invoiceId
          transactionId
          slug
          orderId
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          sellerOrganizationId
          paymentStatus
          emittedDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          buyerOrganizationId
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
          pdfGeneratedAt
          pdfHash
          downloadStatus
          additionalInfo
        }
      }
    `,

    // QUERY TO GET INVOICES BY BUYER
    GET_INVOICES_BY_BUYER: `
      query GetInvoicesByBuyer($buyerOrganizationId: String!) {
        invoicesByBuyer(buyerOrganizationId: $buyerOrganizationId) {
          invoiceId
          transactionId
          slug
          orderId
          totalAmount
          sellerOrganizationId
          buyerOrganizationId
          buyerUserId
          paymentStatus
          emittedDate
          dueDate
          state
          createdAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
        }
      }
    `,

    // QUERY TO GET INVOICES BY BUYER USER
    GET_INVOICES_BY_BUYER_USER: `
      query GetInvoicesByBuyerUser($buyerUserId: String!) {
        invoicesByBuyerUser(buyerUserId: $buyerUserId) {
          invoiceId
          transactionId
          slug
          orderId
          thirdPartyFees
          servicesFees
          servicesVatPercent
          prestationsVatPercent
          totalAmount
          sellerOrganizationId
          buyerOrganizationId
          paymentStatus
          emittedDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
        }
      }
    `,

    // QUERY TO GET INVOICE BY SLUG
    GET_INVOICE_BY_SLUG: `
      query GetInvoiceBySlug($slug: String!) {
        invoiceBySlug(slug: $slug) {
          invoiceId
          transactionId
          slug
          orderId
          totalAmount
          sellerOrganizationId
          buyerOrganizationId
          buyerUserId
          paymentStatus
          emittedDate
          dueDate
          state
          createdAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
        }
      }
    `,

    // QUERY TO GET INVOICES BY SLUGS
    GET_INVOICES_BY_SLUGS: `
      query GetInvoicesBySlugs($slugs: [String!]!) {
        invoicesBySlugs(slugs: $slugs) {
          invoiceId
          transactionId
          slug
          orderId
          totalAmount
          sellerOrganizationId
          buyerOrganizationId
          buyerUserId
          paymentStatus
          emittedDate
          dueDate
          state
          createdAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
        }
      }
    `,

    // QUERY TO GET INVOICES BY IDs
    GET_INVOICES_BY_IDS: `
      query GetInvoicesByIds($invoiceIds: [String!]!) {
        invoicesByIds(invoiceIds: $invoiceIds) {
          invoiceId
          transactionId
          slug
          orderId
          totalAmount
          sellerOrganizationId
          buyerOrganizationId
          buyerUserId
          paymentStatus
          emittedDate
          dueDate
          state
          createdAt
          transactionData
          notes
          paymentTerms
          profile
          header
          seller
          buyer
          payment
          lines
          deliveryParty
          payeeParty
          additionalDocuments
          docAllowanceCharges
          currency
          taxTotals
        }
      }
    `,

  // QUERY TO GET INVOICE PDF SECURE URL
  GET_INVOICE_PDF_URL: `
    query GetInvoicePDFUrl($invoiceId: String!, $input: GetInvoicePDFUrlInput!) {
      getInvoicePDFUrl(invoiceId: $invoiceId, input: $input) {
        success
        downloadUrl
        isAlreadyDownloaded
        downloadCount
        expiresAt
      }
    }
  `
};

export { invoiceQueries };
  