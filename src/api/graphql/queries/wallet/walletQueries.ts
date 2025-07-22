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