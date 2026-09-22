import { APIClient } from '../../api/APIClient.js';
import { CriterionBlock, ReviewCriterion, ServiceCriteria, ServiceCriterionSelection, ServiceSourceType } from '../../types/review/index.js';
/** Critères : résolution service → topic → subtopic → type, bibliothèque, choix du prestataire (2 max). */
export declare class CriteriaController {
    private readonly client;
    constructor(client: APIClient);
    getServiceCriteria(serviceID: string, sourceType?: ServiceSourceType): Promise<ServiceCriteria>;
    getLibrary(options?: {
        block?: CriterionBlock;
        libraryOnly?: boolean;
    }): Promise<ReviewCriterion[]>;
    getAdditionalCriteria(serviceID: string): Promise<ServiceCriterionSelection[]>;
    selectAdditionalCriteria(serviceID: string, criterionKeys: string[]): Promise<ServiceCriterionSelection[]>;
}
