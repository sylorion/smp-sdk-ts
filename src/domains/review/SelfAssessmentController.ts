import { APIClient } from '../../api/APIClient.js';
import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
import { SelfAssessment, SelfAssessmentStatus, SubmitSelfAssessmentInput } from '../../types/review/index.js';

/** Auto-évaluation semestrielle du prestataire (n'influence jamais la note publique). */
export class SelfAssessmentController {
  constructor(private readonly client: APIClient) {}

  async getStatus(serviceID: string): Promise<SelfAssessmentStatus> {
    const res = await this.client.query<{ selfAssessment: SelfAssessmentStatus }>(reviewQueries.GET_SELF_ASSESSMENT, { serviceID });
    return res.selfAssessment;
  }

  async getHistory(serviceID: string): Promise<SelfAssessment[]> {
    const res = await this.client.query<{ selfAssessmentHistory: SelfAssessment[] }>(reviewQueries.GET_SELF_ASSESSMENT_HISTORY, { serviceID });
    return res.selfAssessmentHistory;
  }

  async submit(input: SubmitSelfAssessmentInput): Promise<SelfAssessment> {
    const res = await this.client.mutate<{ submitSelfAssessment: SelfAssessment }>(reviewMutations.SUBMIT_SELF_ASSESSMENT, { input });
    return res.submitSelfAssessment;
  }
}
