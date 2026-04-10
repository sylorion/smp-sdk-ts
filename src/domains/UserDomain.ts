import { APIClient } from '../api/APIClient.js';
import { Profile } from './user/ProfileController.js';
import { Password } from './user/PasswordController.js';
import { Signup } from './user/SignupController.js';
import { AffiliateController } from './user/AffiliateController.js';
import { Social } from './user/SocialController.js';

export class UserDomain {
  public profile: Profile;
  public password: Password;
  public signup: Signup;
  public affiliateController: AffiliateController;
  public social: Social;

  constructor(client: APIClient) {
    this.profile = new Profile(client);
    this.password = new Password(client);
    this.signup = new Signup(client);
    this.affiliateController = new AffiliateController(client);
    this.social = new Social(client);
  }
}
