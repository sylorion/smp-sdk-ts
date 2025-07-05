export interface EstimateDetails {
  estimateId: string;
  estimateNumber: string;
  buyerUserId?: string;
  buyerOrganizationId?: string;
  sellerOrganizationId: string;
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
      status: string;
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
    status: string;
  };
  items: any[];
} 