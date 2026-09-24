import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';
export { DocumentSettingsController };
export class OrganizationDomain {
    constructor(client) {
        this.organization = new Organization(client);
        this.manageOrganization = new ManageOrganization(client);
        this.contact = new ContactController(client);
        this.documentSettings = new DocumentSettingsController(client);
    }
}
