import { APIClient } from '../../api/APIClient.js';
import { CapacityController } from './CapacityController.js';

/** Capacité des prestations : limites de volume par service et par organisation. */
export class CapacityDomain {
  public capacity: CapacityController;

  constructor(client: APIClient) {
    this.capacity = new CapacityController(client);
  }
}

export { CapacityController };
