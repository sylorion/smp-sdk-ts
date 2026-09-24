import { APIClient } from '../../api/APIClient.js';
import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';
export { DocumentSettingsController };
export declare class OrganizationDomain {
    organization: Organization;
    manageOrganization: ManageOrganization;
    contact: ContactController;
    /** Personnalisation des factures, avoirs, devis et bons de commande. */
    documentSettings: DocumentSettingsController;
    constructor(client: APIClient);
}
