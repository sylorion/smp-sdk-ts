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
    mutation UpdateOrganizationContact($contactID: ID!, $callerUserID: ID!, $input: UpdateContactInput!) {
      updateOrganizationContact(contactID: $contactID, callerUserID: $callerUserID, input: $input) {
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
    mutation DeleteOrganizationContact($contactID: ID!, $callerUserID: ID!) {
      deleteOrganizationContact(contactID: $contactID, callerUserID: $callerUserID) {
        success
        message
      }
    }
  `,

  BULK_CREATE_CONTACTS: `
    mutation BulkCreateOrganizationContacts($organizationID: ID!, $callerUserID: ID!, $contacts: [BulkContactInput!]!) {
      bulkCreateOrganizationContacts(organizationID: $organizationID, callerUserID: $callerUserID, contacts: $contacts) {
        success
        created
        skipped
        message
      }
    }
  `,

  SET_CONTACT_PRIVACY: `
    mutation SetOrganizationContactPrivacy($contactID: ID!, $callerUserID: ID!, $isPrivate: Boolean!) {
      setOrganizationContactPrivacy(contactID: $contactID, callerUserID: $callerUserID, isPrivate: $isPrivate) {
        contactID
        isPrivate
      }
    }
  `,
};
