import { APIClient } from '../../api/APIClient.js';
import { PerformanceOverview, PerformancePeriodType, PerformanceRangePreset, PerformanceScope, PerformanceSnapshot } from '../../types/review/index.js';
/** Analytics Performance (prestataire / organisation). Calculs côté backend, jamais côté front. */
export declare class PerformanceController {
    private readonly client;
    constructor(client: APIClient);
    getOverview(scope: PerformanceScope, scopeID: string, range?: PerformanceRangePreset): Promise<PerformanceOverview>;
    getHistory(scope: PerformanceScope, scopeID: string, periodType?: PerformancePeriodType, limit?: number): Promise<PerformanceSnapshot[]>;
}
