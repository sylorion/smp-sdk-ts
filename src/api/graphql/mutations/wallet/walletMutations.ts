const walletMutations = {
  CREATE_WALLET: `
    mutation CreateWallet($data: CreateWalletInput!) {
      createWallet(data: $data) {
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
        externalProviderData
      }
    }
  `,

  DEPOSIT: `
    mutation Deposit($data: DepositInput!) {
      deposit(data: $data) {
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
        externalProviderData
      }
    }
  `,

  WITHDRAW: `
    mutation Withdraw($data: WithdrawInput!) {
      withdraw(data: $data) {
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
        externalProviderData
      }
    }
  `,

  CONVERT_TO_TOKENS: `
    mutation ConvertToTokens($data: ConvertToTokensInput!) {
      convertToTokens(data: $data) {
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
        externalProviderData
      }
    }
  `,

  CONVERT_TOKENS_TO_MONEY: `
    mutation ConvertTokensToMoney($data: ConvertTokensToMoneyInput!) {
      convertTokensToMoney(data: $data) {
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
        externalProviderData
      }
    }
  `,

  PAY_WITH_WALLET: `
    mutation PayWithWallet($data: PayWithWalletInput!) {
      payWithWallet(data: $data) {
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
        externalProviderData
      }
    }
  `,

  ADD_REVENUE: `
    mutation AddRevenue($data: AddRevenueInput!) {
      addRevenue(data: $data) {
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
        externalProviderData
      }
    }
  `,

  BANK_WITHDRAW: `
    mutation BankWithdraw($data: BankWithdrawInput!) {
      bankWithdraw(data: $data) {
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
        externalProviderData
      }
    }
  `,

  TRANSFER: `
    mutation Transfer($data: TransferInput!) {
      transfer(data: $data) {
        sourceWallet {
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
        destinationWallet {
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
    }
  `,

  SET_PRIMARY_CURRENCY: `
    mutation SetPrimaryCurrency($data: SetPrimaryCurrencyInput!) {
      setPrimaryCurrency(data: $data) {
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
        externalProviderData
      }
    }
  `,

  ADJUSTMENT: `
    mutation Adjustment($data: AdjustmentInput!) {
      adjustment(data: $data) {
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
        externalProviderData
      }
    }
  `,
  CREATE_STRIPE_CONNECT_ACCOUNT: `
    mutation CreateStripeConnectAccount($organizationID: String!) {
      createStripeConnectAccount(organizationID: $organizationID) {
        stripeAccountId
        onboardingCompleted
        chargesEnabled
        payoutsEnabled
        detailsSubmitted
      }
    }
  `,
  GENERATE_STRIPE_ONBOARDING_LINK: `
    mutation GenerateStripeOnboardingLink($organizationID: String!, $returnUrl: String!, $refreshUrl: String!) {
      generateStripeOnboardingLink(organizationID: $organizationID, returnUrl: $returnUrl, refreshUrl: $refreshUrl) {
        url
        expiresAt
      }
    }
  `,
  CREATE_STRIPE_ACCOUNT_SESSION: `
    mutation CreateStripeAccountSession($organizationID: String!) {
      createStripeAccountSession(organizationID: $organizationID) {
        clientSecret
      }
    }
  `,
};

export { walletMutations }; 