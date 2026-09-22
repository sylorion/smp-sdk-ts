import { APIClient } from '../../api/APIClient.js';
import { CreateEstimateInput, UpdateEstimateInput, Estimate as EstimateEntity } from './PaymentController.js';
export declare class Estimate {
    private client;
    constructor(client: APIClient);
    create(input: CreateEstimateInput): Promise<EstimateEntity>;
    update(updateEstimateId: string, data: UpdateEstimateInput): Promise<EstimateEntity>;
    getById(estimateId: string): Promise<EstimateEntity>;
    listByBuyerUserId(buyerUserId: string): Promise<EstimateEntity[]>;
    listBySellerOrganizationId(sellerOrganizationId: string): Promise<EstimateEntity[]>;
    listByBuyerOrganizationId(buyerOrganizationId: string): Promise<EstimateEntity[]>;
    /**
     * Envoie le devis au client et génère un token de consultation.
     * Déclenche les notifications async via RabbitMQ → mu-notification.
     */
    send(estimateId: string): Promise<EstimateEntity>;
    /**
     * Liste tous les estimates (utilisé pour la résolution de viewToken).
     */
    listAll(): Promise<EstimateEntity[]>;
    /**
     * Émet les notifications de proposition de négociation via RabbitMQ (async pipeline).
     */
    emitNegotiationProposal(estimateId: string, proposedBy: string, proposedPrice?: number | null, comment?: string | null): Promise<EstimateEntity>;
    /**
     * Émet les notifications d'acceptation d'un devis via RabbitMQ (async pipeline).
     */
    emitEstimateAccepted(estimateId: string): Promise<EstimateEntity>;
    /**
     * Émet les notifications de soumission d'un devis (pipeline PRESTATION).
     * À appeler quand l'estimate était un draft et est finalisé à l'étape COMMENTS.
     */
    emitEstimateSubmitted(estimateId: string): Promise<EstimateEntity>;
}
