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
  
  
// MUTATION TO VERIFY AN INVITATION TOKEN
  VERIFY_INVITATION_TOKEN: `
  mutation VerifyInvitationToken($input: VerifyInvitationTokenInput!) {
    verifyInvitationToken(input: $input) {
      success
      message
      email
      organizationID
      userExists
    }
  }
    `,

// MUTATION TO INVITE A USER TO AN ORGANIZATION
  INVITE_USER_TO_ORGANIZATION: `
    mutation InviteUserToOrganization($input: InviteUserToOrganizationInput!) {
      inviteUserToOrganization(input: $input) {
        success
        message
        
      }
    }`,

// MUTATION TO CREATE A USER ORGANIZATION
  CREATE_USER_ORGANIZATION: `
    mutation CreateUserOrganization($input: CreateUserOrganizationInput!) {
      createUserOrganization(input: $input) {
        userOrganizationID
        uniqRef
        slug
        authorID
        legend
        userID
        roleID
        organizationID
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
      `
};
  export { organizationMutations };
  