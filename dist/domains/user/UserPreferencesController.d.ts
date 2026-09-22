import { APIClient } from '../../api/APIClient.js';
import { CreateUserPreferencesInput, UpdateUserPreferencesInput, UserPreferences } from '../../types/user/index.js';
export declare class UserPreferencesController {
    private client;
    constructor(client: APIClient);
    create(input: CreateUserPreferencesInput): Promise<UserPreferences>;
    update(userPreferencesID: string, input: UpdateUserPreferencesInput): Promise<UserPreferences>;
    getById(userPreferencesID: string): Promise<UserPreferences>;
    getByUserId(userID: string): Promise<UserPreferences>;
}
