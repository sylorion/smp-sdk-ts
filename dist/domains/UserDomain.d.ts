import { APIClient } from '../api/APIClient.js';
import { Profile } from './user/ProfileController.js';
import { Password } from './user/PasswordController.js';
import { Signup } from './user/SignupController.js';
import { AffiliateController } from './user/AffiliateController.js';
export declare class UserDomain {
    profile: Profile;
    password: Password;
    signup: Signup;
    affiliateController: AffiliateController;
    constructor(client: APIClient);
}
