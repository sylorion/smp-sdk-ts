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
export class ReviewDomain {
  public reports: ServiceReportController;
  public criteria: CriteriaController;
  public threads: ReviewThreadController;
  public performance: PerformanceController;
  public selfAssessment: SelfAssessmentController;

  constructor(client: APIClient) {
    this.reports = new ServiceReportController(client);
    this.criteria = new CriteriaController(client);
    this.threads = new ReviewThreadController(client);
    this.performance = new PerformanceController(client);
    this.selfAssessment = new SelfAssessmentController(client);
  }
}

export { ServiceReportController, CriteriaController, ReviewThreadController, PerformanceController, SelfAssessmentController };
