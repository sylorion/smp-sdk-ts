/**
 * E-mailing CRM d'une organisation (mu-organization, domaine mailing) : aperçu des destinataires,
 * envoi, historique. L'appelant est l'identité signée de la requête (capacité `mailing.send`).
 * La désinscription d'un contact est réservée aux services internes (`x-smp-internal-secret`).
 */
const MAILING_FIELDS = 'mailingID subject excerpt sentAt actorUserID recipientCount status';

export const mailingQueries = {
  LIST_ORGANIZATION_MAILINGS: `query OrganizationMailings($organizationID: ID!) { organizationMailings(organizationID: $organizationID) { ${MAILING_FIELDS} } }`,
  PREVIEW_ORGANIZATION_MAILING: `query OrganizationMailingPreview($organizationID: ID!, $segment: MailingSegmentInput) {
    organizationMailingPreview(organizationID: $organizationID, segment: $segment) {
      recipientCount excludedOptOut excludedNoEmail duplicates sample maxRecipients remainingToday
    }
  }`,
};

export const mailingMutations = {
  SEND_ORGANIZATION_MAILING: `mutation SendOrganizationMailing($input: SendOrganizationMailingInput!) { sendOrganizationMailing(input: $input) { ${MAILING_FIELDS} } }`,
  UNSUBSCRIBE_ORGANIZATION_CONTACT: `mutation UnsubscribeOrganizationContactFromMailing($organizationID: ID!, $contactID: ID!) {
    unsubscribeOrganizationContactFromMailing(organizationID: $organizationID, contactID: $contactID)
  }`,
};
