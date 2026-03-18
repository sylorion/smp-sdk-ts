import { APIClient } from '../../api/APIClient.js';
import { Profile } from './ProfileController.js';
import { AffiliateController } from '../auth/AffiliateController.js';
import { Password } from '../auth/PasswordController.js';
import { Signup } from '../auth/SignupController.js';

export class UserDomain {
  public profile: Profile;
  public affiliateController: AffiliateController;
  public password: Password;
  public signup: Signup;

  constructor(client: APIClient) {
    this.profile = new Profile(client);
    this.affiliateController = new AffiliateController(client);
    this.password = new Password(client);
    this.signup = new Signup(client);
  }
}
