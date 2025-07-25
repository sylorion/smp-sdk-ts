const contractMutations = {
  CREATE_CONTRACT: `
    mutation CreateContract($data: CreateContractInput!) {
      createContract(data: $data) {
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
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  UPDATE_CONTRACT: `
    mutation UpdateContract($id: String!, $data: UpdateContractInput!) {
      updateContract(id: $id, data: $data) {
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
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  SIGN_CONTRACT: `
    mutation SignContract($data: SignContractInput!) {
      signContract(data: $data) {
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
        clientSignDate
        providerSignDate
        createdAt
        updatedAt
      }
    }
  `,

  SEND_CONTRACT: `
    mutation SendContract($data: SendContractInput!) {
      sendContract(data: $data) {
        success
        message
              invitationToken
      expiresAt
      }
    }
  `,

  VERIFY_TOKEN: `
    mutation VerifyToken($data: VerifyTokenInput!) {
      verifyToken(data: $data) {
        isValid
        message
        contractId
        email
        role
        expiresAt
        isExpired
      }
    }
  `,
};

export { contractMutations }; 