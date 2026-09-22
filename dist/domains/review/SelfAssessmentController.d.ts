import { APIClient } from '../../api/APIClient.js';
import { SelfAssessment, SelfAssessmentStatus, SubmitSelfAssessmentInput } from '../../types/review/index.js';
/** Auto-évaluation semestrielle du prestataire (n'influence jamais la note publique). */
export declare class SelfAssessmentController {
    private readonly client;
    constructor(client: APIClient);
    getStatus(serviceID: string): Promise<SelfAssessmentStatus>;
    getHistory(serviceID: string): Promise<SelfAssessment[]>;
    submit(input: SubmitSelfAssessmentInput): Promise<SelfAssessment>;
}
