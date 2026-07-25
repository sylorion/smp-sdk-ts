import { gql } from 'graphql-request';

// =========================================
// Source: organization/organizationMediaMutations.ts
// =========================================
export const CREATE_ORGANIZATION_MEDIA = `
  mutation CreateOrganizationMedia($input: CreateOrganizationMediaInput!) {
    createOrganizationMedia(input: $input) {
      organizationMediaID
      mediaID
      legend
      listingPosition
      state
      media {
        mediaID
        url
        originalName
        finalName
      }
    }
  }
`;

export const UPDATE_ORGANIZATION_MEDIA = `
  mutation UpdateOrganizationMedia($input: UpdateOrganizationMediaInput!) {
    updateOrganizationMedia(input: $input) {
      organizationMediaID
      mediaID
      legend
      listingPosition
      state
      media {
        mediaID
        url
        originalName
        finalName
      }
    }
  }
`;

export const DELETE_ORGANIZATION_MEDIA = `
  mutation DeleteOrganizationMedia($organizationMediaID: ID!) {
    deleteOrganizationMedia(organizationMediaID: $organizationMediaID) {
      success
    }
  }
`;

export const organizationMediaMutations = {
  CREATE_ORGANIZATION_MEDIA,
  UPDATE_ORGANIZATION_MEDIA,
  DELETE_ORGANIZATION_MEDIA,
}; 
// =========================================
// Source: organization/organizationMutation.ts
// =========================================
export const organizationMutations = {
  // MUTATION TO CREATE AN ORGANIZATION
  CREATE_ORGANIZATION: `
    mutation CreateOrganization($input: OrganizationInput!) {
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
        parentOrganizationID
        advancedAttributes
        state
        createdAt
        updatedAt
      }
    }
  `,

  // MUTATION TO UPDATE AN ORGANIZATION
  UPDATE_ORGANIZATION: `
    mutation UpdateOrganization($organizationID: ID!, $input: OrganizationInput!) {
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
        parentOrganizationID
        advancedAttributes
        state
        createdAt
        updatedAt
      }
    }
  `,

  // MUTATION TO DELETE AN ORGANIZATION
  DELETE_ORGANIZATION: `
    mutation DeleteOrganization($organizationID: ID!) {
      deleteOrganization(organizationID: $organizationID) {
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
        parentOrganizationID
        advancedAttributes
        state
        createdAt
        updatedAt
        deletedAt
      }
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
        userID
        firstName
        lastName
      }
    }
  `,

  // MUTATION TO INVITE A USER TO AN ORGANIZATION
  INVITE_USER_TO_ORGANIZATION: `
    mutation InviteUserToOrganization($input: InviteUserToOrganizationInput!) {
      inviteUserToOrganization(input: $input) {
        success
        message
        token
        email
        organizationID
        organizationName
        firstName
        lastName
      }
    }
  `,

  // MUTATION TO CREATE A USER ORGANIZATION
  CREATE_USER_ORGANIZATION: `
    mutation CreateUserOrganization($input: AddUserToOrganizationInput!) {
      addUserToOrganization(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO UPDATE A USER ORGANIZATION
  UPDATE_USER_ROLE_IN_ORGANIZATION: `
    mutation UpdateUserRoleInOrganization($input: UpdateUserRoleInOrganizationInput!) {
      updateUserRoleInOrganization(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO REMOVE A USER FROM AN ORGANIZATION
  REMOVE_USER_FROM_ORGANIZATION: `
    mutation RemoveUserFromOrganization($input: RemoveUserFromOrganizationInput!) {
      removeUserFromOrganization(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO REMOVE AN INVITATION
  REMOVE_INVITATION: `
    mutation RemoveInvitation($input: RemoveInvitationInput!) {
      removeInvitation(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO ADD USER TO ORGANIZATION
  ADD_USER_TO_ORGANIZATION: `
    mutation AddUserToOrganization($input: AddUserToOrganizationInput!) {
      addUserToOrganization(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO UPDATE A MEMBER'S PROFILE IN AN ORGANIZATION
  UPDATE_MEMBER_PROFILE: `
    mutation UpdateMemberProfile($input: UpdateMemberProfileInput!) {
      updateMemberProfile(input: $input) {
        success
        message
        userID
        jobTitle
        missionDescription
      }
    }
  `,

  // MUTATION TO RESEND AN INVITATION
  RESEND_INVITATION: `
    mutation ResendInvitation($input: ResendInvitationInput!) {
      resendInvitation(input: $input) {
        success
        message
        token
      }
    }
  `,

  // MUTATION TO INITIATE AN OWNER TRANSFER (generates OTP)
  INITIATE_OWNER_TRANSFER: `
    mutation InitiateOwnerTransfer($input: InitiateOwnerTransferInput!) {
      initiateOwnerTransfer(input: $input) {
        success
        message
      }
    }
  `,

  // MUTATION TO VALIDATE AN OWNER TRANSFER (verifies OTP and completes transfer)
  VALIDATE_OWNER_TRANSFER: `
    mutation ValidateOwnerTransfer($input: ValidateOwnerTransferInput!) {
      validateOwnerTransfer(input: $input) {
        success
        message
      }
    }
  `
};

// =========================================
// Source: organization/userOrganization.ts
// =========================================
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

