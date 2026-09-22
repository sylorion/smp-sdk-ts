import { reviewQueries } from '../../api/graphql/review/queries.js';
/** Analytics Performance (prestataire / organisation). Calculs côté backend, jamais côté front. */
export class PerformanceController {
    constructor(client) {
        this.client = client;
    }
    async getOverview(scope, scopeID, range = '30d') {
        const res = await this.client.query(reviewQueries.GET_PERFORMANCE_OVERVIEW, { scope, scopeID, range });
        return res.performanceOverview;
    }
    async getHistory(scope, scopeID, periodType = 'month', limit = 12) {
        const res = await this.client.query(reviewQueries.GET_PERFORMANCE_HISTORY, { scope, scopeID, periodType, limit });
        return res.performanceHistory;
    }
}
