import { APIClient } from '../../api/APIClient.js';
import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';

export class OrganizationDomain {
  public organization: Organization;
  public manageOrganization: ManageOrganization;

  constructor(client: APIClient) {
    this.organization = new Organization(client);
    this.manageOrganization = new ManageOrganization(client);
  }
}
