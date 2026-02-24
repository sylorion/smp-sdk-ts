import { APIClient } from '../../api/APIClient.js';
import { Profile } from './ProfileController.js';

export class UserDomain {
  public profile: Profile;

  constructor(client: APIClient) {
    this.profile = new Profile(client);
  }
}
