import { APIClient } from '../../api/APIClient.js';
import { Organization } from './OrganizationController.js';
import { ManageOrganization } from './ManageOrganisationController.js';
import { ContactController } from './ContactController.js';
export declare class OrganizationDomain {
    organization: Organization;
    manageOrganization: ManageOrganization;
    contact: ContactController;
    constructor(client: APIClient);
}
