import { APIClient } from '../../api/APIClient.js';
import { mailingMutations, mailingQueries } from '../../api/graphql/organization/mailing.js';
import {
  MailingSegment,
  OrganizationMailing,
  OrganizationMailingPreview,
  SendOrganizationMailingInput,
} from '../../types/organization/mailing.js';

/**
 * E-mailing CRM : écrire un e-mail et l'envoyer aux contacts choisis de l'organisation.
 * À utiliser avec un client qui porte l'identité de l'utilisateur (`withUserAssertion`) ;
 * `unsubscribeContact` exige un client interne (`x-smp-internal-secret`).
 */
export class OrganizationMailingController {
  constructor(private readonly client: APIClient) {}

  async list(organizationID: string): Promise<OrganizationMailing[]> {
    const r = await this.client.query<{ organizationMailings: OrganizationMailing[] }>(mailingQueries.LIST_ORGANIZATION_MAILINGS, { organizationID });
    return r.organizationMailings ?? [];
  }

  async preview(organizationID: string, segment?: MailingSegment): Promise<OrganizationMailingPreview> {
    const r = await this.client.query<{ organizationMailingPreview: OrganizationMailingPreview }>(
      mailingQueries.PREVIEW_ORGANIZATION_MAILING, { organizationID, segment: segment ?? null });
    return r.organizationMailingPreview;
  }

  async send(input: SendOrganizationMailingInput): Promise<OrganizationMailing> {
    const r = await this.client.mutate<{ sendOrganizationMailing: OrganizationMailing }>(mailingMutations.SEND_ORGANIZATION_MAILING, { input });
    return r.sendOrganizationMailing;
  }

  async unsubscribeContact(organizationID: string, contactID: string): Promise<boolean> {
    const r = await this.client.mutate<{ unsubscribeOrganizationContactFromMailing: boolean }>(
      mailingMutations.UNSUBSCRIBE_ORGANIZATION_CONTACT, { organizationID, contactID });
    return r.unsubscribeOrganizationContactFromMailing === true;
  }
}
