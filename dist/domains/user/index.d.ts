import { APIClient } from '../../api/APIClient.js';
import { Profile } from './ProfileController.js';
import { UserPreferencesController } from './UserPreferencesController.js';
import { AffiliateController } from './AffiliateController.js';
import { Password } from '../auth/PasswordController.js';
import { Signup } from '../auth/SignupController.js';
import { Social } from './SocialController.js';
import { PlanController } from './PlanController.js';
export declare class UserDomain {
    profile: Profile;
    preferences: UserPreferencesController;
    affiliateController: AffiliateController;
    password: Password;
    signup: Signup;
    social: Social;
    plan: PlanController;
    constructor(client: APIClient);
}
