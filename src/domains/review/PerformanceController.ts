import { APIClient } from '../../api/APIClient.js';
import { reviewQueries } from '../../api/graphql/review/queries.js';
import { PerformanceOverview, PerformancePeriodType, PerformanceRangePreset, PerformanceScope, PerformanceSnapshot } from '../../types/review/index.js';

/** Analytics Performance (prestataire / organisation). Calculs côté backend, jamais côté front. */
export class PerformanceController {
  constructor(private readonly client: APIClient) {}

  async getOverview(scope: PerformanceScope, scopeID: string, range: PerformanceRangePreset = '30d'): Promise<PerformanceOverview> {
    const res = await this.client.query<{ performanceOverview: PerformanceOverview }>(reviewQueries.GET_PERFORMANCE_OVERVIEW, { scope, scopeID, range });
    return res.performanceOverview;
  }

  async getHistory(scope: PerformanceScope, scopeID: string, periodType: PerformancePeriodType = 'month', limit = 12): Promise<PerformanceSnapshot[]> {
    const res = await this.client.query<{ performanceHistory: PerformanceSnapshot[] }>(reviewQueries.GET_PERFORMANCE_HISTORY, { scope, scopeID, periodType, limit });
    return res.performanceHistory;
  }
}
