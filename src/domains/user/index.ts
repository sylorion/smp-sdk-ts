import { APIClient } from '../../api/APIClient.js';
import { Profile } from './ProfileController.js';
import { UserPreferencesController } from './UserPreferencesController.js';
import { AffiliateController } from './AffiliateController.js';
import { Password } from '../auth/PasswordController.js';
import { Passwordless } from '../auth/PasswordlessController.js';
import { Signup } from '../auth/SignupController.js';
import { Social } from './SocialController.js';
import { PlanController } from './PlanController.js';
import { AccountBootstrapController } from './AccountBootstrapController.js';

export class UserDomain {
  public profile: Profile;
  public preferences: UserPreferencesController;
  public affiliateController: AffiliateController;
  public password: Password;
  /** Lien magique et Blitzscription (08/11). */
  public passwordless: Passwordless;
  public signup: Signup;
  public social: Social;
  public plan: PlanController;
  /** Filet de sécurité de l'inscription (services internes seulement). */
  public accountBootstrap: AccountBootstrapController;

  constructor(client: APIClient) {
    this.profile = new Profile(client);
    this.preferences = new UserPreferencesController(client);
    this.affiliateController = new AffiliateController(client);
    this.password = new Password(client);
    this.passwordless = new Passwordless(client);
    this.signup = new Signup(client);
    this.social = new Social(client);
    this.plan = new PlanController(client);
    this.accountBootstrap = new AccountBootstrapController(client);
  }
}
