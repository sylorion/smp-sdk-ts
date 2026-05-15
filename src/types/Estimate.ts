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

/**
 * Contact info pour les parties "to" (client) et "from" (prestataire).
 * Le champ `email` est CRITIQUE pour le pipeline de notifications.
 */
export interface EstimateContactInfo {
  name: string;
  email?: string;
  recipientEmail?: string;  // alias legacy
  phone?: string;
  address?: string | {
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
  };
  firstName?: string;
  lastName?: string;
  type?: 'INDIVIDUAL' | 'COMPANY';
  organizationName?: string;
  company?: {
    companyName?: string;
    siret?: string;
    vatNumber?: string;
  };
}

export interface EstimateServiceItem {
  id: string;
  title: string;
  description?: string;
  quantity: number;
  unitPrice: number;  // centimes
  total: number;      // centimes
}

export interface EstimateService {
  serviceID: string;
  title: string;
  description: string;
  synthese?: string;
  price: number;      // centimes
  quantity?: number;
  items: EstimateServiceItem[];
  actions?: any[];
  isNegotiable?: boolean;
}

/**
 * Structure typée du champ `details` JSON d'un Estimate.
 *
 * CONVENTION DE PRIX : Tous les prix sont en CENTIMES dans le backend.
 * La conversion centimes → euros se fait au display côté frontend.
 */
export interface EstimateDetailsPayload {
  services: EstimateService[];
  items?: EstimateServiceItem[];
  from: EstimateContactInfo;
  to: EstimateContactInfo;
  estimateNumber?: string;
  issueDate?: string;
  validUntil?: string;
  tax: number;        // taux TVA en %
  subTotal: number;   // centimes
  total: number;      // centimes (TTC)
  actions?: any[];
  isNegotiable?: boolean;
  isDraft?: boolean;

  // Token de consultation publique (persisté pour liens client)
  viewToken?: string;
  source?: string;

  // Négociation
  negotiationPrice?: number;
  originalPrice?: number;
  negotiationStatus?: string;
  negotiation?: any;
  negotiationData?: any;
  lastUpdated?: string;

  // Booking
  booking?: {
    slotDate?: string;
    slotStartTime?: number;
    slotEndTime?: number;
    slotDuration?: number;
    timeSlotId?: string;
    location?: string;
  };
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
  status?: string;
  details: EstimateDetailsPayload;
  items?: any[];
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