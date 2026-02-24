import { APIClient } from '../api/APIClient.js';
import { Organization } from './organization/OrganizationController.js';
import { ManageOrganization } from './organization/ManageOrganisationController.js';

export class OrganizationDomain {
  public organization: Organization;
  public manageOrganization: ManageOrganization;

  constructor(client: APIClient) {
    this.organization = new Organization(client);
    this.manageOrganization = new ManageOrganization(client);
  }
}
