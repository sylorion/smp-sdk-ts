import { APIClient } from '../api/APIClient';
import { paymentMutations } from '../api/graphql/mutations/accounting/paymentMutations';


// PaymentTypes.ts

// Types d'input pour les mutations de paiement

 interface CreatePaymentIntentInput {
    invoiceID: string;
    customerID: string;
  }
  
  export interface ProcessPaymentInput {
    paymentIntentID: string;
    invoiceID: string;
  }
  
  export interface RefundPaymentInput {
    paymentIntentID: string;
  }
  
  export interface UpdateEstimateStageInput {
    estimateID: string;
    stage: string;
  }
  
  export interface CreateEstimateForPaymentInput {
    authorID: string;
    sellerOrganizationID: string;
    description: string;
    stage: string;
    serviceID: string;
    details: any;
  }
  
  // Types de réponse pour les mutations de paiement
  
  export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentID: string;
    message: string;
  }
  
  export interface PaymentResponse {
    status: string;
  }
  
  export interface Refund {
    id: string;
    amount: number;
    status: string;
  }
  
  export interface RefundResult {
    status: string;
    refund?: Refund;
  }
  
  export interface UpdateEstimateStageResponse {
    estimateID: string;
    invoiceID?: string;
    message: string;
    code: number;
  }
  
  export interface Estimate {
    estimateID: string;
    uniqRef: string;
    slug: string;
    operatorUserID: string;
    buyerOrganizationID: string;
    sellerOrganizationID: string;
    serviceID: string;
    expirationDueDate: string;
    expirationTimeLeft: string;
    referencePrice: number;
    previewPrice: number;
    proposedPrice: number;
    commentaire: string;
    negociatedPrice: number;
    discountID: string;
    details: any;
    propositionCount: number;
    lastProposition: string;
    stage: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  }
  

/**
 * THE `Payment` CLASS MANAGES PAYMENT-RELATED REQUESTS WITHIN THE APPLICATION.
 * IT USES AN `APIClient` TO COMMUNICATE WITH THE GRAPHQL API AND PROVIDES VARIOUS METHODS
 * TO CREATE PAYMENT INTENTS, PROCESS PAYMENTS, REFUND PAYMENTS, UPDATE ESTIMATE STAGE, AND CREATE ESTIMATES FOR PAYMENTS.
 * EACH METHOD USES A GRAPHQL MUTATION DEFINED IN `paymentMutations`.
 */
export class SMPPayment {
  private client: APIClient;

  /**
   * INITIALIZES THE `Payment` CLASS WITH AN `APIClient` FOR REQUESTS.
   * @param client - AN INSTANCE OF `APIClient` FOR GRAPHQL REQUESTS.
   */
  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * CREATES A PAYMENT INTENT FOR AN INVOICE.
   * @param input - THE INPUT PARAMETERS FOR CREATING THE PAYMENT INTENT.
   * @returns A `PaymentIntentResponse` OBJECT CONTAINING CLIENT SECRET, PAYMENT INTENT ID, AND MESSAGE.
   */
  async createInvoicePaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResponse> {
    const mutation = paymentMutations.CREATE_INVOICE_PAYMENT_INTENT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createInvoicePaymentIntent: PaymentIntentResponse };
    return response.createInvoicePaymentIntent;
  }

  /**
   * PROCESSES A PAYMENT.
   * @param input - THE INPUT PARAMETERS FOR PROCESSING THE PAYMENT.
   * @returns A `PaymentResponse` OBJECT CONTAINING THE STATUS OF THE PAYMENT PROCESS.
   */
  async processPayment(input: ProcessPaymentInput): Promise<PaymentResponse> {
    const mutation = paymentMutations.PROCESS_PAYMENT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { processPayment: PaymentResponse };
    return response.processPayment;
  }

  /**
   * REFUNDS A PAYMENT.
   * @param input - THE INPUT PARAMETERS FOR REFUNDING THE PAYMENT.
   * @returns A `RefundResult` OBJECT CONTAINING THE STATUS AND REFUND DETAILS.
   */
  async refundPayment(input: RefundPaymentInput): Promise<RefundResult> {
    const mutation = paymentMutations.REFUND_PAYMENT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { refundPayment: RefundResult };
    return response.refundPayment;
  }

  /**
   * UPDATES THE STAGE OF AN ESTIMATE.
   * @param input - THE INPUT PARAMETERS FOR UPDATING THE ESTIMATE STAGE.
   * @returns AN `UpdateEstimateStageResponse` OBJECT CONTAINING UPDATED STAGE INFORMATION.
   */
//   async updateEstimateStage(input: UpdateEstimateStageInput): Promise<UpdateEstimateStageResponse> {
//     const mutation = paymentMutations.UPDATE_ESTIMATE_STAGE;
//     const variables = { input };
//     const response = await this.client.mutate(mutation, variables) as { updateEstimateStage: UpdateEstimateStageResponse };
//     return response.updateEstimateStage;
//   }

  /**
   * CREATES AN ESTIMATE FOR A PAYMENT.
   * @param input - THE INPUT PARAMETERS FOR CREATING THE ESTIMATE.
   * @returns AN `Estimate` OBJECT CONTAINING THE DETAILS OF THE CREATED ESTIMATE.
   */
  async createEstimateForPayment(input: CreateEstimateForPaymentInput): Promise<Estimate> {
    const mutation = paymentMutations.CREATE_ESTIMATE_FOR_PAYMENT;
    const variables = { input };
    const response = await this.client.mutate(mutation, variables) as { createEstimateForPayment: Estimate };
    return response.createEstimateForPayment;
  }
}

