import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
/** Auto-évaluation semestrielle du prestataire (n'influence jamais la note publique). */
export class SelfAssessmentController {
    constructor(client) {
        this.client = client;
    }
    async getStatus(serviceID) {
        const res = await this.client.query(reviewQueries.GET_SELF_ASSESSMENT, { serviceID });
        return res.selfAssessment;
    }
    async getHistory(serviceID) {
        const res = await this.client.query(reviewQueries.GET_SELF_ASSESSMENT_HISTORY, { serviceID });
        return res.selfAssessmentHistory;
    }
    async submit(input) {
        const res = await this.client.mutate(reviewMutations.SUBMIT_SELF_ASSESSMENT, { input });
        return res.submitSelfAssessment;
    }
}
