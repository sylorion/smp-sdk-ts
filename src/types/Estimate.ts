export enum NegotiationStatus {
  NONE = 'none',
  IN_PROGRESS = 'in_progress',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export interface Negotiation {
  id: string;
  estimateId: string;
  proposedPrice: number;
  details?: Record<string, any>;
  iterationCount: number;
  status: NegotiationStatus;
  proposedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstimateDetails {
  estimateId: string;
  estimateNumber: string;
  buyerUserId?: string;
  buyerOrganizationId?: string;
  sellerOrganizationId: string;
  proposalPrice?: number;
  currentNegotiationId?: string;
  negotiationStatus: NegotiationStatus;
  details: {
    services: Array<{
      serviceID: string;
      title: string;
      description: string;
      synthese: string;
      price: number;
      items: Array<{
        id: string;
        title: string;
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
      }>;
      actions: any[];
      isNegotiable: boolean;
    }>;
    from: {
      name: string;
      address: string;
    };
    to: {
      name: string;
      address: string;
    };
    estimateNumber: string;
    issueDate: string;
    validUntil: string;
    tax: number;
    subTotal: number;
    total: number;
    actions: any[];
    isNegotiable: boolean;
    booking?: {
      slotDate?: string;
      slotStartTime?: number;
      slotEndTime?: number;
      slotDuration?: number;
      timeSlotId?: string;
      location?: string;
    };
  };
  items: any[];
}

export interface CreateNegotiationInput {
  estimateId: string;
  proposedPrice: number;
  proposedBy: string;
  details?: Record<string, any>;
}

export interface NegotiationResponse {
  estimate: EstimateDetails;
  negotiation: Negotiation;
}

export enum EstimateStatus {
  PENDING = 'pending',
  NEGOTIATING = 'negotiating',
  CLIENT_VALIDATED = 'client_validated',
  PROVIDER_VALIDATED = 'provider_validated',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  CLOSED = 'closed'
} 