import { APIClient } from '../../api/APIClient.js';
import { ServiceReportController } from './ServiceReportController.js';
import { CriteriaController } from './CriteriaController.js';
import { ReviewThreadController } from './ReviewThreadController.js';
import { PerformanceController } from './PerformanceController.js';
import { SelfAssessmentController } from './SelfAssessmentController.js';
/**
 * Domaine Review : Rapports de service, critères, threads, performance, auto-évaluation.
 * Utilisation : `client.review.reports.getPending()`, `client.review.performance.getOverview(...)`.
 */
export declare class ReviewDomain {
    reports: ServiceReportController;
    criteria: CriteriaController;
    threads: ReviewThreadController;
    performance: PerformanceController;
    selfAssessment: SelfAssessmentController;
    constructor(client: APIClient);
}
export { ServiceReportController, CriteriaController, ReviewThreadController, PerformanceController, SelfAssessmentController };
export { reviewDomainForUser, reviewDomainWithToken } from './scoped.js';
