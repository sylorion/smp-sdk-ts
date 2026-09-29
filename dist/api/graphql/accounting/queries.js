// =========================================
// Source: accounting/estimateQueries.ts
// =========================================
// smp-sdk-ts/src/api/graphql/queries/estimateQueries.js
const estimateQueries = {
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
          documentPresentation
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
};
export { invoiceQueries };
// =========================================
// Source: accounting/transactionQueries.ts
// =========================================
// smp-sdk-ts/src/api/graphql/queries/transactionQueries.js
const transactionQueries = {
    // Transaction par identifiant — mu-billing : transaction(input: TransactionIdInput!)
    GET_TRANSACTION_BY_ID: `
      query GetTransaction($input: TransactionIdInput!) {
        transaction(input: $input) {
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
    // ── Usage des jetons plateforme (STK) — mu-wallet TokenUsageModule ──
    TOKEN_USAGE_SUMMARY: `
    query TokenUsageSummary($walletId: ID, $userId: ID, $organizationId: ID) {
      tokenUsageSummary(walletId: $walletId, userId: $userId, organizationId: $organizationId) {
        walletId
        userId
        organizationId
        dailyAllowance
        dailyRemaining
        dailyUsedToday
        tokensDaily
        tokensFree
        tokensPaid
        tokensRevenue
        totalAvailable
        consumedToday
        consumedLast30Days
        nextDailyRefreshAt
        byAgentToday { agentKey calls tokens llmInputTokens llmOutputTokens }
        byAgentLast30Days { agentKey calls tokens llmInputTokens llmOutputTokens }
        recent { tokenUsageId walletId kind agentKey action amount baseCost llmCost llmInputTokens llmOutputTokens llmModel referenceType referenceId createdAt metadata }
      }
    }
  `,
    TOKEN_USAGE_HISTORY: `
    query TokenUsageHistory($walletId: ID, $userId: ID, $organizationId: ID, $limit: Int, $kinds: [String!]) {
      tokenUsageHistory(walletId: $walletId, userId: $userId, organizationId: $organizationId, limit: $limit, kinds: $kinds) {
        tokenUsageId walletId kind agentKey action amount baseCost llmCost llmInputTokens llmOutputTokens llmModel referenceType referenceId createdAt metadata
      }
    }
  `,
    TOKEN_COST_ESTIMATE: `
    query TokenCostEstimate($agentKey: String!, $llmInputTokens: Int, $llmOutputTokens: Int) {
      tokenCostEstimate(agentKey: $agentKey, llmInputTokens: $llmInputTokens, llmOutputTokens: $llmOutputTokens) {
        agentKey
        baseCost
        llmCost
        total
        llmTokensPerPlatformToken
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
    // Réalisation d'un service par un agent (mu-command), suivie depuis la page de commande.
    GET_AGENT_EXECUTION_STATUS: `
    query AgentExecutionStatus($orderId: ID!) {
      agentExecutionStatus(orderId: $orderId) {
        orderId
        engagementId
        executionId
        agentId
        status
        error
        attempts
        startedAt
        completedAt
        result
      }
    }
  `,
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
    GET_CONTRACT_BY_INVITATION_TOKEN: `
    query GetContractByInvitationToken($token: String!) {
      getContractByInvitationToken(token: $token) {
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
    GET_ORGANIZATION_CONTRACT_TEMPLATES: `
    query OrganizationContractTemplates($organizationId: String!) {
      organizationContractTemplates(organizationId: $organizationId) {
        templateId
        organizationId
        name
        description
        baseTemplateId
        content
        defaultValues
        usageCount
        createdAt
        updatedAt
      }
    }
  `,
    GET_ORGANIZATION_CONTRACT_TEMPLATE: `
    query OrganizationContractTemplate($templateId: String!) {
      organizationContractTemplate(templateId: $templateId) {
        templateId
        organizationId
        name
        description
        baseTemplateId
        content
        defaultValues
        usageCount
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
        language
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
        language
        version
        sections
        variables
        legalAlerts
        partyRoles
      }
    }
  `,
    GET_ORGANIZATION_SIGNATURE_SETTINGS: `
    query OrganizationSignatureSettings($organizationId: ID!) {
      organizationSignatureSettings(organizationId: $organizationId) {
        organizationId
        defaultSignerUserId
        signers { userId name title hasSignature signatureImage updatedAt }
        stampUrl
        countersignDelayHours
        autoCountersign
        autoCountersignEnabledBy
        autoCountersignEnabledAt
        updatedAt
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
