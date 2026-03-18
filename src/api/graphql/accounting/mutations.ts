import { gql } from 'graphql-request';

// =========================================
// Source: accounting/estimateMutation.ts
// =========================================

// =========================================
// Source: accounting/invoiceMutation.ts
// =========================================

// =========================================
// Source: accounting/invoiceMutations.ts
// =========================================
// smp-sdk-ts/src/api/graphql/mutations/accounting/invoiceMutations.ts

const invoiceMutations = {
  // MUTATION TO CREATE AN INVOICE
  CREATE_INVOICE: `
    mutation CreateInvoice($input: CreateInvoiceInput!) {
      createInvoice(input: $input) {
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

  // MUTATION TO UPDATE AN INVOICE
  UPDATE_INVOICE: `
    mutation UpdateInvoice($invoiceId: String!, $input: UpdateInvoiceInput!) {
      updateInvoice(invoiceId: $invoiceId, input: $input) {
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
      }
    }
  `,

  // MUTATION TO DELETE AN INVOICE
  DELETE_INVOICE: `
    mutation DeleteInvoice($invoiceId: String!) {
      deleteInvoice(invoiceId: $invoiceId) {
        invoiceId
        state
        deletedAt
      }
    }
  `,

  // MUTATION TO UPDATE INVOICE DOWNLOAD STATUS
  UPDATE_INVOICE_DOWNLOAD_STATUS: `
    mutation UpdateInvoiceDownloadStatus($invoiceId: String!, $input: UpdateInvoiceDownloadStatusInput!) {
      updateInvoiceDownloadStatus(invoiceId: $invoiceId, input: $input) {
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
      }
    }
  `,

  // MUTATION TO SEND INVOICE EMAIL
  SEND_INVOICE_EMAIL: `
    mutation SendInvoiceEmail($invoiceId: String!, $input: SendInvoiceEmailInput!) {
      sendInvoiceEmail(invoiceId: $invoiceId, input: $input) {
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
      }
    }
  `,

  // MUTATION TO SEND INVOICE PAYMENT INVITATION
  SEND_INVOICE_PAYMENT: `
    mutation SendInvoicePayment($input: SendInvoicePaymentInput!) {
      sendInvoicePayment(input: $input) {
        success
        message
        invitationToken
        expiresAt
      }
    }
  `,

  // MUTATION TO PROCESS INVOICE PAYMENT
  PROCESS_INVOICE_PAYMENT: `
    mutation ProcessInvoicePayment($token: String!, $input: ProcessInvoicePaymentInput!) {
      processInvoicePayment(token: $token, input: $input) {
        success
        message
        invitationToken
        expiresAt
      }
    }
  `,

  // MUTATION TO VERIFY INVOICE PAYMENT TOKEN
  VERIFY_INVOICE_PAYMENT_TOKEN: `
    mutation VerifyInvoicePaymentToken($input: VerifyInvoicePaymentTokenInput!) {
      verifyInvoicePaymentToken(input: $input) {
        isValid
        message
        invoiceId
        email
        role
        expiresAt
        isExpired
        firstName
        lastName
        sentAt
        paidAt
        status
      }
    }
  `,

  // MUTATION TO GENERATE AND UPLOAD INVOICE PDF
  GENERATE_INVOICE_PDF: `
    mutation GenerateInvoicePDF($invoiceId: String!, $input: GenerateInvoicePDFInput!) {
      generateInvoicePDF(invoiceId: $invoiceId, input: $input) {
        success
        message
        filePath
        downloadUrl
        digitalSignature
        downloadCount
      }
    }
  `,

  // MUTATION TO MARK INVOICE AS DOWNLOADED
  MARK_INVOICE_DOWNLOADED: `
    mutation MarkInvoiceDownloaded($invoiceId: String!, $input: MarkInvoiceDownloadedInput!) {
      markInvoiceDownloaded(invoiceId: $invoiceId, input: $input) {
        success
        downloadCount
        downloadedAt
      }
    }
  `
};

export { invoiceMutations };
// =========================================
// Source: accounting/paymentMutations.ts
// =========================================
// src/api/graphql/mutations/accounting/paymentMutations.ts
const paymentMutations = {
  // MUTATION POUR AJOUTER UNE LIGNE (order)
  ADD_LINE: `
    mutation AddLine($orderId: String!, $input: AddLineInput!) {
      addLine(orderId: $orderId, input: $input) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        createdAt
        updatedAt
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
      }
    }
  `,
  // MUTATION POUR SUPPRIMER UNE LIGNE (order)
  DELETE_LINE: `
    mutation DeleteLine($input: DeleteLineInput!) {
      deleteLine(input: $input) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        createdAt
        updatedAt
      }
    }
  `,
  // MUTATION POUR METTRE À JOUR UNE LIGNE (order)
  UPDATE_LINE: `
    mutation UpdateLine($orderId: String!, $assetId: String!, $updateData: UpdateLineDataInput!) {
      updateLine(orderId: $orderId, assetId: $assetId, updateData: $updateData) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        updatedAt
      }
    }
  `,
  // MUTATION POUR INITIER UN PAIEMENT
  INITIATE_PAYMENT: `
    mutation InitiatePayment($input: CreatePaymentDto!) {
      initiatePayment(input: $input) {
        success
        error
        code
        data {
          paymentIntent
          clientSecret
          amount
          currency
          orderId
          organizationId
          userId
          transfertId
          status
          metadata
          createdAt
        }
      }
    }
  `,
  // MUTATION POUR CRÉER UN ESTIMATE
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
  // MUTATION POUR METTRE À JOUR UN ESTIMATE
  UPDATE_ESTIMATE: `
    mutation UpdateEstimate($updateEstimateId: String!, $data: UpdateEstimateInput!) {
      updateEstimate(id: $updateEstimateId, data: $data) {
        estimateId
        serviceId
        proposalPrice
        details
        status
        buyerUserId
        buyerOrganizationId
        sellerOrganizationId
        negotiationCount
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,
  // MUTATION POUR METTRE À JOUR UN CONTRAT
  UPDATE_CONTRACT: `
    mutation UpdateContract($updateContractId: String!, $data: UpdateContractInput!) {
      updateContract(id: $updateContractId, data: $data) {
        contractId
        estimateId
        serviceId
        clientSignHash
        providerSignHash
        status
        details
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,
  // MUTATION POUR CRÉER UN ORDER 
  CREATE_ORDER: `
    mutation CreateOrder($input: CreateOrderInput!) {
      createOrder(input: $input) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        
      }
    }
  `,
  // MUTATION POUR METTRE À JOUR UN ORDER
  UPDATE_ORDER: `
    mutation UpdateOrder($orderId: String!, $data: UpdateOrderInput!) {
      updateOrder(orderId: $orderId, data: $data) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // MUTATION POUR CONFIRMER UN ORDER
  CONFIRM_ORDER: `
    mutation ConfirmOrder($orderId: String!) {
      confirmOrder(orderId: $orderId) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // MUTATION POUR MARQUER UN ORDER COMME PAYÉ
  MARK_ORDER_PAID: `
    mutation MarkOrderPaid($orderId: String!) {
      markOrderPaid(orderId: $orderId) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // MUTATION POUR MARQUER UN ORDER COMME LIVRÉ
  MARK_ORDER_DELIVERED: `
    mutation MarkOrderDelivered($orderId: String!) {
      markOrderDelivered(orderId: $orderId) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // MUTATION POUR ANNULER UN ORDER
  CANCEL_ORDER: `
    mutation CancelOrder($orderId: String!) {
      cancelOrder(orderId: $orderId) {
        orderId
        estimateId
        userId
        totalPrice
        status
        unloggedUser
        lines {
          orderAssetId
          assetId
          quantity
          unitPrice
          title
          description
          legalVatPercent
          
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
};

export { paymentMutations };

// =========================================
// Source: accounting/transactionMutations.ts
// =========================================
const transactionMutations = {

  // MUTATION POUR CRÉER UNE TRANSACTION
  CREATE_TRANSACTION: `
  mutation Mutation($input: CreateTransactionInput!) {
    initiateTransaction(input: $input) {
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
  }`,
  // MUTATION POUR METTRE À JOUR UNE TRANSACTION
  UPDATE_TRANSACTION: `
  mutation UpdateTransaction($transactionId: String!, $input: UpdateTransactionInput!) {
    updateTransaction(transactionId: $transactionId, input: $input) {
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
  }`

};

export { transactionMutations };
// =========================================
// Source: wallet/walletMutations.ts
// =========================================
const walletMutations = {
  CREATE_WALLET: `
    mutation CreateWallet($data: CreateWalletInput!) {
      createWallet(data: $data) {
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
      }
    }
  `,

  DEPOSIT: `
    mutation Deposit($data: DepositInput!) {
      deposit(data: $data) {
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
      }
    }
  `,

  WITHDRAW: `
    mutation Withdraw($data: WithdrawInput!) {
      withdraw(data: $data) {
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
      }
    }
  `,

  CONVERT_TO_TOKENS: `
    mutation ConvertToTokens($data: ConvertToTokensInput!) {
      convertToTokens(data: $data) {
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
      }
    }
  `,

  CONVERT_TOKENS_TO_MONEY: `
    mutation ConvertTokensToMoney($data: ConvertTokensToMoneyInput!) {
      convertTokensToMoney(data: $data) {
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
      }
    }
  `,

  PAY_WITH_WALLET: `
    mutation PayWithWallet($data: PayWithWalletInput!) {
      payWithWallet(data: $data) {
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
      }
    }
  `,

  ADD_REVENUE: `
    mutation AddRevenue($data: AddRevenueInput!) {
      addRevenue(data: $data) {
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
      }
    }
  `,

  BANK_WITHDRAW: `
    mutation BankWithdraw($data: BankWithdrawInput!) {
      bankWithdraw(data: $data) {
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
      }
    }
  `,

  TRANSFER: `
    mutation Transfer($data: TransferInput!) {
      transfer(data: $data) {
        sourceWallet {
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
        }
        destinationWallet {
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
        }
      }
    }
  `,

  SET_PRIMARY_CURRENCY: `
    mutation SetPrimaryCurrency($data: SetPrimaryCurrencyInput!) {
      setPrimaryCurrency(data: $data) {
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
      }
    }
  `,

  ADJUSTMENT: `
    mutation Adjustment($data: AdjustmentInput!) {
      adjustment(data: $data) {
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
      }
    }
  `,
  CREATE_STRIPE_CONNECT_ACCOUNT: `
    mutation CreateStripeConnectAccount($organizationID: String!) {
      createStripeConnectAccount(organizationID: $organizationID) {
        stripeAccountId
        onboardingCompleted
        chargesEnabled
        payoutsEnabled
        detailsSubmitted
      }
    }
  `,
  GENERATE_STRIPE_ONBOARDING_LINK: `
    mutation GenerateStripeOnboardingLink($organizationID: String!, $returnUrl: String!, $refreshUrl: String!) {
      generateStripeOnboardingLink(organizationID: $organizationID, returnUrl: $returnUrl, refreshUrl: $refreshUrl) {
        url
        expiresAt
      }
    }
  `,
  CREATE_STRIPE_ACCOUNT_SESSION: `
    mutation CreateStripeAccountSession($organizationID: String!) {
      createStripeAccountSession(organizationID: $organizationID) {
        clientSecret
      }
    }
  `,
};

export { walletMutations };
// =========================================
// Source: contract/contractMutations.ts
// =========================================
const contractMutations = {
  CREATE_CONTRACT: `
    mutation CreateContract($data: CreateContractInput!) {
      createContract(data: $data) {
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

  UPDATE_CONTRACT: `
    mutation UpdateContract($id: String!, $data: UpdateContractInput!) {
      updateContract(id: $id, data: $data) {
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

  SIGN_CONTRACT: `
    mutation SignContract($data: SignContractInput!) {
      signContract(data: $data) {
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

  SEND_CONTRACT: `
    mutation SendContract($data: SendContractInput!) {
      sendContract(data: $data) {
        success
        message
        invitationToken
        expiresAt
      }
    }
  `,

  VERIFY_TOKEN: `
    mutation VerifyToken($data: VerifyTokenInput!) {
      verifyToken(data: $data) {
        isValid
        message
        contractId
        email
        role
        expiresAt
        isExpired
      }
    }
  `,
};

export { contractMutations }; 
