// Mutations for user-organization relationships
const userOrganizationMutations = {
  // MUTATION TO ADD USER TO ORGANIZATION
  ADD_USER_TO_ORGANIZATION: `
    mutation AddUserToOrganization($input: AddUserToOrganizationInput!) {
      addUserToOrganization(input: $input) {
        success
        message
        userOrganization {
          userOrganizationId
          userId
          organizationId
          role
          status
          joinedAt
          createdAt
          updatedAt
        }
      }
    }
  `,

  // MUTATION TO REMOVE USER FROM ORGANIZATION
  REMOVE_USER_FROM_ORGANIZATION: `
    mutation RemoveUserFromOrganization($input: RemoveUserFromOrganizationInput!) {
      removeUserFromOrganization(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO UPDATE USER ROLE IN ORGANIZATION
  UPDATE_USER_ROLE_IN_ORGANIZATION: `
    mutation UpdateUserRoleInOrganization($input: UpdateUserRoleInOrganizationInput!) {
      updateUserRoleInOrganization(input: $input) {
        success
        message
        userOrganization {
          userOrganizationId
          userId
          organizationId
          role
          status
          joinedAt
          createdAt
          updatedAt
        }
      }
    }
  `
};

export { userOrganizationMutations };
