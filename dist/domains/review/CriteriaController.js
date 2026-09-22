import { reviewQueries } from '../../api/graphql/review/queries.js';
import { reviewMutations } from '../../api/graphql/review/mutations.js';
/** Critères : résolution service → topic → subtopic → type, bibliothèque, choix du prestataire (2 max). */
export class CriteriaController {
    constructor(client) {
        this.client = client;
    }
    async getServiceCriteria(serviceID, sourceType) {
        const res = await this.client.query(reviewQueries.GET_SERVICE_CRITERIA, { serviceID, sourceType });
        return res.serviceCriteria;
    }
    async getLibrary(options = {}) {
        const res = await this.client.query(reviewQueries.GET_CRITERIA_LIBRARY, { block: options.block, libraryOnly: options.libraryOnly ?? true });
        return res.criteriaLibrary;
    }
    async getAdditionalCriteria(serviceID) {
        const res = await this.client.query(reviewQueries.GET_SERVICE_ADDITIONAL_CRITERIA, { serviceID });
        return res.serviceAdditionalCriteria;
    }
    async selectAdditionalCriteria(serviceID, criterionKeys) {
        const res = await this.client.mutate(reviewMutations.SELECT_ADDITIONAL_CRITERIA, { serviceID, criterionKeys });
        return res.selectAdditionalCriteria;
    }
}
