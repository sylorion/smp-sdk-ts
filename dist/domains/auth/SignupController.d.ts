import { APIClient } from '../../api/APIClient.js';
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
    acceptNewsletter?: boolean;
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
     * Vérifie la disponibilité d'un nom d'utilisateur
     * @param username Le nom d'utilisateur à vérifier
     * @returns La disponibilité et un message
     */
    checkAvailability(username: string): Promise<{
        available: boolean;
        message: string;
    }>;
    /**
     * Crée un nouvel utilisateur
     * @param input Les données d'entrée pour créer un utilisateur
     * @returns Les informations de l'utilisateur créé
     */
    create(input: CreateUserInput, affiliateToken?: string): Promise<CreateUserResponse>;
}
