import { APIClient } from '../../api/APIClient.js';
import { Profile } from './ProfileController.js';
import { UserPreferencesController } from './UserPreferencesController.js';
import { AffiliateController } from './AffiliateController.js';
import { Password } from '../auth/PasswordController.js';
import { Signup } from '../auth/SignupController.js';
import { Social } from './SocialController.js';
import { PlanController } from './PlanController.js';

export class UserDomain {
  public profile: Profile;
  public preferences: UserPreferencesController;
  public affiliateController: AffiliateController;
  public password: Password;
  public signup: Signup;
  public social: Social;
  public plan: PlanController;

  constructor(client: APIClient) {
    this.profile = new Profile(client);
    this.preferences = new UserPreferencesController(client);
    this.affiliateController = new AffiliateController(client);
    this.password = new Password(client);
    this.signup = new Signup(client);
    this.social = new Social(client);
    this.plan = new PlanController(client);
  }
}
