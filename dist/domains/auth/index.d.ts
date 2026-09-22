import { APIClient } from '../../api/APIClient.js';
import { Signup } from './SignupController.js';
import { Password } from './PasswordController.js';
import { AffiliateController } from './AffiliateController.js';
import { AdminUserController } from './AdminUserController.js';
export declare class AuthDomain {
    signup: Signup;
    password: Password;
    affiliate: AffiliateController;
    adminUser: AdminUserController;
    constructor(client: APIClient);
}
