import { APIClient } from '../../api/APIClient.js';
import { CreateProfileInput, UpdateProfileInput, ProfileEntity } from '../../types/user/index.js';
interface MutationResponse {
    success: boolean;
    message: string;
}
export declare class Profile {
    private client;
    constructor(client: APIClient);
    create(input: CreateProfileInput): Promise<ProfileEntity>;
    update(profileId: string, input: UpdateProfileInput): Promise<ProfileEntity>;
    delete(profileID: string): Promise<MutationResponse>;
    updateUsername(newUsername: string): Promise<MutationResponse>;
    getById(profileId: string): Promise<ProfileEntity>;
    getByUserId(userID: string): Promise<ProfileEntity[]>;
    list(): Promise<ProfileEntity[]>;
    getBySlug(slug: string): Promise<ProfileEntity>;
    getByUniqRef(uniqRef: string): Promise<ProfileEntity>;
    getByIds(profileIDs: string[]): Promise<ProfileEntity[]>;
    getBySlugs(slugs: string[]): Promise<ProfileEntity[]>;
    requestEmailChange(input: {
        newEmail: string;
        password: string;
    }, userID: string): Promise<MutationResponse>;
    confirmEmailChange(input: {
        code: string;
    }, userID: string): Promise<MutationResponse>;
}
export {};
