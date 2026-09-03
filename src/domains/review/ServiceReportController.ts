import { APIClient } from '../../api/APIClient.js';
import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
import {
  ReviewPaginationInput,
  ServiceReport,
  ServiceReportInput,
  ServiceReportPage,
  ServiceReportStatus,
  ServiceReportsFilterInput,
  ServiceReviewSummary,
} from '../../types/review/index.js';
import { isValidScore } from '../../types/review/format.js';

/**
 * Rapports de service : lecture (client / prestataire / public), brouillon, soumission, likes.
 * La récompense (10 crédits SMP) est une conséquence backend de `submit` — aucune mutation dédiée.
 */
export class ServiceReportController {
  constructor(private readonly client: APIClient) {}

  async get(serviceReportID: string): Promise<ServiceReport> {
    const res = await this.client.query<{ serviceReport: ServiceReport }>(reviewQueries.GET_SERVICE_REPORT, { serviceReportID });
    return res.serviceReport;
  }

  /** Rapports en attente de l'utilisateur connecté (prestations terminées non évaluées). */
  async getPending(pagination?: ReviewPaginationInput): Promise<ServiceReportPage> {
    const res = await this.client.query<{ pendingServiceReports: ServiceReportPage }>(reviewQueries.GET_PENDING_SERVICE_REPORTS, { pagination });
    return res.pendingServiceReports;
  }

  async getMine(statuses?: ServiceReportStatus[], pagination?: ReviewPaginationInput): Promise<ServiceReportPage> {
    const res = await this.client.query<{ myServiceReports: ServiceReportPage }>(reviewQueries.GET_MY_SERVICE_REPORTS, { statuses, pagination });
    return res.myServiceReports;
  }

  /** Rapports reçus par une organisation / un service (membres uniquement). */
  async getReceived(filter: ServiceReportsFilterInput, pagination?: ReviewPaginationInput): Promise<ServiceReportPage> {
    const res = await this.client.query<{ receivedServiceReports: ServiceReportPage }>(reviewQueries.GET_RECEIVED_SERVICE_REPORTS, { filter, pagination });
    return res.receivedServiceReports;
  }

  /** Avis publiés d'un service (public). */
  async getServiceReviews(serviceID: string, pagination?: ReviewPaginationInput): Promise<ServiceReportPage> {
    const res = await this.client.query<{ serviceReviews: ServiceReportPage }>(reviewQueries.GET_SERVICE_REVIEWS, { serviceID, pagination });
    return res.serviceReviews;
  }

  async getServiceReviewSummary(serviceID: string): Promise<ServiceReviewSummary> {
    const res = await this.client.query<{ serviceReviewSummary: ServiceReviewSummary }>(reviewQueries.GET_SERVICE_REVIEW_SUMMARY, { serviceID });
    return res.serviceReviewSummary;
  }

  async saveDraft(serviceReportID: string, input: ServiceReportInput): Promise<ServiceReport> {
    const res = await this.client.mutate<{ saveServiceReportDraft: ServiceReport }>(reviewMutations.SAVE_SERVICE_REPORT_DRAFT, { serviceReportID, input: normalizeInput(input) });
    return res.saveServiceReportDraft;
  }

  async submit(serviceReportID: string, input: ServiceReportInput): Promise<ServiceReport> {
    const normalized = normalizeInput(input);
    const invalid = normalized.ratings.find((r) => !isValidScore(r.score));
    if (invalid) throw new Error(`Invalid score for criterion "${invalid.key}": expected 1..5 by 0.5 steps`);
    const res = await this.client.mutate<{ submitServiceReport: ServiceReport }>(reviewMutations.SUBMIT_SERVICE_REPORT, { serviceReportID, input: normalized });
    return res.submitServiceReport;
  }

  async like(serviceReportID: string): Promise<ServiceReport> {
    const res = await this.client.mutate<{ likeServiceReport: ServiceReport }>(reviewMutations.LIKE_SERVICE_REPORT, { serviceReportID });
    return res.likeServiceReport;
  }

  async unlike(serviceReportID: string): Promise<ServiceReport> {
    const res = await this.client.mutate<{ unlikeServiceReport: ServiceReport }>(reviewMutations.UNLIKE_SERVICE_REPORT, { serviceReportID });
    return res.unlikeServiceReport;
  }
}

export function normalizeInput(input: ServiceReportInput): ServiceReportInput {
  return {
    ratings: (input.ratings ?? []).map((r) => ({ key: r.key, score: Number(r.score), ...(r.comment?.trim() ? { comment: r.comment.trim() } : {}) })),
    ...(input.overallComment?.trim() ? { overallComment: input.overallComment.trim() } : {}),
    ...(input.wouldRecommend !== undefined ? { wouldRecommend: input.wouldRecommend } : {}),
  };
}
