import { gql } from 'graphql-request';

// =========================================
// Source: accounting/estimateAssetQueries.ts
// =========================================
// smp-sdk-ts/src/api/graphql/queries/estimateAssetQueries.js

const estimateAssetQueries = {
  // QUERY TO GET A LIST OF ESTIMATE ASSETS WITH OPTIONAL PAGINATION, SORTING, AND FILTERING
  GET_ESTIMATE_ASSETS: `
      query GetEstimateAssets($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        estimateAssets(pagination: $pagination, sort: $sort, filter: $filter) {
          estimateAssetID
          uniqRef
          slug
          legend
          assetID
          estimateID
          mandadtry
          initialPrice
          quantity
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // QUERY TO GET A SINGLE ESTIMATE ASSET BY ITS UNIQUE ID
  GET_ESTIMATE_ASSET_BY_ID: `
      query GetEstimateAssetByID($estimateAssetID: ID!) {
        estimateAssetByID(estimateAssetID: $estimateAssetID) {
          estimateAssetID
          uniqRef
          slug
          legend
          assetID
          estimateID
          mandadtry
          initialPrice
          quantity
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // QUERY TO GET MULTIPLE ESTIMATE ASSETS BY AN ARRAY OF ESTIMATE ASSET IDS
  GET_ESTIMATE_ASSETS_BY_IDS: `
      query GetEstimateAssetsByIDs($estimateAssetIDs: [ID!]!) {
        estimateAssetsByIDs(estimateAssetIDs: $estimateAssetIDs) {
          estimateAssetID
          uniqRef
          slug
          legend
          assetID
          estimateID
          mandadtry
          initialPrice
          quantity
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // QUERY TO GET AN ESTIMATE ASSET BY ITS UNIQUE REFERENCE
  GET_ESTIMATE_ASSET_BY_UNIQ_REF: `
      query GetEstimateAssetByUniqRef($uniqRef: String!) {
        estimateAssetByUniqRef(uniqRef: $uniqRef) {
          estimateAssetID
          uniqRef
          slug
          legend
          assetID
          estimateID
          mandadtry
          initialPrice
          quantity
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // QUERY TO GET AN ESTIMATE ASSET BY ITS SLUG
  GET_ESTIMATE_ASSET_BY_SLUG: `
      query GetEstimateAssetBySlug($slug: String!) {
        estimateAssetBySlug(slug: $slug) {
          estimateAssetID
          uniqRef
          slug
          legend
          assetID
          estimateID
          mandadtry
          initialPrice
          quantity
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // QUERY TO GET MULTIPLE ESTIMATE ASSETS BY SLUGS
  GET_ESTIMATE_ASSETS_BY_SLUGS: `
      query GetEstimateAssetsBySlugs($slugs: [String!]!) {
        estimateAssetsBySlugs(slugs: $slugs) {
          estimateAssetID
          uniqRef
          slug
          legend
          assetID
          estimateID
          mandadtry
          initialPrice
          quantity
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `
};

export { estimateAssetQueries };

// =========================================
// Source: accounting/estimateQueries.ts
// =========================================
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
      query GetEstimate($estimateId: String!) {
        estimate(id: $estimateId) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
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
        }
      }
    `,

  CREATE_ESTIMATE: `
      mutation CreateEstimate($data: CreateEstimateInput!) {
        createEstimate(data: $data) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
        }
      }
    `,

  UPDATE_ESTIMATE: `
      mutation UpdateEstimate($estimateId: EstimateIdInput!, $updateEstimateInput: UpdateEstimateInput!) {
        updateEstimate(estimateId: $estimateId, updateEstimateInput: $updateEstimateInput) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
        }
      }
    `,

  VALIDATE_ESTIMATE: `
      mutation ValidateEstimate($data: ValidateEstimateInput!) {
        validateEstimate(data: $data) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
        }
      }
    `,

  GET_ESTIMATES_BY_BUYER_USER_ID: `
      query GetEstimatesByBuyerUserId($buyerUserId: String!) {
        estimatesByBuyerUserId(buyerUserId: $buyerUserId) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
        }
      }
    `,

  GET_ESTIMATES_BY_BUYER_ORGANIZATION_ID: `
      query GetEstimatesByBuyerOrganizationId($buyerOrganizationId: String!) {
        estimatesByBuyerOrganizationId(buyerOrganizationId: $buyerOrganizationId) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
        }
      }
    `,

  GET_ESTIMATES_BY_SELLER_ORGANIZATION_ID: `
      query GetEstimatesBySellerOrganizationId($sellerOrganizationId: String!) {
        estimatesBySellerOrganizationId(sellerOrganizationId: $sellerOrganizationId) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationCount
          clientSignDate
          providerSignDate
          createdAt
          updatedAt
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
        }
      }
    `,

  // Query all estimates from mu-contract (used for viewToken resolution)
  GET_ALL_MU_CONTRACT_ESTIMATES: `
      query GetAllEstimates {
        estimates {
          estimateId
          status
          details
        }
      }
    `,

  // Negotiation Queries
  GET_NEGOTIATION_HISTORY: `
      query GetNegotiationHistory($estimateId: String!) {
        getNegotiationHistory(estimateId: $estimateId) {
          id
          estimateId
          proposedPrice
          details
          iterationCount
          status
          proposedBy
          createdAt
          updatedAt
        }
      }
    `,

  GET_CURRENT_NEGOTIATION: `
      query GetCurrentNegotiation($estimateId: String!) {
        getCurrentNegotiation(estimateId: $estimateId) {
          id
          estimateId
          proposedPrice
          details
          iterationCount
          status
          proposedBy
          createdAt
          updatedAt
        }
      }
    `,

  // Negotiation Mutations
  CREATE_NEGOTIATION: `
      mutation CreateNegotiation($input: CreateNegotiationInput!) {
        createNegotiation(input: $input) {
          estimate {
            estimateId
            serviceId
            proposalPrice
            details
            status
            negotiationStatus
            currentNegotiationId
            buyerUserId
            buyerOrganizationId
            sellerOrganizationId
            createdAt
            updatedAt
          }
          negotiation {
            id
            estimateId
            proposedPrice
            details
            iterationCount
            status
            proposedBy
            createdAt
            updatedAt
          }
        }
      }
    `,

  ACCEPT_NEGOTIATION: `
      mutation AcceptNegotiation($estimateId: String!) {
        acceptNegotiation(estimateId: $estimateId) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationStatus
          currentNegotiationId
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
          createdAt
          updatedAt
        }
      }
    `,

  REJECT_NEGOTIATION: `
      mutation RejectNegotiation($estimateId: String!) {
        rejectNegotiation(estimateId: $estimateId) {
          estimateId
          serviceId
          proposalPrice
          details
          status
          negotiationStatus
          currentNegotiationId
          buyerUserId
          buyerOrganizationId
          sellerOrganizationId
          createdAt
          updatedAt
        }
      }
    `
};

export { estimateQueries };

// =========================================
// Source: accounting/invoiceQueries.ts
// =========================================
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

// =========================================
// Source: accounting/transactionQueries.ts
// =========================================
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
    `,

  GET_TRANSACTIONS_BY_BUYER_USER_ID: `
      query GetTransactionsByBuyerUserId($buyerUserId: String!) {
        transactionsByBuyerUserId(buyerUserId: $buyerUserId) {
          transactionId
          serviceId
          slug
          buyerUserId
          buyerOrganizationId
          sellerUserContactId
          sellerOrganizationId
          currency
          totalAmount
          state
          status
          metadata
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  GET_TRANSACTIONS_BY_BUYER_ORGANIZATION_ID: `
      query GetTransactionsByBuyerOrganizationId($buyerOrganizationId: String!) {
        transactionsByBuyerOrganizationId(buyerOrganizationId: $buyerOrganizationId) {
          transactionId
          serviceId
          slug
          buyerUserId
          buyerOrganizationId
          sellerUserContactId
          sellerOrganizationId
          currency
          totalAmount
          state
          status
          metadata
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  GET_TRANSACTIONS_BY_SELLER_ORGANIZATION_ID: `
      query GetTransactionsBySellerOrganizationId($sellerOrganizationId: String!) {
        transactionsBySellerOrganizationId(sellerOrganizationId: $sellerOrganizationId) {
          transactionId
          serviceId
          slug
          buyerUserId
          buyerOrganizationId
          sellerUserContactId
          sellerOrganizationId
          currency
          totalAmount
          state
          status
          metadata
          createdAt
          updatedAt
          deletedAt
        }
      }
    `
};

export { transactionQueries };

// =========================================
// Source: wallet/walletQueries.ts
// =========================================
const walletQueries = {
  GET_WALLET_BY_ID: `
    query GetWallet($id: String!) {
      wallet(id: $id) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_WALLETS: `
    query GetWallets($userId: String!, $organizationId: String!) {
      wallets(userId: $userId, organizationId: $organizationId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_WALLETS_BY_USER: `
    query GetWalletsByUser($userId: String!) {
      walletsByUser(userId: $userId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_WALLETS_BY_ORGANIZATION: `
    query GetWalletsByOrganization($organizationId: String!) {
      walletsByOrganization(organizationId: $organizationId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_USER_WALLETS: `
    query GetUserWallets($userId: String!) {
      userWallets(userId: $userId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_ORGANIZATION_WALLETS: `
    query GetOrganizationWallets($organizationId: String!) {
      organizationWallets(organizationId: $organizationId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_ALL_WALLETS: `
    query GetAllWallets {
      allWallets {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
        externalProviderData
        publicAddress
      }
    }
  `,

  GET_CONVERSION_DETAILS: `
    query GetConversionDetails($data: ConversionDetailsInput!) {
      getConversionDetails(data: $data) {
        tokenAmount
        moneyAmount
        fee
        netAmount
        feePercentage
        currency
        success
        errorMessage
      }
    }
  `,

  GET_STRIPE_CONNECT_STATUS: `
    query GetStripeConnectStatus($organizationID: String!, $forceRefresh: Boolean) {
      stripeConnectStatus(organizationID: $organizationID, forceRefresh: $forceRefresh) {
        stripeAccountId
        onboardingCompleted
        chargesEnabled
        payoutsEnabled
        detailsSubmitted
        requirements
        connectedAt
        lastStatusCheck
        blockingRequirements
        eventuallyRequirements
        disabledReason
      }
    }
  `,

  WALLET_LEDGER_HISTORY: `
    query WalletLedgerHistory($walletId: String!, $accountType: String, $limit: Float) {
      walletLedgerHistory(walletId: $walletId, accountType: $accountType, limit: $limit) {
        ledgerEntryId
        accountType
        accountId
        entryType
        amount
        currency
        balanceAfter
        createdAt
        transaction {
          ledgerTransactionId
          referenceType
          referenceId
          description
          createdAt
        }
      }
    }
  `,
};

export { walletQueries };

// =========================================
// Source: order/orderQueries.ts
// =========================================
export const orderQueries = {
  GET_ORDER_BY_ID: `
    query GetOrder($orderId: String!) {
      order(orderId: $orderId) {
        orderId
        userId
        sellerOrganizationId
        buyerOrganizationId
        transactionId
        destinationWalletId
        sourceWalletId
        currency
        estimateId
        serviceId
        status
        totalPrice
        createdAt
        updatedAt
        deletedAt
        billingInformation
        lines {
          assetId
          quantity
          unitPrice
          details
          title
          description
          legalVatPercent
        }
      }
    }
  `,

  GET_ORDERS_BY_USER_ID: `
    query GetOrdersByUserId($userId: String!) {
      ordersByUser(userId: $userId) {
        orderId
        userId
        sellerOrganizationId
        buyerOrganizationId
        transactionId
        destinationWalletId
        sourceWalletId
        currency
        estimateId
        serviceId
        status
        totalPrice
        createdAt
        updatedAt
        deletedAt
        billingInformation
        lines {
          assetId
          quantity
          unitPrice
          details
          title
          description
          legalVatPercent
        }
      }
    }
  `,

  GET_ORDERS_BY_SELLER_ORGANIZATION_ID: `
    query GetOrdersBySellerOrganizationId($sellerOrganizationId: String!) {
      ordersBySellerOrganization(sellerOrganizationId: $sellerOrganizationId) {
        orderId
        userId
        sellerOrganizationId
        buyerOrganizationId
        transactionId
        destinationWalletId
        sourceWalletId
        currency
        estimateId
        serviceId
        status
        totalPrice
        createdAt
        updatedAt
        deletedAt
        billingInformation
        lines {
          assetId
          quantity
          unitPrice
          details
          title
          description
          legalVatPercent
        }
      }
    }
  `,

  GET_ORDERS_BY_BUYER_ORGANIZATION_ID: `
    query GetOrdersByBuyerOrganizationId($buyerOrganizationId: String!) {
      ordersByBuyerOrganization(buyerOrganizationId: $buyerOrganizationId) {
        orderId
        userId
        sellerOrganizationId
        buyerOrganizationId
        transactionId
        destinationWalletId
        sourceWalletId
        currency
        estimateId
        serviceId
        status
        totalPrice
        createdAt
        updatedAt
        deletedAt
        billingInformation
        lines {
          assetId
          quantity
          unitPrice
          details
          title
          description
          legalVatPercent
        }
      }
    }
  `
};

// =========================================
// Source: contract/contractQueries.ts
// =========================================
const contractQueries = {
  GET_CONTRACT_BY_ID: `
    query GetContract($getContractId: String!) {
      getContract(id: $getContractId) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_ALL_CONTRACTS: `
    query GetAllContracts {
      getContracts {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACTS_BY_ORGANIZATION_ID: `
    query GetContractsByOrganizationId($organizationId: String!) {
      getContractsByOrganizationId(organizationId: $organizationId) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACT_TEMPLATES: `
    query GetContractTemplates {
      getContractTemplates {
        id
        title
        description
        category
        style
        variableKeys
      }
    }
  `,

  GET_CONTRACT_TEMPLATE: `
    query GetContractTemplate($templateId: String!) {
      getContractTemplate(templateId: $templateId) {
        id
        title
        description
        category
        style
        variableKeys
      }
    }
  `,
};

export { contractQueries };

// =========================================
// Source: wallet/withdrawalQueries.ts
// =========================================
const withdrawalQueries = {
  GET_WITHDRAWAL: `
    query GetWithdrawal($withdrawalRequestId: String!) {
      withdrawalRequest(withdrawalRequestId: $withdrawalRequestId) {
        withdrawalRequestId
        walletId
        userId
        organizationId
        amount
        feeAmount
        netAmount
        currency
        status
        paymentMethodId
        destinationIbanHash
        submittedBy
        approvedBy
        approvedAt
        rejectionReason
        externalPayoutId
        externalPayoutStatus
        completedAt
        createdAt
        updatedAt
        events {
          withdrawalEventId
          eventType
          actorId
          actorRole
          previousStatus
          newStatus
          note
          metadataJson
          createdAt
        }
      }
    }
  `,

  LIST_WITHDRAWALS: `
    query ListWithdrawals($walletId: String, $organizationId: String, $status: String, $limit: Int, $offset: Int) {
      withdrawalRequests(walletId: $walletId, organizationId: $organizationId, status: $status, limit: $limit, offset: $offset) {
        withdrawalRequestId
        walletId
        userId
        organizationId
        amount
        feeAmount
        netAmount
        currency
        status
        paymentMethodId
        submittedBy
        approvedBy
        approvedAt
        rejectionReason
        completedAt
        createdAt
        updatedAt
        events {
          withdrawalEventId
          eventType
          actorId
          newStatus
          metadataJson
          createdAt
        }
      }
    }
  `,
};

export { withdrawalQueries };
