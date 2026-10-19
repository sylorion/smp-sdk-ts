import { APIClient } from '../../api/APIClient.js';
import { mailingMutations, mailingQueries } from '../../api/graphql/organization/mailing.js';
import {
  MailingSegment,
  OrganizationCampaign,
  OrganizationContactLastMailed,
  OrganizationEmailSettings,
  OrganizationEmailTemplate,
  OrganizationMailing,
  OrganizationMailingPreview,
  SaveOrganizationCampaignInput,
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

  /** Campagnes de l'organisation, les plus récentes d'abord. */
  async campaigns(organizationID: string): Promise<OrganizationCampaign[]> {
    const r = await this.client.query<{ organizationCampaigns: OrganizationCampaign[] }>(mailingQueries.LIST_ORGANIZATION_CAMPAIGNS, { organizationID });
    return r.organizationCampaigns ?? [];
  }

  /** Crée (sans `campaignID`) ou modifie une campagne ; `scheduledAt` la programme. */
  async saveCampaign(input: SaveOrganizationCampaignInput): Promise<OrganizationCampaign> {
    const r = await this.client.mutate<{ saveOrganizationCampaign: OrganizationCampaign }>(mailingMutations.SAVE_ORGANIZATION_CAMPAIGN, { input });
    return r.saveOrganizationCampaign;
  }

  /** Copie indépendante (contenu, mise en forme, audience), en brouillon. */
  async duplicateCampaign(organizationID: string, campaignID: string): Promise<OrganizationCampaign> {
    const r = await this.client.mutate<{ duplicateOrganizationCampaign: OrganizationCampaign }>(mailingMutations.DUPLICATE_ORGANIZATION_CAMPAIGN, { organizationID, campaignID });
    return r.duplicateOrganizationCampaign;
  }

  async deleteCampaign(organizationID: string, campaignID: string): Promise<boolean> {
    const r = await this.client.mutate<{ deleteOrganizationCampaign: boolean }>(mailingMutations.DELETE_ORGANIZATION_CAMPAIGN, { organizationID, campaignID });
    return r.deleteOrganizationCampaign === true;
  }

  /** Envoie la campagne maintenant (destinataires et limites de l'e-mailing). */
  async sendCampaign(organizationID: string, campaignID: string): Promise<OrganizationCampaign> {
    const r = await this.client.mutate<{ sendOrganizationCampaign: OrganizationCampaign }>(mailingMutations.SEND_ORGANIZATION_CAMPAIGN, { organizationID, campaignID });
    return r.sendOrganizationCampaign;
  }

  async emailSettings(organizationID: string): Promise<OrganizationEmailSettings> {
    const r = await this.client.query<{ organizationEmailSettings: OrganizationEmailSettings }>(mailingQueries.ORGANIZATION_EMAIL_SETTINGS, { organizationID });
    return r.organizationEmailSettings;
  }

  /** Charte e-mail (plan Pro). */
  async saveEmailTemplate(organizationID: string, template: Partial<OrganizationEmailTemplate>): Promise<OrganizationEmailSettings> {
    const r = await this.client.mutate<{ saveOrganizationEmailTemplate: OrganizationEmailSettings }>(
      mailingMutations.SAVE_ORGANIZATION_EMAIL_TEMPLATE, { input: { organizationID, ...template } });
    return r.saveOrganizationEmailTemplate;
  }

  async contactsLastMailed(organizationID: string): Promise<OrganizationContactLastMailed[]> {
    const r = await this.client.query<{ organizationContactsLastMailed: OrganizationContactLastMailed[] }>(mailingQueries.ORGANIZATION_CONTACTS_LAST_MAILED, { organizationID });
    return r.organizationContactsLastMailed ?? [];
  }

  async unsubscribeContact(organizationID: string, contactID: string): Promise<boolean> {
    const r = await this.client.mutate<{ unsubscribeOrganizationContactFromMailing: boolean }>(
      mailingMutations.UNSUBSCRIBE_ORGANIZATION_CONTACT, { organizationID, contactID });
    return r.unsubscribeOrganizationContactFromMailing === true;
  }
}
