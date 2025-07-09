const contractQueries = {
  GET_CONTRACT_BY_ID: `
    query GetContract($id: String!) {
      contract(id: $id) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        transactions
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACTS: `
    query GetContracts($pagination: PaginationInput, $sort: SortInput, $filter: [FilterInput!]) {
      contracts(pagination: $pagination, sort: $sort, filter: $filter) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        transactions
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACTS_BY_SERVICE_ID: `
    query GetContractsByServiceId($serviceId: String!) {
      contractsByServiceId(serviceId: $serviceId) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        transactions
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACTS_BY_ESTIMATE_ID: `
    query GetContractsByEstimateId($estimateId: String!) {
      contractsByEstimateId(estimateId: $estimateId) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        transactions
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACTS_BY_STATUS: `
    query GetContractsByStatus($status: ContractStatus!) {
      contractsByStatus(status: $status) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        transactions
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  GET_CONTRACTS_BY_ORGANIZATION_ID: `
    query GetContractsByOrganizationId($organizationId: String!) {
      contractsByOrganizationId(organizationId: $organizationId) {
        contractId
        estimateId
        serviceId
        organizationId
        clientSignHash
        providerSignHash
        status
        content
        variables
        details
        transactions
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,
};

export { contractQueries }; 