import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
export class OrganizationDomain {
    constructor(client) {
        this.organization = new Organization(client);
        this.manageOrganization = new ManageOrganization(client);
        this.contact = new ContactController(client);
    }
}
