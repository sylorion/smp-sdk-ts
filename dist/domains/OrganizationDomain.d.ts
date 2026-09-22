import { APIClient } from '../api/APIClient.js';
import { Organization } from './organization/OrganizationController.js';
import { ManageOrganization } from './organization/ManageOrganisationController.js';
import { ContactController } from './organization/ContactController.js';
export declare class OrganizationDomain {
    organization: Organization;
    manageOrganization: ManageOrganization;
    contact: ContactController;
    constructor(client: APIClient);
}
