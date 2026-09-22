import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
import { isValidScore } from '../../types/review/format.js';
/**
 * Rapports de service : lecture (client / prestataire / public), brouillon, soumission, likes.
 * La récompense (10 crédits SMP) est une conséquence backend de `submit` — aucune mutation dédiée.
 */
export class ServiceReportController {
    constructor(client) {
        this.client = client;
    }
    async get(serviceReportID) {
        const res = await this.client.query(reviewQueries.GET_SERVICE_REPORT, { serviceReportID });
        return res.serviceReport;
    }
    /** Rapports en attente de l'utilisateur connecté (prestations terminées non évaluées). */
    async getPending(pagination) {
        const res = await this.client.query(reviewQueries.GET_PENDING_SERVICE_REPORTS, { pagination });
        return res.pendingServiceReports;
    }
    async getMine(statuses, pagination) {
        const res = await this.client.query(reviewQueries.GET_MY_SERVICE_REPORTS, { statuses, pagination });
        return res.myServiceReports;
    }
    /** Rapports reçus par une organisation / un service (membres uniquement). */
    async getReceived(filter, pagination) {
        const res = await this.client.query(reviewQueries.GET_RECEIVED_SERVICE_REPORTS, { filter, pagination });
        return res.receivedServiceReports;
    }
    /** Avis publiés d'un service (public). */
    async getServiceReviews(serviceID, pagination) {
        const res = await this.client.query(reviewQueries.GET_SERVICE_REVIEWS, { serviceID, pagination });
        return res.serviceReviews;
    }
    async getServiceReviewSummary(serviceID) {
        const res = await this.client.query(reviewQueries.GET_SERVICE_REVIEW_SUMMARY, { serviceID });
        return res.serviceReviewSummary;
    }
    async saveDraft(serviceReportID, input) {
        const res = await this.client.mutate(reviewMutations.SAVE_SERVICE_REPORT_DRAFT, { serviceReportID, input: normalizeInput(input) });
        return res.saveServiceReportDraft;
    }
    async submit(serviceReportID, input) {
        const normalized = normalizeInput(input);
        const invalid = normalized.ratings.find((r) => !isValidScore(r.score));
        if (invalid)
            throw new Error(`Invalid score for criterion "${invalid.key}": expected 1..5 by 0.5 steps`);
        const res = await this.client.mutate(reviewMutations.SUBMIT_SERVICE_REPORT, { serviceReportID, input: normalized });
        return res.submitServiceReport;
    }
    async like(serviceReportID) {
        const res = await this.client.mutate(reviewMutations.LIKE_SERVICE_REPORT, { serviceReportID });
        return res.likeServiceReport;
    }
    async unlike(serviceReportID) {
        const res = await this.client.mutate(reviewMutations.UNLIKE_SERVICE_REPORT, { serviceReportID });
        return res.unlikeServiceReport;
    }
}
export function normalizeInput(input) {
    return {
        ratings: (input.ratings ?? []).map((r) => ({ key: r.key, score: Number(r.score), ...(r.comment?.trim() ? { comment: r.comment.trim() } : {}) })),
        ...(input.overallComment?.trim() ? { overallComment: input.overallComment.trim() } : {}),
        ...(input.wouldRecommend !== undefined ? { wouldRecommend: input.wouldRecommend } : {}),
    };
}
