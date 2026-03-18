import { gql } from 'graphql-request';

// =========================================
// Source: catalog/assetMediaQueries.ts
// =========================================
export const assetMediaQueries = {
  GET_ASSET_MEDIA: `
    query GetAssetMedia($assetMediaID: ID!) {
      assetMedia(assetMediaID: $assetMediaID) {
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

  GET_ASSET_MEDIAS: `
    query GetAssetMedias($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
      assetMedias(pagination: $pagination, sort: $sort, filter: $filter) {
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

  GET_ASSET_MEDIAS_BY_IDS: `
    query GetAssetMediasByIDs($assetMediaIDs: [ID!]!) {
      assetMediasByIDs(assetMediaIDs: $assetMediaIDs) {
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
  `
};
// =========================================
// Source: catalog/assetQueries.ts
// =========================================
const assetQueries = {
  // Récupère un asset via son ID
  GET_ASSET: `
    query GetAsset($assetID: ID!) {
      asset(assetID: $assetID) {
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
        medias {
          assetMediaID
          listingPosition
          legend
          state
          media {
            url
          }
        }
      }
    }
  `,

  // Récupère la liste de tous les assets avec pagination, tri et filtres éventuels
  GET_ASSETS: `
    query GetAssets($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
      assets(pagination: $pagination, sort: $sort, filter: $filter) {
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
        medias {
          assetMediaID
          listingPosition
          legend
          state
          media {
            url
          }
        }
      }
    }
  `,

  // Récupère un asset via son slug
  GET_ASSET_BY_SLUG: `
    query GetAssetBySlug($slug: String!) {
      assetBySlug(slug: $slug) {
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
        medias {
          assetMediaID
          listingPosition
          legend
          state
          media {
            url
          }
        }
      }
    }
  `,

  // Récupère plusieurs assets via un tableau d'IDs
  GET_ASSETS_BY_IDS: `
    query GetAssetsByIDs($assetIDs: [ID!]!) {
      assetsByIDs(assetIDs: $assetIDs) {
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
        medias {
          assetMediaID
          listingPosition
          legend
          state
          media {
            url
          }
        }
      }
    }
  `,

  // Récupère plusieurs assets via un tableau de slugs
  GET_ASSETS_BY_SLUGS: `
    query GetAssetsBySlugs($slugs: [String!]!) {
      assetsBySlugs(slugs: $slugs) {
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
        medias {
          assetMediaID
          listingPosition
          legend
          state
          media {
            url
          }
        }
      }
    }
  `,

  // Récupère un asset via sa référence unique
  GET_ASSET_BY_UNIQ_REF: `
    query GetAssetByUniqRef($uniqRef: String!) {
      assetByUniqRef(uniqRef: $uniqRef) {
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
        medias {
          assetMediaID
          listingPosition
          legend
          state
          media {
            url
          }
        }
      }
    }
  `,
  // QUERY : Récupère la liste des assets liés à un service
  LIST_ASSETS_BY_SERVICE: `
    query ServiceAsset($input: ListAssetsByServiceInput!) {
      listAssetsByService(input: $input) {
        asset {
          assetID
          title
          description
          organizationID
          assetID
          uniqRef
          slug
          authorID
          mediaID
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
          medias {
            assetMediaID
            listingPosition
            legend
            state
            media {
              url
            }
          }
        }
        serviceAsset {
          serviceAssetID
          serviceID
          assetID
        }
      }
    }
  `,

  LIST_ASSETS_BY_ORGANIZATION: `
    query ListAssetsByOrganization($input: ListAssetsByOrganizationInput!) {
      listAssetsByOrganization(input: $input) {
        asset {
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
          medias {
            assetMediaID
            listingPosition
            legend
            state
            media {
              url
            }
          }
        }
        serviceLinks {
          serviceAsset {
            serviceAssetID
            serviceID
            assetID
          }
          service {
            title
            price
            state
            description
          }
        }
      }
    }
  `,

  LIST_SERVICES_BY_ASSET: `
    query ListServicesByAsset($input: ListServicesByAssetInput!) {
      listServicesByAsset(input: $input) {
        serviceAsset {
          serviceAssetID
          serviceID
          assetID
        }
        service {
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
        }
      }
    }
  `
};

export { assetQueries };

// =========================================
// Source: catalog/serviceAssetQueries.ts
// =========================================
const serviceAssetQueries = {
  // Récupère un ServiceAsset via son ID
  GET_SERVICE_ASSET: `
      query GetServiceAsset($serviceAssetID: ID!) {
        serviceAsset(serviceAssetID: $serviceAssetID) {
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

  // Récupère la liste des ServiceAssets (avec pagination, tri et filtres optionnels)
  GET_SERVICE_ASSETS: `
      query GetServiceAssets($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
        serviceAssets(pagination: $pagination, sort: $sort, filter: $filter) {
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

  // Récupère un ServiceAsset via son slug
  GET_SERVICE_ASSET_BY_SLUG: `
      query GetServiceAssetBySlug($slug: String!) {
        serviceAssetBySlug(slug: $slug) {
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

  // Récupère plusieurs ServiceAssets via un tableau d'IDs
  GET_SERVICE_ASSETS_BY_IDS: `
      query GetServiceAssetsByIDs($serviceAssetIDs: [ID!]!) {
        serviceAssetsByIDs(serviceAssetIDs: $serviceAssetIDs) {
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

  // Récupère plusieurs ServiceAssets via un tableau de slugs
  GET_SERVICE_ASSETS_BY_SLUGS: `
      query GetServiceAssetsBySlugs($slugs: [String!]!) {
        serviceAssetsBySlugs(slugs: $slugs) {
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

  // Récupère un ServiceAsset via sa référence unique
  GET_SERVICE_ASSET_BY_UNIQ_REF: `
    query GetServiceAssetByUniqRef($uniqRef: String!) {
      serviceAssetByUniqRef(uniqRef: $uniqRef) {
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
  `
};

export { serviceAssetQueries };

// =========================================
// Source: catalog/serviceMediaQueries.ts
// =========================================
const serviceMediaQueries = {
  GET_SERVICE_MEDIA: `
    query GetServiceMedia($serviceMediaID: ID!) {
      serviceMedia(serviceMediaID: $serviceMediaID) {
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

  GET_SERVICE_MEDIAS: `
    query GetServiceMedias($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
      serviceMedias(pagination: $pagination, sort: $sort, filter: $filter) {
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

  GET_SERVICE_MEDIA_BY_SLUG: `
    query GetServiceMediaBySlug($slug: String!) {
      serviceMediaBySlug(slug: $slug) {
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

  GET_SERVICE_MEDIAS_BY_IDS: `
    query GetServiceMediasByIds($serviceMediaIDs: [ID!]!) {
      serviceMediasByIDs(serviceMediaIDs: $serviceMediaIDs) {
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

  GET_SERVICE_MEDIAS_BY_SLUGS: `
    query GetServiceMediasBySlugs($slugs: [String!]!) {
      serviceMediasBySlugs(slugs: $slugs) {
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

  GET_SERVICE_MEDIA_BY_UNIQ_REF: `
    query GetServiceMediaByUniqRef($uniqRef: String!) {
      serviceMediaByUniqRef(uniqRef: $uniqRef) {
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
  `
};

export { serviceMediaQueries };

// =========================================
// Source: catalog/topicQueries.ts
// =========================================
const topicQueries = {
  GET_TOPICS: `
    query GetTopics {
      topics {
        topicID
        authorID
        title
        description
        parentTopicID
        level
        state
        createdAt
        updatedAt
      }
    }
  `,
  GET_TOPIC_BY_ID: `
    query GetTopicByID($topicID: ID!) {
      topic(topicID: $topicID) {
        topicID
        authorID
        title
        description
        parentTopicID
        level
        state
        createdAt
        updatedAt
      }
    }
  `,
};

export { topicQueries };

// =========================================
// Source: catalog/serviceQueries.ts
// =========================================
const serviceQueries = {
  GET_SERVICE_BY_AUTHOR_ID: `
    query GetServicesByUserId($authorID: String!) {
      servicessByUserId(userID: $authorID) {
        serviceID
        authorID
        organizationID
        title
        slug
        uniqRef
      }
    }
  `,
  GET_SERVICE_BY_ID: `
    query GetServiceByID($serviceID: ID!, $admin: Boolean) {
      service(serviceID: $serviceID, admin: $admin) {
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
  GET_SERVICE_BY_UNIQ_REF: `
    query GetServiceByUniqRef($uniqRef: String!, $admin: Boolean) {
      serviceByUniqRef(uniqRef: $uniqRef, admin: $admin) {
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
  GET_SERVICE_BY_SLUG: `
    query GetServiceBySlug($slug: String!, $admin: Boolean) {
      serviceBySlug(slug: $slug, admin: $admin) {
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
  GET_SERVICES_BY_IDS: `
    query GetServicesByIDs($serviceIDs: [String!]!, $admin: Boolean) {
      servicesByIDs(serviceIDs: $serviceIDs, admin: $admin) {
        serviceID
        uniqRef
        slug
        authorID
        title
        description
        mediaBannerID
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
  GET_SERVICES_BY_SLUGS: `
    query GetServicesBySlugs($slugs: [String!]!, $admin: Boolean) {
      servicesBySlugs(slugs: $slugs, admin: $admin) {
        serviceID
        uniqRef
        slug
        authorID
        title
        description
        mediaBannerID
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
  LIST_SERVICES_BY_ORGANIZATION: `
    query ListServicesByOrganization($input: ListServicesByOrganizationInput!) {
      listServicesByOrganization(input: $input) {
      serviceID
      uniqRef
      slug
      authorID
      title
      description
      mediaBannerID
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
  SEARCH_SERVICES: `
    query SearchServices($input: SearchServiceInput!) {
  searchServices(input: $input) {
    serviceID
    uniqRef
    slug
    authorID
    title
    description
    mediaBannerID
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
  GET_SERVICES: `
    query GetServices($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!], $admin: Boolean) {
  services(pagination: $pagination, sort: $sort, filter: $filter, admin: $admin) {
    serviceID
    uniqRef
    slug
    authorID
    title
    description
    mediaBannerID
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
  GET_SERVICES_BY_AGENT_ID: `
    query GetServicesByAgentID($agentID: String!) {
  servicesByAgentID(agentID: $agentID) {
    serviceID
    uniqRef
    slug
    authorID
    title
    description
    mediaBannerID
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
};

export { serviceQueries };

// =========================================
// Source: document/mediaQueries.ts
// =========================================
const mediaQueries = {
  GET_MEDIA: `
    query GetMedia($mediaID: ID!) {
      media(mediaID: $mediaID) {
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

  GET_MEDIAS: `
    query GetMedias($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
      medias(pagination: $pagination, sort: $sort, filter: $filter) {
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

  GET_MEDIA_BY_SLUG: `
    query GetMediaBySlug($slug: String!) {
      mediaBySlug(slug: $slug) {
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

  GET_MEDIAS_BY_IDS: `
    query GetMediasByIds($mediaIDs: [ID!]!) {
      mediasByIDs(mediaIDs: $mediaIDs) {
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

  GET_MEDIAS_BY_SLUGS: `
    query GetMediasBySlugs($slugs: [String!]!) {
      mediasBySlugs(slugs: $slugs) {
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

  GET_MEDIA_BY_UNIQ_REF: `
    query GetMediaByUniqRef($uniqRef: String!) {
      mediaByUniqRef(uniqRef: $uniqRef) {
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
  `
};

export { mediaQueries };

// =========================================
// Source: location/placeQueries.ts
// =========================================
const placeQueries = {
  GET_PLACE_BY_ID: `
        query Place($placeId: ID!) {
            place(placeID: $placeId) {
    placeID
    uniqRef
    slug
    authorID
    country
    region
    pstate
    city
    postalCode
    placeKind
    addressLine1
    addressLine2
    coordinates
    state
    createdAt
    updatedAt
  }
        }
    `,
};

export { placeQueries };
