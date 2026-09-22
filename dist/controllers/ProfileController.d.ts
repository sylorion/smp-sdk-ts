import { APIClient } from '../api/APIClient.js';
interface CreateProfileInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    phoneNumber?: string;
    locationID?: string;
    idCardNumber?: string;
    authorID: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    state: string;
}
interface UpdateProfileInput {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
    phoneNumber?: string;
    locationID?: string;
    idCardNumber?: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    state?: string;
    profilePictureID?: string;
}
interface MediaEntity {
    url: string;
}
interface ProfileEntity {
    profileID: string;
    uniqRef: string;
    slug: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    phoneNumber: string;
    locationID: string;
    idCardNumber?: string;
    passportNumber?: string;
    socialSecurityNumber?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
    profilePicture?: MediaEntity;
    profilePictureID?: string;
}
interface MutationResponse {
    success: boolean;
    message: string;
}
export declare class Profile {
    private client;
    constructor(client: APIClient);
    createProfile(input: CreateProfileInput): Promise<ProfileEntity>;
    updateProfile(profileId: string, input: UpdateProfileInput): Promise<ProfileEntity>;
    deleteProfile(profileID: string): Promise<MutationResponse>;
    getProfile(profileId: string): Promise<ProfileEntity>;
    list(): Promise<ProfileEntity[]>;
    getProfileBySlug(slug: string): Promise<ProfileEntity>;
    getProfileByUniqRef(uniqRef: string): Promise<ProfileEntity>;
    getProfilesByIds(profileIDs: string[]): Promise<ProfileEntity[]>;
    getProfilesBySlugs(slugs: string[]): Promise<ProfileEntity[]>;
}
export {};
