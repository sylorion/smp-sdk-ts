// smp-sdk-ts/src/invoice/invoice.ts

import { APIClient } from '../api/APIClient';
import { invoiceQueries } from '../api/graphql/queries/accounting/invoiceQueries';

/**
 * The `Invoice` class handles invoice-related requests within the application.
 * It utilizes an `APIClient` to interact with the GraphQL API and provides methods
 * for retrieving, listing, and searching invoices based on various criteria.
 */
export class Invoice {
  private client: APIClient;

  /**
   * Initializes the `Invoice` class with an `APIClient` for requests.
   * @param client - An instance of `APIClient` for GraphQL requests.
   */
  constructor(client: APIClient) {
    this.client = client;
  }

  /**
   * Retrieves a list of invoices with optional pagination, sorting, and filters.
   * @param pagination - Pagination parameters for the request.
   * @param sort - Sorting parameters for the invoices.
   * @param filter - Filters to refine the list of invoices.
   * @returns A list of invoices.
   */
  async list(pagination?: any, sort?: any, filter?: any) {

    const query = invoiceQueries.GET_INVOICES;
    const variables = { pagination, sort, filter };
    const response = await this.client.query(query, variables) as   { invoices: any[]  };
    return response.invoices;
  }

  /**
   * Fetches an invoice by its unique ID.
   * @param invoiceID - The ID of the invoice to retrieve.
   * @returns The details of the invoice.
   */
  async getById(invoiceID: string) {
    const query = invoiceQueries.GET_INVOICE_BY_ID;
    const variables = { invoiceID };
    const response = await this.client.query(query, variables) as  { invoiceByID: any } ;
    return response.invoiceByID;
  }

  /**
   * Fetches multiple invoices by an array of invoice IDs.
   * @param invoiceIDs - An array of invoice IDs.
   * @returns A list of invoices.
   */
  async getByIDs(invoiceIDs: string[]) {
    const query = invoiceQueries.GET_INVOICES_BY_IDS;
    const variables = { invoiceIDs };
    const response = await this.client.query(query, variables) as { data: { invoicesByIDs: any[] } };
    return response.data.invoicesByIDs;
  }

  /**
   * Fetches an invoice by its unique reference (`uniqRef`).
   * @param uniqRef - The unique reference of the invoice.
   * @returns The details of the invoice.
   */
  async getByUniqRef(uniqRef: string) {
    const query = invoiceQueries.GET_INVOICE_BY_UNIQ_REF;
    const variables = { uniqRef };
    const response = await this.client.query(query, variables) as { data: { invoiceByUniqRef: any } };
    return response.data.invoiceByUniqRef;
  }

  /**
   * Fetches an invoice by its slug.
   * @param slug - The slug of the invoice.
   * @returns The details of the invoice.
   */
  async getBySlug(slug: string) {
    const query = invoiceQueries.GET_INVOICE_BY_SLUG;
    const variables = { slug };
    const response = await this.client.query(query, variables) as { data: { invoiceBySlug: any } };
    return response.data.invoiceBySlug;
  }

  /**
   * Fetches multiple invoices by their slugs.
   * @param slugs - An array of invoice slugs.
   * @returns A list of invoices.
   */
  async getBySlugs(slugs: string[]) {
    const query = invoiceQueries.GET_INVOICES_BY_SLUGS;
    const variables = { slugs };
    const response = await this.client.query(query, variables) as { data: { invoicesBySlugs: any[] } };
    return response.data.invoicesBySlugs;
  }
}
