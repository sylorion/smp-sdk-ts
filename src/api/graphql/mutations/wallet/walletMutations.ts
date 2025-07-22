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
      }
    }
  `,
};

export { walletMutations }; 