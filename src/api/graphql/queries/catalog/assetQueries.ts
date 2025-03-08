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
        state
        createdAt
        updatedAt
        deletedAt
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
        state
        createdAt
        updatedAt
        deletedAt
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
        state
        createdAt
        updatedAt
        deletedAt
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
        state
        createdAt
        updatedAt
        deletedAt
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
        state
        createdAt
        updatedAt
        deletedAt
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
        state
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,
  // QUERY : Récupère la liste des assets liés à un service
  LIST_ASSETS_BY_SERVICE: `
    query ListAssetsByService($input: listAssetsByService) {
      listAssetsByService(input: $input) {
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
        state
        createdAt
        updatedAt
  
      }
    }
  `
};

export { assetQueries };
