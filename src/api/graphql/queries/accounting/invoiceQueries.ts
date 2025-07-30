// smp-sdk-ts/src/api/graphql/queries/accounting/invoiceQueries.ts

const invoiceQueries = {
    // QUERY TO GET AN INVOICE BY ITS UNIQUE ID
    GET_INVOICE_BY_ID: `
      query GetInvoice($invoiceId: String!) {
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
          disclaimers
          paymentTerms
          profile
          header {
            id
            invoiceNumber
            name
            invoiceDate
            issueDate
            typeCode
            notes {
              heading
              note
            }
          }
          seller {
            name
            postalAddress {
              line1
              city
              postalCode
              countryCode
              line2
            }
            vatNumber
            contacts {
              contactName
              contactEmail
              contactPhoneNumber
              divisionName
            }
          }
          buyer {
            name
            postalAddress {
              line1
              city
              postalCode
              countryCode
              line2
            }
            vatNumber
            contacts {
              contactName
              contactEmail
              contactPhoneNumber
              divisionName
            }
          }
          payment {
            paymentMeansCode
            payeeIBAN
            payeeBIC
            dueDate
            paymentTermsText
          }
          lines {
            id
            description
            quantity
            unitPrice
            vatRate
            taxCategoryCode
            unitCode
            allowances
            charges {
              chargeIndicator
              actualAmount
              reason
              reasonCode
              taxRate
              taxCategoryCode
              startDate
              endDate
              percentage
            }
          }
          deliveryParty {
            name
            postalAddress {
              line1
              city
              postalCode
              countryCode
              line2
            }
            vatNumber
            contacts {
              contactName
              contactEmail
              contactPhoneNumber
              divisionName
            }
          }
          payeeParty {
            name
            postalAddress {
              line1
              city
              postalCode
              countryCode
              line2
            }
            vatNumber
            contacts {
              contactName
              contactEmail
              contactPhoneNumber
              divisionName
            }
          }
          buyerOrganizationId
          additionalDocuments {
            documentTypeCode
            id
            name
            attachmentPath
          }
          docAllowanceCharges {
            chargeIndicator
            actualAmount
            reason
            reasonCode
            taxRate
            taxCategoryCode
            startDate
            endDate
            percentage
          }
          currency
          taxTotals {
            taxCategory
            taxRate
            taxableAmount
            taxAmount
          }
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE INVOICES BY AN ARRAY OF INVOICE IDS
    GET_INVOICES_BY_IDS: `
      query GetInvoicesByIDs($invoiceIDs: [ID!]!) {
        invoicesByIDs(invoiceIDs: $invoiceIDs) {
          invoiceID
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
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
        }
      }
    `,
  

  
    // QUERY TO GET AN INVOICE BY ITS SLUG
    GET_INVOICE_BY_SLUG: `
      query GetInvoiceBySlug($slug: String!) {
        invoiceBySlug(slug: $slug) {
          invoiceID
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
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
        }
      }
    `,
  
    // QUERY TO GET MULTIPLE INVOICES BY SLUGS
    GET_INVOICES_BY_SLUGS: `
      query GetInvoicesBySlugs($slugs: [String!]!) {
        invoicesBySlugs(slugs: $slugs) {
          invoiceID
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
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
        }
      }
    `,
  
    // QUERY TO LIST INVOICES WITH OPTIONAL PAGINATION, SORTING, AND FILTERING
    GET_INVOICES: `
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
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
        }
      }
    `,

    // QUERY TO GET INVOICES BY SELLER ORGANIZATION
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
          disclaimers
          paymentTerms
          profile
          currency
        }
      }
    `,

    // QUERY TO GET INVOICES BY BUYER ORGANIZATION
    GET_INVOICES_BY_BUYER: `
      query GetInvoicesByBuyer($buyerOrganizationId: String!) {
        invoicesByBuyer(buyerOrganizationId: $buyerOrganizationId) {
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
          buyerUserId
          paymentStatus
          emittedDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
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
          buyerUserId
          paymentStatus
          emittedDate
          dueDate
          digitalSignature
          state
          createdAt
          updatedAt
          deletedAt
          downloadStatus {
            downloaded
            downloadedAt
            downloadCount
            ipAddress
          }
          pdfGeneratedAt
          pdfHash
        }
      }
    `
};

export { invoiceQueries };
  