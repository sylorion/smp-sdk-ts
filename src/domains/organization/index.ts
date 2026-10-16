import { APIClient } from '../../api/APIClient.js';
import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';
import { WorkspaceController } from './WorkspaceController.js';

export { DocumentSettingsController, WorkspaceController, ContactController };
export type { ContactListFilters, HandOverContactInput } from './ContactController.js';

export class OrganizationDomain {
  public organization: Organization;
  public manageOrganization: ManageOrganization;
  public contact: ContactController;
  /** Personnalisation des factures, avoirs, devis et bons de commande. */
  public documentSettings: DocumentSettingsController;
  /** Espace de travail : tâches, commentaires internes, transmission de dossiers. */
  public workspace: WorkspaceController;

  constructor(client: APIClient) {
    this.organization = new Organization(client);
    this.manageOrganization = new ManageOrganization(client);
    this.contact = new ContactController(client);
    this.documentSettings = new DocumentSettingsController(client);
    this.workspace = new WorkspaceController(client);
  }
}
