import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
import { DocumentSettingsController } from './DocumentSettingsController.js';
import { WorkspaceController } from './WorkspaceController.js';
import { OrganizationMailingController } from './MailingController.js';
export { DocumentSettingsController, WorkspaceController, ContactController, OrganizationMailingController };
export class OrganizationDomain {
    constructor(client) {
        this.organization = new Organization(client);
        this.manageOrganization = new ManageOrganization(client);
        this.contact = new ContactController(client);
        this.documentSettings = new DocumentSettingsController(client);
        this.workspace = new WorkspaceController(client);
        this.mailing = new OrganizationMailingController(client);
    }
}
