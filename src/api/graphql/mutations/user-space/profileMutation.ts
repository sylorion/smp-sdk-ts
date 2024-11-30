const profileMutations = {
    // MUTATION TO CREATE A PROFILE
    CREATE_PROFILE: `
      mutation CreateProfile($input: CreateProfileInput!) {
        createProfile(input: $input) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // MUTATION TO UPDATE A PROFILE
    UPDATE_PROFILE: `
      mutation UpdateProfile($profileID: ID!, $input: UpdateProfileInput!) {
        updateProfile(profileID: $profileID, input: $input) {
          profileID
          uniqRef
          slug
          firstName
          lastName
          dateOfBirth
          gender
          nationality
          phoneNumber
          locationID
          idCardNumber
          passportNumber
          socialSecurityNumber
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // MUTATION TO DELETE A PROFILE
    DELETE_PROFILE: `
      mutation DeleteProfile($profileID: ID!) {
        deleteProfile(profileID: $profileID) {
          success
          message
        }
      }
    `,
  };
  
  export { profileMutations };
  