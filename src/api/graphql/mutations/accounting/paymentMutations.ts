const paymentMutations = {
    // MUTATION TO CREATE AN INVOICE PAYMENT INTENT
    CREATE_INVOICE_PAYMENT_INTENT: `
      mutation CreateInvoicePaymentIntent($input: CreatePaymentIntentInput!) {
        createInvoicePaymentIntent(input: $input) {
          clientSecret
          paymentIntentID
          message
        }
      }
    `,

    // MUTATION TO PROCESS A PAYMENT
    PROCESS_PAYMENT: `
      mutation ProcessPayment($input: ProcessPaymentInput!) {
        processPayment(input: $input) {
          status
        }
      }
    `,

    // MUTATION TO REFUND A PAYMENT
    REFUND_PAYMENT: `
      mutation RefundPayment($input: RefundPaymentInput!) {
        refundPayment(input: $input) {
          status
          refund {
            id
            amount
            status
          }
        }
      }
    `,

    // MUTATION TO CREATE AN ESTIMATE FOR PAYMENT
    CREATE_ESTIMATE_FOR_PAYMENT: `
      mutation CreateEstimateForPayment($input: CreateEstimateForPaymentInput!) {
        createEstimateForPayment(input: $input) {
          estimateID
          uniqRef
          slug
          operatorUserID
          buyerOrganizationID
          sellerOrganizationID
          serviceID
          expirationDueDate
          expirationTimeLeft
          referencePrice
          previewPrice
          proposedPrice
          commentaire
          negociatedPrice
          discountID
          details
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
// MUTATION TO UPDATE THE STAGE OF AN ESTIMATE FOR PAYMENT

    UPDATE_ESTIMATE_STAGE: `
      mutation UpdateEstimateStage($input: UpdateEstimateStageInput!) {
        updateEstimateStage(input: $input) {
          estimateID
          invoiceID
          message
          code
        }
      }
    `

  
};


export { paymentMutations };
