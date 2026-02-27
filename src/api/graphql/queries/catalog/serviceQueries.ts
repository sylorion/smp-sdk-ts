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
        negotiable
        perimeter
        supplyType
        uptakeForm
        billingPlan
        onlineService
        advancedAttributes
        legalVatPercent
        lowerPrice
        upperPrice
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
        negotiable
        perimeter
        supplyType
        uptakeForm
        billingPlan
        onlineService
        advancedAttributes
        legalVatPercent
        lowerPrice
        upperPrice
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
      negotiable
      perimeter
      supplyType
      uptakeForm
      billingPlan
      onlineService
      upperPrice
      lowerPrice
      legalVatPercent
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
    negotiable
    perimeter
    supplyType
    uptakeForm
    billingPlan
    onlineService
    advancedAttributes
    legalVatPercent
    lowerPrice
    upperPrice
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
    query GetServices($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
  services(pagination: $pagination, sort: $sort, filter: $filter) {
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
    negotiable
    perimeter
    supplyType
    uptakeForm
    billingPlan
    onlineService
    advancedAttributes
    legalVatPercent
    lowerPrice
    upperPrice
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
    negotiable
    perimeter
    supplyType
    uptakeForm
    billingPlan
    onlineService
    advancedAttributes
    legalVatPercent
    lowerPrice
    upperPrice
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
