import { APIClient } from '../../api/APIClient.js';
import { ReferralController } from './ReferralController.js';

/** Apport d'affaires : offres, partenariats, commissions. */
export class ReferralDomain {
  public referral: ReferralController;

  constructor(client: APIClient) {
    this.referral = new ReferralController(client);
  }
}

export { ReferralController };
