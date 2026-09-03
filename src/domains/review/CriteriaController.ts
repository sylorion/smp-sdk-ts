import { APIClient } from '../../api/APIClient.js';
import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
import { CriterionBlock, ReviewCriterion, ServiceCriteria, ServiceCriterionSelection, ServiceSourceType } from '../../types/review/index.js';

/** Critères : résolution service → topic → subtopic → type, bibliothèque, choix du prestataire (2 max). */
export class CriteriaController {
  constructor(private readonly client: APIClient) {}

  async getServiceCriteria(serviceID: string, sourceType?: ServiceSourceType): Promise<ServiceCriteria> {
    const res = await this.client.query<{ serviceCriteria: ServiceCriteria }>(reviewQueries.GET_SERVICE_CRITERIA, { serviceID, sourceType });
    return res.serviceCriteria;
  }

  async getLibrary(options: { block?: CriterionBlock; libraryOnly?: boolean } = {}): Promise<ReviewCriterion[]> {
    const res = await this.client.query<{ criteriaLibrary: ReviewCriterion[] }>(reviewQueries.GET_CRITERIA_LIBRARY, { block: options.block, libraryOnly: options.libraryOnly ?? true });
    return res.criteriaLibrary;
  }

  async getAdditionalCriteria(serviceID: string): Promise<ServiceCriterionSelection[]> {
    const res = await this.client.query<{ serviceAdditionalCriteria: ServiceCriterionSelection[] }>(reviewQueries.GET_SERVICE_ADDITIONAL_CRITERIA, { serviceID });
    return res.serviceAdditionalCriteria;
  }

  async selectAdditionalCriteria(serviceID: string, criterionKeys: string[]): Promise<ServiceCriterionSelection[]> {
    const res = await this.client.mutate<{ selectAdditionalCriteria: ServiceCriterionSelection[] }>(reviewMutations.SELECT_ADDITIONAL_CRITERIA, { serviceID, criterionKeys });
    return res.selectAdditionalCriteria;
  }
}
