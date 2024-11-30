const organizationMutations = {
    // MUTATION TO CREATE AN ORGANIZATION
    CREATE_ORGANIZATION: `
      mutation CreateOrganization($input: CreateOrganizationInput!) {
        createOrganization(input: $input) {
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
          smallLogoID
          bigLogoID
          bannerID
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
   
        }
      }
    `,
  
    // MUTATION TO UPDATE AN ORGANIZATION
    UPDATE_ORGANIZATION: `
      mutation UpdateOrganization($organizationID: ID!, $input: UpdateOrganizationInput!) {
        updateOrganization(organizationID: $organizationID, input: $input) {
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
          smallLogoID
          bigLogoID
          bannerID
          oSize
          juridicForm
          juridicCatLabel
          juridicCatCode
          currency
          legalUniqIdentifier
          vatNumber
          communityVATNumber
          capital
          activityStartedAt
          activityEndedAt
          description
          summary
          locationID
          parentOrganizationID
          advancedAttributes
          state
          createdAt
        }
      }
    `,
  
    // MUTATION TO DELETE AN ORGANIZATION
    DELETE_ORGANIZATION: `
      mutation DeleteOrganization($organizationID: ID!) {
        deleteOrganization(organizationID: $organizationID)
      }
    `,
  };
  
  export { organizationMutations };
  