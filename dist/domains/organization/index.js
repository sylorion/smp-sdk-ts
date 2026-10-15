import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';
import { WorkspaceController } from './WorkspaceController.js';
export { DocumentSettingsController, WorkspaceController };
export class OrganizationDomain {
    constructor(client) {
        this.organization = new Organization(client);
        this.manageOrganization = new ManageOrganization(client);
        this.contact = new ContactController(client);
        this.documentSettings = new DocumentSettingsController(client);
        this.workspace = new WorkspaceController(client);
    }
}
