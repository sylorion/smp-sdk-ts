export const contactQueries = {
  GET_ORGANIZATION_CONTACTS: `
    query GetOrganizationContacts(
      $organizationID: ID!,
      $callerUserID: ID!,
      $search: String,
      $status: OrgContactStatus,
      $source: OrgContactSource,
      $page: Int,
      $pageSize: Int
    ) {
      organizationContacts(
        organizationID: $organizationID,
        callerUserID: $callerUserID,
        search: $search,
        status: $status,
        source: $source,
        page: $page,
        pageSize: $pageSize
      ) {
        contactID
        uniqRef
        slug
        authorID
        organizationID
        userID
        assignedToUserOrgID
        isPrivate
        ownerUserOrgID
        contactType
        firstName
        lastName
        displayName
        companyName
        siret
        vatNumber
        legalForm
        rcs
        capital
        logoUrl
        email
        phoneCountryCode
        phone
        mobilePhone
        fax
        website
        locationID
        location {
          placeID
        }
        socialProfiles
        contactStatus
        source
        tags
        notes
        preferredLanguage
        preferredCurrency
        isVatExempt
        defaultPaymentTerms
        creditLimit
        state
        createdAt
        updatedAt
      }
    }
  `,

  GET_ORGANIZATION_CONTACT: `
    query GetOrganizationContact($contactID: ID!, $callerUserID: ID!) {
      organizationContact(contactID: $contactID, callerUserID: $callerUserID) {
        contactID
        uniqRef
        slug
        authorID
        organizationID
        userID
        assignedToUserOrgID
        isPrivate
        ownerUserOrgID
        contactType
        firstName
        lastName
        displayName
        companyName
        siret
        vatNumber
        legalForm
        rcs
        capital
        logoUrl
        email
        phoneCountryCode
        phone
        mobilePhone
        fax
        website
        locationID
        location {
          placeID
        }
        socialProfiles
        contactStatus
        source
        tags
        notes
        preferredLanguage
        preferredCurrency
        isVatExempt
        defaultPaymentTerms
        creditLimit
        state
        createdAt
        updatedAt
      }
    }
  `,

  SEARCH_ORGANIZATION_CONTACTS: `
    query SearchOrganizationContacts($organizationID: ID!, $callerUserID: ID!, $query: String!, $limit: Int) {
      searchOrganizationContacts(organizationID: $organizationID, callerUserID: $callerUserID, query: $query, limit: $limit) {
        contactID
        contactType
        firstName
        lastName
        displayName
        companyName
        email
        phoneCountryCode
        phone
        locationID
        location {
          placeID
        }
        vatNumber
        siret
        contactStatus
        isPrivate
      }
    }
  `,
};
