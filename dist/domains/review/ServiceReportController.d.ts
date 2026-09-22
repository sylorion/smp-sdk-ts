import { APIClient } from '../../api/APIClient.js';
import { ReviewPaginationInput, ServiceReport, ServiceReportInput, ServiceReportPage, ServiceReportStatus, ServiceReportsFilterInput, ServiceReviewSummary } from '../../types/review/index.js';
/**
 * Rapports de service : lecture (client / prestataire / public), brouillon, soumission, likes.
 * La récompense (10 crédits SMP) est une conséquence backend de `submit` — aucune mutation dédiée.
 */
export declare class ServiceReportController {
    private readonly client;
    constructor(client: APIClient);
    get(serviceReportID: string): Promise<ServiceReport>;
    /** Rapports en attente de l'utilisateur connecté (prestations terminées non évaluées). */
    getPending(pagination?: ReviewPaginationInput): Promise<ServiceReportPage>;
    getMine(statuses?: ServiceReportStatus[], pagination?: ReviewPaginationInput): Promise<ServiceReportPage>;
    /** Rapports reçus par une organisation / un service (membres uniquement). */
    getReceived(filter: ServiceReportsFilterInput, pagination?: ReviewPaginationInput): Promise<ServiceReportPage>;
    /** Avis publiés d'un service (public). */
    getServiceReviews(serviceID: string, pagination?: ReviewPaginationInput): Promise<ServiceReportPage>;
    getServiceReviewSummary(serviceID: string): Promise<ServiceReviewSummary>;
    saveDraft(serviceReportID: string, input: ServiceReportInput): Promise<ServiceReport>;
    submit(serviceReportID: string, input: ServiceReportInput): Promise<ServiceReport>;
    like(serviceReportID: string): Promise<ServiceReport>;
    unlike(serviceReportID: string): Promise<ServiceReport>;
}
export declare function normalizeInput(input: ServiceReportInput): ServiceReportInput;
