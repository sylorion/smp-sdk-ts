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
        downloadStatus {
          downloaded
          downloadedAt
          downloadCount
          ipAddress
        }
      }
    }
  `,

  // MUTATION TO SEND INVOICE EMAIL
  SEND_INVOICE_EMAIL: `
    mutation SendInvoiceEmail($invoiceId: String!, $input: SendInvoiceEmailInput!) {
      sendInvoiceEmail(invoiceId: $invoiceId, input: $input) {
        invoiceId
        emailSentAt
        emailRecipient
        emailStatus
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

  // QUERY TO VERIFY INVOICE PAYMENT TOKEN
  VERIFY_INVOICE_PAYMENT_TOKEN: `
    query VerifyInvoicePaymentToken($input: VerifyInvoicePaymentTokenInput!) {
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
        status
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
  `
};

export { invoiceMutations }; 