export const profileQueries = {
    // Query to get a single profile by ID
    GET_PROFILE: `
      query Profile($profileId: ID!) {
        profile(profileID: $profileId) {
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
    
    // Query to get all profiles
    GET_PROFILES: `
      query Profiles {
        profiles {
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
  };
  