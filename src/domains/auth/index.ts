import { APIClient } from '../../api/APIClient.js';
import { Signup } from './SignupController.js';
import { Password } from './PasswordController.js';
import { AffiliateController } from './AffiliateController.js';
import { AdminUserController } from './AdminUserController.js';

export class AuthDomain {
  public signup: Signup;
  public password: Password;
  public affiliate: AffiliateController;
  public adminUser: AdminUserController;

  constructor(client: APIClient) {
    this.signup = new Signup(client);
    this.password = new Password(client);
    this.affiliate = new AffiliateController(client);
    this.adminUser = new AdminUserController(client);
  }
}

