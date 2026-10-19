/**
 * E-mailing CRM d'une organisation (mu-organization, domaine mailing) : aperçu des destinataires,
 * envoi, historique. L'appelant est l'identité signée de la requête (capacité `mailing.send`).
 * La désinscription d'un contact est réservée aux services internes (`x-smp-internal-secret`).
 */
const MAILING_FIELDS = 'mailingID subject excerpt sentAt actorUserID recipientCount status campaignID delivered failedCount';
const CAMPAIGN_FIELDS = `campaignID name status subject preheader body
  design { layout color logo ctaLabel ctaUrl signature }
  audience { statuses tags contactIDs label }
  scheduledAt mailingID sentAt recipientCount deliveredCount failedCount failureReason origin createdBy createdAt updatedBy updatedAt`;
const EMAIL_SETTINGS_FIELDS = 'template { layout color logo signature footer } canCustomize';

export const mailingQueries = {
  LIST_ORGANIZATION_MAILINGS: `query OrganizationMailings($organizationID: ID!) { organizationMailings(organizationID: $organizationID) { ${MAILING_FIELDS} } }`,
  PREVIEW_ORGANIZATION_MAILING: `query OrganizationMailingPreview($organizationID: ID!, $segment: MailingSegmentInput) {
    organizationMailingPreview(organizationID: $organizationID, segment: $segment) {
      recipientCount excludedOptOut excludedNoEmail duplicates sample maxRecipients remainingToday
    }
  }`,
  /** Campagnes (30 au plus) : contenu, mise en forme et audience propres à chacune. */
  LIST_ORGANIZATION_CAMPAIGNS: `query OrganizationCampaigns($organizationID: ID!) { organizationCampaigns(organizationID: $organizationID) { ${CAMPAIGN_FIELDS} } }`,
  /** Charte e-mail de l'organisation et droit du plan à la personnaliser (`CUSTOMIZE_EMAILS`). */
  ORGANIZATION_EMAIL_SETTINGS: `query OrganizationEmailSettings($organizationID: ID!) { organizationEmailSettings(organizationID: $organizationID) { ${EMAIL_SETTINGS_FIELDS} } }`,
  /** Dernier e-mail envoyé à chaque contact visible. */
  ORGANIZATION_CONTACTS_LAST_MAILED: `query OrganizationContactsLastMailed($organizationID: ID!) { organizationContactsLastMailed(organizationID: $organizationID) { contactID lastMailedAt } }`,
};

export const mailingMutations = {
  SEND_ORGANIZATION_MAILING: `mutation SendOrganizationMailing($input: SendOrganizationMailingInput!) { sendOrganizationMailing(input: $input) { ${MAILING_FIELDS} } }`,
  SAVE_ORGANIZATION_CAMPAIGN: `mutation SaveOrganizationCampaign($input: SaveOrganizationCampaignInput!) { saveOrganizationCampaign(input: $input) { ${CAMPAIGN_FIELDS} } }`,
  DUPLICATE_ORGANIZATION_CAMPAIGN: `mutation DuplicateOrganizationCampaign($organizationID: ID!, $campaignID: ID!) {
    duplicateOrganizationCampaign(organizationID: $organizationID, campaignID: $campaignID) { ${CAMPAIGN_FIELDS} }
  }`,
  DELETE_ORGANIZATION_CAMPAIGN: `mutation DeleteOrganizationCampaign($organizationID: ID!, $campaignID: ID!) { deleteOrganizationCampaign(organizationID: $organizationID, campaignID: $campaignID) }`,
  SEND_ORGANIZATION_CAMPAIGN: `mutation SendOrganizationCampaign($organizationID: ID!, $campaignID: ID!) {
    sendOrganizationCampaign(organizationID: $organizationID, campaignID: $campaignID) { ${CAMPAIGN_FIELDS} }
  }`,
  SAVE_ORGANIZATION_EMAIL_TEMPLATE: `mutation SaveOrganizationEmailTemplate($input: SaveOrganizationEmailTemplateInput!) { saveOrganizationEmailTemplate(input: $input) { ${EMAIL_SETTINGS_FIELDS} } }`,
  UNSUBSCRIBE_ORGANIZATION_CONTACT: `mutation UnsubscribeOrganizationContactFromMailing($organizationID: ID!, $contactID: ID!) {
    unsubscribeOrganizationContactFromMailing(organizationID: $organizationID, contactID: $contactID)
  }`,
};
