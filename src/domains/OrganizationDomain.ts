import { APIClient } from '../api/APIClient.js';
import { Organization } from './organization/OrganizationController.js';
import { ManageOrganization } from './organization/ManageOrganisationController.js';
import { ContactController } from './organization/ContactController.js';

export class OrganizationDomain {
  public organization: Organization;
  public manageOrganization: ManageOrganization;
  public contact: ContactController;

  constructor(client: APIClient) {
    this.organization = new Organization(client);
    this.manageOrganization = new ManageOrganization(client);
    this.contact = new ContactController(client);
  }
}
