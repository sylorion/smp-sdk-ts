import { APIClient } from '../../api/APIClient.js';
import { ServiceFlowController } from './ServiceFlowController.js';

/** Flows de service : parcours avant paiement, exécutions, statistiques. */
export class FlowDomain {
  public serviceFlow: ServiceFlowController;

  constructor(client: APIClient) {
    this.serviceFlow = new ServiceFlowController(client);
  }
}

export { ServiceFlowController };
