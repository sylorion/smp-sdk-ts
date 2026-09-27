import { parse } from 'graphql';
import { walletQueries } from '../../src/api/graphql/accounting/queries';
import { walletMutations } from '../../src/api/graphql/accounting/mutations';
import { Wallet } from '../../src/domains/accounting/WalletController';

/**
 * Usage des jetons plateforme (STK) — contrat mu-wallet `TokenUsageModule`.
 */
describe('wallet — opérations jetons', () => {
  test('les documents GraphQL sont valides et ciblent les bonnes opérations', () => {
    const docs: Array<[string, string, string]> = [
      ['TOKEN_USAGE_SUMMARY', walletQueries.TOKEN_USAGE_SUMMARY, 'tokenUsageSummary'],
      ['TOKEN_USAGE_HISTORY', walletQueries.TOKEN_USAGE_HISTORY, 'tokenUsageHistory'],
      ['TOKEN_COST_ESTIMATE', walletQueries.TOKEN_COST_ESTIMATE, 'tokenCostEstimate'],
      ['CONSUME_TOKENS', walletMutations.CONSUME_TOKENS, 'consumeTokens'],
      ['PAY_SERVICE_WITH_TOKENS', walletMutations.PAY_SERVICE_WITH_TOKENS, 'payServiceWithTokens'],
    ];
    for (const [name, doc, field] of docs) {
      expect(() => parse(doc)).not.toThrow();
      expect(doc).toContain(`${field}(`);
      expect(name).toBeTruthy();
    }
    // Le résumé expose tout ce que l'UI affiche : allocation du jour, soldes, consommation, répartition par agent.
    for (const f of ['dailyAllowance', 'dailyRemaining', 'totalAvailable', 'consumedToday', 'nextDailyRefreshAt', 'byAgentLast30Days', 'recent']) {
      expect(walletQueries.TOKEN_USAGE_SUMMARY).toContain(f);
    }
  });

  function build() {
    const client: any = { query: jest.fn(), mutate: jest.fn() };
    return { wallet: new Wallet(client), client };
  }

  test('getTokenUsageSummary / history : payeur organisation ou utilisateur, jamais sans payeur', async () => {
    const { wallet, client } = build();
    client.query.mockResolvedValue({ tokenUsageSummary: { totalAvailable: 53 } });
    await expect(wallet.getTokenUsageSummary({ organizationId: 'org1' })).resolves.toEqual({ totalAvailable: 53 });
    expect(client.query).toHaveBeenCalledWith(walletQueries.TOKEN_USAGE_SUMMARY, { organizationId: 'org1' });
    client.query.mockResolvedValue({ tokenUsageHistory: [] });
    await wallet.getTokenUsageHistory({ userId: 'u1' }, { limit: 10, kinds: ['agent_call'] });
    expect(client.query).toHaveBeenLastCalledWith(walletQueries.TOKEN_USAGE_HISTORY, { userId: 'u1', limit: 10, kinds: ['agent_call'] });
    await expect(wallet.getTokenUsageSummary({})).rejects.toThrow(/walletId, userId ou organizationId/);
  });

  test('consumeTokens : idempotencyKey et agentKey obligatoires, données transmises telles quelles', async () => {
    const { wallet, client } = build();
    client.mutate.mockResolvedValue({ consumeTokens: { cost: 7, alreadyRecorded: false } });
    const data = { organizationId: 'org1', actorUserId: 'u1', agentKey: 'pm', action: 'plan', llmInputTokens: 2000, llmOutputTokens: 1, idempotencyKey: 'pm:s1:plan' };
    await expect(wallet.consumeTokens(data)).resolves.toEqual({ cost: 7, alreadyRecorded: false });
    expect(client.mutate).toHaveBeenCalledWith(walletMutations.CONSUME_TOKENS, { data });
    await expect(wallet.consumeTokens({ userId: 'u1', agentKey: 'pm', idempotencyKey: '' })).rejects.toThrow(/idempotencyKey/);
    await expect(wallet.consumeTokens({ userId: 'u1', agentKey: '', idempotencyKey: 'k' })).rejects.toThrow(/agentKey/);
    expect(client.mutate).toHaveBeenCalledTimes(1);
  });

  test('payServiceWithTokens : prix entier > 0, clé d’idempotence, résultat avec commission', async () => {
    const { wallet, client } = build();
    client.mutate.mockResolvedValue({ payServiceWithTokens: { tokenPrice: 100, commission: 8, total: 108, alreadyPaid: false } });
    const data = { userId: 'u1', sellerOrganizationId: 'org-s', tokenPrice: 100, serviceId: 's1', orderId: 'o1', idempotencyKey: 'order:o1' };
    await expect(wallet.payServiceWithTokens(data)).resolves.toMatchObject({ total: 108 });
    expect(client.mutate).toHaveBeenCalledWith(walletMutations.PAY_SERVICE_WITH_TOKENS, { data });
    await expect(wallet.payServiceWithTokens({ ...data, tokenPrice: 0 })).rejects.toThrow(/tokenPrice/);
    await expect(wallet.payServiceWithTokens({ ...data, tokenPrice: 1.5 })).rejects.toThrow(/tokenPrice/);
    await expect(wallet.payServiceWithTokens({ ...data, idempotencyKey: '' })).rejects.toThrow(/idempotencyKey/);
  });

  test('estimateTokenCost', async () => {
    const { wallet, client } = build();
    client.query.mockResolvedValue({ tokenCostEstimate: { agentKey: 'pm', baseCost: 5, llmCost: 2, total: 7, llmTokensPerPlatformToken: 2000 } });
    await expect(wallet.estimateTokenCost('pm', { inputTokens: 2000, outputTokens: 1 })).resolves.toMatchObject({ total: 7 });
    expect(client.query).toHaveBeenCalledWith(walletQueries.TOKEN_COST_ESTIMATE, { agentKey: 'pm', llmInputTokens: 2000, llmOutputTokens: 1 });
  });
});
