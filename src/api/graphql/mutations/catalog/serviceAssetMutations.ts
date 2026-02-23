const serviceAssetMutations = {
  // MUTATION POUR CRÉER UN SERVICE ASSET
  CREATE_SERVICE_ASSET: `
      mutation CreateServiceAsset($input: CreateServiceAssetInput!) {
        createServiceAsset(input: $input) {
          serviceAssetID
          uniqRef
          slug
          assetID
          serviceID
          legend
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // MUTATION POUR METTRE À JOUR UN SERVICE ASSET
  UPDATE_SERVICE_ASSET: `
      mutation UpdateServiceAsset($serviceAssetID: ID!, $input: UpdateServiceAssetInput!) {
        updateServiceAsset(serviceAssetID: $serviceAssetID, input: $input) {
          serviceAssetID
          uniqRef
          slug
          assetID
          serviceID
          legend
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // MUTATION POUR SUPPRIMER UN SERVICE ASSET
  DELETE_SERVICE_ASSET: `
      mutation DeleteServiceAsset($serviceAssetID: ID!) {
        deleteServiceAsset(serviceAssetID: $serviceAssetID) {
          success
          message
        }
      }
    `,

  // MUTATION POUR LIER UN ASSET À UN SERVICE
  LINK_ASSET_TO_SERVICE: `
      mutation LinkAssetToService($serviceID: String!, $assetID: String!, $authorID: String!) {
        linkAssetToService(serviceID: $serviceID, assetID: $assetID, authorID: $authorID) {
          serviceAssetID
          uniqRef
          slug
          assetID
          serviceID
          legend
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,

  // MUTATION POUR DÉLIER UN ASSET D'UN SERVICE
  UNLINK_ASSET_FROM_SERVICE: `
      mutation UnlinkAssetFromService($serviceID: String!, $assetID: String!) {
        unlinkAssetFromService(serviceID: $serviceID, assetID: $assetID) {
          success
          message
        }
      }
    `,
};

export { serviceAssetMutations };
