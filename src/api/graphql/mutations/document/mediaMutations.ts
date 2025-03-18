const mediaMutations = {

    CREATE_MEDIA: `
    mutation CreateMedia($input: MediaInput!) {
        createMedia(input: $input) {
          mediaID
          uniqRef
          slug
          authorID
          mediaType
          legend
          summary
          originalName
          finalName
          url
          size
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
      `
};

export { mediaMutations };