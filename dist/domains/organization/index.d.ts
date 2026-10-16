import { APIClient } from '../../api/APIClient.js';
import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';
import { WorkspaceController } from './WorkspaceController.js';
import { OrganizationMailingController } from './MailingController.js';
export { DocumentSettingsController, WorkspaceController, ContactController, OrganizationMailingController };
export type { ContactListFilters, HandOverContactInput } from './ContactController.js';
export declare class OrganizationDomain {
    organization: Organization;
    manageOrganization: ManageOrganization;
    contact: ContactController;
    /** Personnalisation des factures, avoirs, devis et bons de commande. */
    documentSettings: DocumentSettingsController;
    /** Espace de travail : tâches, commentaires internes, transmission de dossiers. */
    workspace: WorkspaceController;
    /** E-mailing CRM : aperçu, envoi aux contacts, historique. */
    mailing: OrganizationMailingController;
    constructor(client: APIClient);
}
