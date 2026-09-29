import { APIClient } from '../../api/APIClient.js';
export interface CreateWaitingListInput {
    firstName?: string;
    lastName: string;
    email: string;
    city: string;
    details: string;
    age: number;
}
export type UpdateWaitingListInput = Partial<CreateWaitingListInput>;
/** Filtres de `waitingLists(page, limit, state)` ; `state` est un ObjectStatus (online, offline…). */
export interface WaitingListListOptions {
    page?: number;
    limit?: number;
    state?: string;
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
    create(input: CreateWaitingListInput): Promise<WaitingListEntity>;
    update(waitingListID: string, input: UpdateWaitingListInput): Promise<WaitingListEntity>;
    delete(waitingListID: string): Promise<MutationResponse>;
    confirm(waitingListID: string): Promise<WaitingListEntity>;
    resendEmail(waitingListID: string): Promise<WaitingListEntity>;
    verifyToken(token: string): Promise<WaitingListTokenData>;
    getById(waitingListID: string): Promise<WaitingListEntity>;
    list(options?: WaitingListListOptions): Promise<WaitingListEntity[]>;
}
export {};
