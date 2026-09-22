import { APIClient } from '../api/APIClient.js';
interface WaitingListInput {
    firstName?: string;
    lastName: string;
    email: string;
    city: string;
    details: string;
    age: number;
}
interface WaitingListEntity {
    waitingListID: string;
    uniqRef: string;
    firstName?: string;
    lastName: string;
    email: string;
    city: string;
    details: string;
    age: number;
    jwt?: string;
    mailSent: boolean;
    lastMailSentAt?: string;
    state: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
}
interface MutationResponse {
    success: boolean;
    message: string;
}
interface WaitingListTokenData {
    waitingListID: string;
    firstName?: string;
    lastName: string;
    email: string;
    age: number;
    isUserExists: boolean;
    userState?: string;
}
export declare class WaitingList {
    private client;
    constructor(client: APIClient);
    create(input: WaitingListInput): Promise<WaitingListEntity>;
    update(waitingListID: string, input: WaitingListInput): Promise<WaitingListEntity>;
    delete(waitingListID: string): Promise<MutationResponse>;
    confirm(waitingListID: string): Promise<WaitingListEntity>;
    resendEmail(waitingListID: string): Promise<WaitingListEntity>;
    verifyToken(token: string): Promise<WaitingListTokenData>;
    get(waitingListID: string): Promise<WaitingListEntity>;
    list(): Promise<WaitingListEntity[]>;
}
export {};
