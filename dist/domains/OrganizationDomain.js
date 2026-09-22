import { Organization } from './organization/OrganizationController.js';
import { ManageOrganization } from './organization/ManageOrganisationController.js';
import { ContactController } from './organization/ContactController.js';
export class OrganizationDomain {
    constructor(client) {
        this.organization = new Organization(client);
        this.manageOrganization = new ManageOrganization(client);
        this.contact = new ContactController(client);
    }
}
