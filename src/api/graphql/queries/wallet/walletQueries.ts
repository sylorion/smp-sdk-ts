const walletQueries = {
  GET_WALLET_BY_ID: `
    query GetWallet($id: String!) {
      wallet(id: $id) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_WALLETS: `
    query GetWallets($userId: String!, $organizationId: String!) {
      wallets(userId: $userId, organizationId: $organizationId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_WALLETS_BY_USER: `
    query GetWalletsByUser($userId: String!) {
      walletsByUser(userId: $userId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_WALLETS_BY_ORGANIZATION: `
    query GetWalletsByOrganization($organizationId: String!) {
      walletsByOrganization(organizationId: $organizationId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_USER_WALLETS: `
    query GetUserWallets($userId: String!) {
      userWallets(userId: $userId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_ORGANIZATION_WALLETS: `
    query GetOrganizationWallets($organizationId: String!) {
      organizationWallets(organizationId: $organizationId) {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_ALL_WALLETS: `
    query GetAllWallets {
      allWallets {
        walletId
        userId
        organizationId
        balances
        tokens
        mainCurrency
        version
        isActive
        isLocked
        isSuspicious
        createdAt
        updatedAt
        deletedAt
      }
    }
  `,

  GET_CONVERSION_DETAILS: `
    query GetConversionDetails($data: ConversionDetailsInput!) {
      getConversionDetails(data: $data) {
        tokenAmount
        moneyAmount
        fee
        netAmount
        feePercentage
        currency
        success
        errorMessage
      }
    }
  `,
};

export { walletQueries }; 