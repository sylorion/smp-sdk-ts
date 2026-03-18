import { gql } from 'graphql-request';

// =========================================
// Source: organization/organizationMediaQueries.ts
// =========================================
const organizationMediaQueries = {
  // QUERY TO GET A SINGLE ORGANIZATION MEDIA BY ID
  GET_ORGANIZATION_MEDIA: `
      query GetOrganizationMediaByID($organizationMediaID: ID!) {
        organizationMediaByID(organizationMediaID: $organizationMediaID) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
             mediaID
             url
          }
        }
      }
    `,
  GET_ORGANIZATION_MEDIA_BY_ID: `
      query GetOrganizationMediaByID($organizationMediaID: ID!) {
        organizationMediaByID(organizationMediaID: $organizationMediaID) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
             mediaID
             url
          }
        }
      }
    `,

  // QUERY TO GET ALL ORGANIZATION MEDIAS WITH PAGINATION, SORTING, AND FILTERING
  GET_ORGANIZATION_MEDIAS: `
      query GetOrganizationMedias($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        organizationMedias(pagination: $pagination, sort: $sort, filter: $filter) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
            mediaID
            url
          }
        }
      }
    `,

  // QUERY TO GET MULTIPLE ORGANIZATION MEDIAS BY AN ARRAY OF IDS
  GET_ORGANIZATION_MEDIAS_BY_IDS: `
      query GetOrganizationMediasByIDs($organizationMediaIDs: [ID!]!) {
        organizationMediasByIDs(organizationMediaIDs: $organizationMediaIDs) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
            mediaID
            url
          }
        }
      }
    `,

  // QUERY TO GET AN ORGANIZATION MEDIA BY ITS UNIQUE REFERENCE
  GET_ORGANIZATION_MEDIA_BY_UNIQ_REF: `
      query GetOrganizationMediaByUniqRef($uniqRef: String!) {
        organizationMediaByUniqRef(uniqRef: $uniqRef) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
            mediaID
            url
          }
        }
      }
    `,

  // QUERY TO GET AN ORGANIZATION MEDIA BY ITS SLUG
  GET_ORGANIZATION_MEDIA_BY_SLUG: `
      query GetOrganizationMediaBySlug($slug: String!) {
        organizationMediaBySlug(slug: $slug) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
            mediaID
            url
          }
        }
      }
    `,

  // QUERY TO GET MULTIPLE ORGANIZATION MEDIAS BY AN ARRAY OF SLUGS
  GET_ORGANIZATION_MEDIAS_BY_SLUGS: `
      query GetOrganizationMediasBySlugs($slugs: [String!]!) {
        organizationMediasBySlugs(slugs: $slugs) {
          organizationMediaID
          uniqRef
          slug
          legend
          listingPosition
          organizationID
          mediaID
          state
          createdAt
          updatedAt
          deletedAt
          media {
            mediaID
            url
          }
        }
      }
    `
};

export { organizationMediaQueries };

// =========================================
// Source: organization/organizationQueries.ts
// =========================================
const organizationQueries = {
  // QUERY TO GET A SINGLE ORGANIZATION BY ITS ID
  GET_ORGANIZATION_BY_ID: `
      query GetOrganizationByID($organizationID: ID!) {
        organizationByID(organizationID: $organizationID) {
          organizationID
          uniqRef
          slug
          authorID
          ownerID
          orgRef
          sectorID
          legalName
          brand
          sigle
          smallLogo
          bigLogo
          banner
          smallLogoUrl
          bigLogoUrl
          bannerUrl
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          insuranceRef
          insuranceName
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          sectorID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
          updatedAt
        }
      }
    `,

  // QUERY TO GET ALL ORGANIZATIONS WITH OPTIONAL PAGINATION, SORTING, AND FILTERING
  GET_ORGANIZATIONS: `
      query GetOrganizations($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        organizations(pagination: $pagination, sort: $sort, filter: $filter) {
          organizationID
          uniqRef
          slug
          authorID
          ownerID
          orgRef
          sectorID
          legalName
          brand
          sigle
          smallLogo
          bigLogo
          banner
          smallLogoUrl
          bigLogoUrl
          bannerUrl
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          insuranceRef
          insuranceName
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          sectorID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
          updatedAt
        }
      }
    `,

  // QUERY TO GET AN ORGANIZATION BY ITS UNIQUE REFERENCE
  GET_ORGANIZATION_BY_UNIQ_REF: `
      query GetOrganizationByUniqRef($uniqRef: String!) {
        organizationByUniqRef(uniqRef: $uniqRef) {
          organizationID
          uniqRef
          slug
          authorID
          ownerID
          orgRef
          sectorID
          legalName
          brand
          sigle
          smallLogo
          bigLogo
          banner
          smallLogoUrl
          bigLogoUrl
          bannerUrl
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          insuranceRef
          insuranceName
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          sectorID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
          updatedAt
        }
      }
    `,

  // QUERY TO GET AN ORGANIZATION BY ITS SLUG
  GET_ORGANIZATION_BY_SLUG: `
      query GetOrganizationBySlug($slug: String!) {
        organizationBySlug(slug: $slug) {
          organizationID
          uniqRef
          slug
          authorID
          ownerID
          orgRef
          sectorID
          legalName
          brand
          sigle
          smallLogo
          bigLogo
          banner
          smallLogoUrl
          bigLogoUrl
          bannerUrl
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          insuranceRef
          insuranceName
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          sectorID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
          updatedAt
        }
      }
    `,

  // QUERY TO GET MULTIPLE ORGANIZATIONS BY AN ARRAY OF IDS
  GET_ORGANIZATIONS_BY_IDS: `
      query GetOrganizationsByIDs($organizationIDs: [ID!]!) {
        organizationsByIDs(organizationIDs: $organizationIDs) {
          organizationID
          uniqRef
          slug
          authorID
          ownerID
          orgRef
          sectorID
          legalName
          brand
          sigle
          smallLogo
          bigLogo
          banner
          smallLogoUrl
          bigLogoUrl
          bannerUrl
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          insuranceRef
          insuranceName
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          sectorID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
          updatedAt
        }
      }
    `,

  // QUERY TO GET MULTIPLE ORGANIZATIONS BY AN ARRAY OF SLUGS
  GET_ORGANIZATIONS_BY_SLUGS: `
      query GetOrganizationsBySlugs($slugs: [String!]!) {
        organizationsBySlugs(slugs: $slugs) {
          organizationID
          uniqRef
          slug
          authorID
          ownerID
          orgRef
          sectorID
          legalName
          brand
          sigle
          smallLogo
          bigLogo
          banner
          smallLogoUrl
          bigLogoUrl
          bannerUrl
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          insuranceRef
          insuranceName
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          sectorID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
          updatedAt
        }
      }
    `,

  // QUERY TO GET A LIST OF ORGANIZATION MEMBERS
  GET_ORGANIZATION_MEMBERS: `
    query ListOrganizationMembers($organizationId: ID!) {
      listOrganizationMembers(organizationID: $organizationId) {
        members {
          userID
          role
          username
          email
          name
          lastname
          joinedAt
          profilePicture
        }
        totalMembers
      }
    }
  `,

  // QUERY TO GET A LIST OF ORGANIZATION MEMBERS
  GET_USER_ORGANIZATIONS: `
    query GetUserOrganizations($userId: ID!) {
      getUserOrganizations(userID: $userId) {
        organizationID
        organizationName
        sectorID
        smallLogoUrl
        userRole {
          roleID
          roleName
        }
      }
    }
  `
};

export { organizationQueries };
