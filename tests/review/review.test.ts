import { formatRating5, formatScore100, isValidScore, pickLabel, ratingToPercent, relativeChangePercent, snapScore } from '../../src/types/review/format';
import { normalizeInput, ServiceReportController } from '../../src/domains/review/ServiceReportController';
import { ReviewDomain } from '../../src/domains/review';
import { reviewQueries } from '../../src/api/graphql/review/queries';
import { reviewMutations } from '../../src/api/graphql/review/mutations';

describe('review format helpers (shared display rules)', () => {
  test('ratings are shown with one decimal, scores as integers', () => {
    expect(formatRating5(4.437)).toBe('4.4');
    expect(formatRating5(null)).toBe('—');
    expect(formatScore100(85.45)).toBe('85');
    expect(relativeChangePercent(4.4, 4.0)).toBe(10);
    expect(relativeChangePercent(4.4, 0)).toBeNull();
  });
  test('radar helpers snap on the 1..5 / 0.5 scale', () => {
    expect(snapScore(3.26)).toBe(3.5);
    expect(snapScore(0)).toBe(1);
    expect(snapScore(9)).toBe(5);
    expect(ratingToPercent(1)).toBe(0);
    expect(ratingToPercent(5)).toBe(100);
    expect(ratingToPercent(3)).toBe(50);
    expect(isValidScore(4.5)).toBe(true);
    expect(isValidScore(4.3)).toBe(false);
  });
  test('pickLabel falls back gracefully', () => {
    const labels = [{ locale: 'fr', value: 'Qualité' }, { locale: 'en', value: 'Quality' }];
    expect(pickLabel(labels, 'en-US')).toBe('Quality');
    expect(pickLabel(labels, 'es')).toBe('Qualité');
    expect(pickLabel([], 'fr')).toBe('');
  });
});

describe('ServiceReportController', () => {
  test('normalizes input and validates scores before calling the API', async () => {
    const client: any = { query: jest.fn(), mutate: jest.fn().mockResolvedValue({ submitServiceReport: { serviceReportID: 'r1', status: 'published' } }) };
    const ctrl = new ServiceReportController(client);
    const report = await ctrl.submit('r1', { ratings: [{ key: 'quality', score: 4.5, comment: '  Top  ' }, { key: 'communication', score: 4 }], overallComment: ' Bien ', wouldRecommend: true });
    expect(report.status).toBe('published');
    expect(client.mutate).toHaveBeenCalledWith(reviewMutations.SUBMIT_SERVICE_REPORT, { serviceReportID: 'r1', input: { ratings: [{ key: 'quality', score: 4.5, comment: 'Top' }, { key: 'communication', score: 4 }], overallComment: 'Bien', wouldRecommend: true } });
    await expect(ctrl.submit('r1', { ratings: [{ key: 'quality', score: 7 }] })).rejects.toThrow(/Invalid score/);
    expect(normalizeInput({ ratings: [], overallComment: '   ' })).toEqual({ ratings: [] });
  });

  test('domain exposes reports, criteria, threads, performance and self-assessment controllers', async () => {
    const client: any = { query: jest.fn().mockResolvedValue({ pendingServiceReports: { items: [], pageInfo: { page: 1, pageSize: 20, total: 0, hasNextPage: false } } }), mutate: jest.fn() };
    const domain = new ReviewDomain(client);
    const page = await domain.reports.getPending({ page: 1 });
    expect(page.pageInfo.total).toBe(0);
    expect(client.query).toHaveBeenCalledWith(reviewQueries.GET_PENDING_SERVICE_REPORTS, { pagination: { page: 1 } });
    expect(domain.criteria).toBeDefined();
    expect(domain.threads).toBeDefined();
    expect(domain.performance).toBeDefined();
    expect(domain.selfAssessment).toBeDefined();
  });

  test('operations never expose a credit-granting mutation', () => {
    expect(Object.keys(reviewMutations).some((k) => /grant|credit|reward/i.test(k))).toBe(false);
  });
});
