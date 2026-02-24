import { gql } from 'graphql-request';

// =========================================
// Source: catalog/assetMediaMutations.ts
// =========================================
const assetMediaMutations = {
  CREATE_ASSET_MEDIA: `
    mutation CreateAssetMedia($input: CreateAssetMediaInput!) {
      createAssetMedia(input: $input) {
        assetMediaID
        assetID
        mediaID
        listingPosition
        legend
        state
        media {
          url
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  UPDATE_ASSET_MEDIA: `
    mutation UpdateAssetMedia($assetMediaID: ID!, $input: UpdateAssetMediaInput!) {
      updateAssetMedia(assetMediaID: $assetMediaID, input: $input) {
        assetMediaID
        assetID
        mediaID
        listingPosition
        legend
        state
        media {
          url
        }
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  DELETE_ASSET_MEDIA: `
    mutation DeleteAssetMedia($assetMediaID: ID!) {
      deleteAssetMedia(assetMediaID: $assetMediaID) {
        success
        message
      }
    }
  `
};

export { assetMediaMutations }; 
// =========================================
// Source: catalog/assetMutations.ts
// =========================================
const assetMutations = {
    // MUTATION POUR CRÉER UN ASSET
    CREATE_ASSET: `
      mutation CreateAsset($input: CreateAssetInput!) {
        createAsset(input: $input) {
          assetID
          uniqRef
          slug
          title
          authorID
          organizationID
          mediaID
          description
          price
          legalVatPercent
          quantity
          stockQuantity
          maxPerReservation
          conflictingAssets
          applyableAssets
          details
          state
          createdAt
          updatedAt
          deletedAt
        }
      }
    `,
  
    // MUTATION POUR METTRE À JOUR UN ASSET
    UPDATE_ASSET: `
      mutation UpdateAsset($assetID: ID!, $input: UpdateAssetInput!) {
        updateAsset(assetID: $assetID, input: $input) {
          assetID
          slug
          title
          authorID
          organizationID
          mediaID
          description
          price
          legalVatPercent
          quantity
          stockQuantity
          maxPerReservation
          conflictingAssets
          applyableAssets
          details
          state
          createdAt
          updatedAt
        }
      }
    `,
  
    // MUTATION POUR SUPPRIMER UN ASSET
    DELETE_ASSET: `
      mutation DeleteAsset($assetID: ID!) {
        deleteAsset(assetID: $assetID) {
          success
          message
        }
      }
    `,
  };
  
  export { assetMutations };
  
// =========================================
// Source: catalog/serviceAssetMutations.ts
// =========================================
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

// =========================================
// Source: catalog/serviceMediaMutation.ts
// =========================================
const serviceMediaMutations = {
  CREATE_SERVICE_MEDIA: `
    mutation CreateServiceMedia($input: CreateServiceMediaInput!) {
      createServiceMedia(input: $input) {
        serviceMediaID
        uniqRef
        slug
        mediaID
        serviceID
        legend
        listingPosition
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  UPDATE_SERVICE_MEDIA: `
    mutation UpdateServiceMedia($serviceMediaID: ID!, $input: UpdateServiceMediaInput!) {
      updateServiceMedia(serviceMediaID: $serviceMediaID, input: $input) {
        serviceMediaID
        uniqRef
        slug
        mediaID
        serviceID
        legend
        listingPosition
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  DELETE_SERVICE_MEDIA: `
    mutation DeleteServiceMedia($serviceMediaID: ID!) {
      deleteServiceMedia(serviceMediaID: $serviceMediaID) {
        success
        message
      }
    }
  `
};

export { serviceMediaMutations }; 
// =========================================
// Source: catalog/serviceMutation.ts
// =========================================
const serviceMutations = {
    // MUTATION TO CREATE A SERVICE
    CREATE_SERVICE: `
      mutation CreateService($input: CreateServiceInput!) {
        createService(input: $input) {
          serviceID
          uniqRef
          slug
          authorID
          title
          description
          mediaBannerID
          termsAndConditionsID
          parentServiceID
          topicID
          organizationID
          locationID
          paymentConfigID
          price
          legalVatPercent
          lowerPrice
          upperPrice
          negotiable
          perimeter
          supplyType
          uptakeForm
          billingPlan
          onlineService
          advancedAttributes
          poweredByAgent
          agentConfiguration
          state
          createdAt
          updatedAt
          deletedAt
          serviceMedias {
            serviceMediaID
            listingPosition
            legend
            media {
              url
            }
          }
        }
      }
    `,
  
    // MUTATION TO UPDATE A SERVICE
    UPDATE_SERVICE: `
      mutation UpdateService($serviceID: ID!, $input: UpdateServiceInput!) {
        updateService(serviceID: $serviceID, input: $input) {
          serviceID
          uniqRef
          slug
          authorID
          title
          description
          mediaBannerID
          termsAndConditionsID
          parentServiceID
          topicID
          organizationID
          locationID
          paymentConfigID
          price
          legalVatPercent
          lowerPrice
          upperPrice
          negotiable
          perimeter
          supplyType
          uptakeForm
          billingPlan
          onlineService
          advancedAttributes
          poweredByAgent
          agentConfiguration
          state
          createdAt
          updatedAt
          deletedAt
          serviceMedias {
            serviceMediaID
            listingPosition
            legend
            media {
              url
            }
          }
        }
      }
    `,
  
    // MUTATION TO DELETE A SERVICE
    DELETE_SERVICE: `
      mutation DeleteService($serviceID: ID!) {
        deleteService(serviceID: $serviceID) {
          success
          message
        }
      }
    `,
    // MUTATION POUR AJOUTER UN SERVICE AUX FAVORIS
  ADD_SERVICE_TO_FAVORITES: `
  mutation AddServiceToFavorites($input: AddServiceToFavoritesInput!) {
    addServiceToFavorites(input: $input) {
      serviceID
      userID
      addedAt
    }
  }`,
  
  };
  
  export { serviceMutations };
  
// =========================================
// Source: document/mediaMutation.ts
// =========================================
const mediaMutations = {
  CREATE_MEDIA: `
    mutation CreateMedia($input: CreateMediaInput!) {
      createMedia(input: $input) {
        mediaID
        authorID
        mediaType
        originalName
        finalName
        url
        size
        entityID
        entityName
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  UPDATE_MEDIA: `
    mutation UpdateMedia($mediaID: ID!, $input: UpdateMediaInput!) {
      updateMedia(mediaID: $mediaID, input: $input) {
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
        entityID
        metadata
        entityName
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  DELETE_MEDIA: `
    mutation DeleteMedia($mediaID: ID!) {
      deleteMedia(mediaID: $mediaID) {
        success
        message
      }
    }
  `
};

export { mediaMutations };

// =========================================
// Source: location/placeMutation.ts
// =========================================
const placeMutations = {
    // MUTATION TO CREATE A PLACE
    CREATE_PLACE: `
        mutation CreatePlace($input: CreatePlaceInput!) {
            createPlace(input: $input) {
                placeID
          
            }
        }
    `,

    // MUTATION TO UPDATE A PLACE
    UPDATE_PLACE: `
        mutation UpdatePlace($placeId: ID!, $input: UpdatePlaceInput!) {
            updatePlace(placeID: $placeId, input: $input) {
                city
                country
            }
        }
    `
};

export { placeMutations };
