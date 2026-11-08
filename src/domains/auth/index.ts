import { APIClient } from '../../api/APIClient.js';
import { Signup } from './SignupController.js';
import { Password } from './PasswordController.js';
import { Passwordless } from './PasswordlessController.js';
import { AffiliateController } from './AffiliateController.js';
import { AdminUserController } from './AdminUserController.js';
import { AdminAnalyticsController } from './AdminAnalyticsController.js';

export class AuthDomain {
  public signup: Signup;
  public password: Password;
  /** Lien magique et Blitzscription (08/11). */
  public passwordless: Passwordless;
  public affiliate: AffiliateController;
  public adminUser: AdminUserController;
  public adminAnalytics: AdminAnalyticsController;

  constructor(client: APIClient) {
    this.signup = new Signup(client);
    this.password = new Password(client);
    this.passwordless = new Passwordless(client);
    this.affiliate = new AffiliateController(client);
    this.adminUser = new AdminUserController(client);
    this.adminAnalytics = new AdminAnalyticsController(client);
  }
}

