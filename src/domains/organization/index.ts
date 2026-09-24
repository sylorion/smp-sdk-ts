import { APIClient } from '../../api/APIClient.js';
import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';

export { DocumentSettingsController };

export class OrganizationDomain {
  public organization: Organization;
  public manageOrganization: ManageOrganization;
  public contact: ContactController;
  /** Personnalisation des factures, avoirs, devis et bons de commande. */
  public documentSettings: DocumentSettingsController;

  constructor(client: APIClient) {
    this.organization = new Organization(client);
    this.manageOrganization = new ManageOrganization(client);
    this.contact = new ContactController(client);
    this.documentSettings = new DocumentSettingsController(client);
  }
}
