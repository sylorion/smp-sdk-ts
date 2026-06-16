export const contactMutations = {
  CREATE_CONTACT: `
    mutation CreateOrganizationContact($input: CreateContactInput!) {
      createOrganizationContact(input: $input) {
        contactID
        uniqRef
        slug
        organizationID
        contactType
        firstName
        lastName
        displayName
        companyName
        email
        phoneCountryCode
        phone
        mobilePhone
        website
        locationID
        contactStatus
        source
        isPrivate
        ownerUserOrgID
        assignedToUserOrgID
        createdAt
      }
    }
  `,

  UPDATE_CONTACT: `
    mutation UpdateOrganizationContact($contactID: ID!, $input: UpdateContactInput!) {
      updateOrganizationContact(contactID: $contactID, input: $input) {
        contactID
        uniqRef
        slug
        organizationID
        contactType
        firstName
        lastName
        displayName
        companyName
        email
        phoneCountryCode
        phone
        mobilePhone
        website
        locationID
        socialProfiles
        contactStatus
        source
        tags
        notes
        isPrivate
        ownerUserOrgID
        assignedToUserOrgID
        state
        createdAt
        updatedAt
      }
    }
  `,

  DELETE_CONTACT: `
    mutation DeleteOrganizationContact($contactID: ID!) {
      deleteOrganizationContact(contactID: $contactID) {
        success
        message
      }
    }
  `,

  BULK_CREATE_CONTACTS: `
    mutation BulkCreateOrganizationContacts($organizationID: ID!, $contacts: [BulkContactInput!]!) {
      bulkCreateOrganizationContacts(organizationID: $organizationID, contacts: $contacts) {
        success
        created
        skipped
        message
      }
    }
  `,

  SET_CONTACT_PRIVACY: `
    mutation SetOrganizationContactPrivacy($contactID: ID!, $isPrivate: Boolean!) {
      setOrganizationContactPrivacy(contactID: $contactID, isPrivate: $isPrivate) {
        contactID
        isPrivate
      }
    }
  `,
};
