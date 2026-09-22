import { APIClient } from '../api/APIClient.js';
/**
 * The `Transaction` class manages transaction-related requests within the application.
 * It utilizes an `APIClient` to interact with the GraphQL API, providing methods
 * to retrieve, list, and search transactions based on various criteria.
 */
export declare class Transaction {
    private client;
    /**
     * Initializes the `Transaction` class with an `APIClient` for requests.
     * @param client - An instance of `APIClient` for GraphQL requests.
     */
    constructor(client: APIClient);
    /**
     * Retrieves a list of transactions with optional pagination, sorting, and filters.
     * @param pagination - Pagination parameters for the request.
     * @param sort - Sorting parameters for the transactions.
     * @param filter - Filters to refine the list of transactions.
     * @returns A list of transactions.
     */
    list(pagination?: any, sort?: any, filter?: any): Promise<any[]>;
    /**
     * Fetches a transaction by its unique ID.
     * @param transactionID - The ID of the transaction to retrieve.
     * @returns The details of the transaction.
     */
    getById(transactionID: string): Promise<any>;
    /**
     * Fetches multiple transactions by an array of transaction IDs.
     * @param transactionIDs - An array of transaction IDs.
     * @returns A list of transactions.
     */
    getByIDs(transactionIDs: string[]): Promise<any[]>;
    /**
     * Fetches a transaction by its unique reference (`uniqRef`).
     * @param uniqRef - The unique reference of the transaction.
     * @returns The details of the transaction.
     */
    getByUniqRef(uniqRef: string): Promise<any>;
    /**
     * Fetches a transaction by its slug.
     * @param slug - The slug of the transaction.
     * @returns The details of the transaction.
     */
    getBySlug(slug: string): Promise<any>;
    /**
     * Fetches multiple transactions by their slugs.
     * @param slugs - An array of transaction slugs.
     * @returns A list of transactions.
     */
    getBySlugs(slugs: string[]): Promise<any[]>;
}
