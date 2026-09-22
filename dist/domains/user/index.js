import { Profile } from './ProfileController.js';
import { UserPreferencesController } from './UserPreferencesController.js';
import { AffiliateController } from './AffiliateController.js';
import { Password } from '../auth/PasswordController.js';
import { Signup } from '../auth/SignupController.js';
import { Social } from './SocialController.js';
import { PlanController } from './PlanController.js';
export class UserDomain {
    constructor(client) {
        this.profile = new Profile(client);
        this.preferences = new UserPreferencesController(client);
        this.affiliateController = new AffiliateController(client);
        this.password = new Password(client);
        this.signup = new Signup(client);
        this.social = new Social(client);
        this.plan = new PlanController(client);
    }
}
