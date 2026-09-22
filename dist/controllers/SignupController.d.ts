import { APIClient } from '../api/APIClient.js';
export interface CreateUserInput {
    username: string;
    userKind: string;
    twoFactorEnabled?: boolean | null;
    state: string;
    profileID?: string | null;
    plan?: string | null;
    password: string;
    email: string;
    rsaPublicKey?: string;
}
export interface CreateUserResponse {
    userID: string;
    uniqRef: string;
    slug: string;
    username: string;
    email: string;
    plan?: string;
    profileID?: string;
    userKind: string;
    lastLogin?: string;
    twoFactorEnabled?: boolean;
    loginDuration?: number;
    rsaPublicKey?: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
}
export declare class Signup {
    private client;
    constructor(client: APIClient);
    /**
     * Crée un nouvel utilisateur
     * @param input Les données d'entrée pour créer un utilisateur
     * @returns Les informations de l'utilisateur créé
     */
    createUser(input: CreateUserInput, affiliateToken?: string): Promise<CreateUserResponse>;
}
