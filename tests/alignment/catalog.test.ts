import { assetMediaQueries, mediaQueries, serviceAssetQueries, serviceMediaQueries } from '../../src/api/graphql/catalog/queries';
import { mediaMutations } from '../../src/api/graphql/catalog/mutations';
import { engagementQueries } from '../../src/api/graphql/communication/queries';
import { Media } from '../../src/domains/catalog/MediaController';
import { ServiceAsset } from '../../src/domains/catalog/ServiceAssetController';
import { Asset } from '../../src/domains/catalog/AssetController';
import { Service } from '../../src/domains/catalog/ServiceController';
import { EngagementController } from '../../src/domains/catalog/EngagementController';
import { mockClient, rootArgs, rootField, selected, varTypes } from './helpers';

describe('catalog.media (mu-document)', () => {
  test('aucun document ne sélectionne `metadata` (absent du type Media)', () => {
    for (const doc of [...Object.values(mediaQueries), mediaMutations.UPDATE_MEDIA, mediaMutations.CREATE_MEDIA]) {
      expect(selected(doc)).not.toContain('metadata');
    }
  });

  test('update : mediaID + input, renvoie le média mis à jour', async () => {
    const client = mockClient();
    client.mutate.mockResolvedValue({ updateMedia: { mediaID: 'm1', legend: 'L' } });
    await expect(new Media(client).update('m1', { legend: 'L', state: 'online' })).resolves.toEqual({ mediaID: 'm1', legend: 'L' });
    expect(client.mutate).toHaveBeenCalledWith(mediaMutations.UPDATE_MEDIA, { mediaID: 'm1', input: { legend: 'L', state: 'online' } });
    expect(rootField(mediaMutations.UPDATE_MEDIA)).toBe('updateMedia');
  });

  test('delete : deleteMedia est un scalaire Boolean!, sans sous-sélection', async () => {
    expect(selected(mediaMutations.DELETE_MEDIA)).toEqual([]);
    const client = mockClient();
    client.mutate.mockResolvedValue({ deleteMedia: true });
    await expect(new Media(client).delete('m1')).resolves.toBe(true);
    expect(client.mutate).toHaveBeenCalledWith(mediaMutations.DELETE_MEDIA, { mediaID: 'm1' });
  });

  test('list : `medias` sans argument ; getBySlug : argument `Slug` du service', async () => {
    expect(rootArgs(mediaQueries.GET_MEDIAS)).toEqual({});
    expect(rootArgs(mediaQueries.GET_MEDIA_BY_SLUG)).toEqual({ Slug: '$slug' });
    const client = mockClient();
    client.query.mockResolvedValueOnce({ medias: [{ mediaID: 'm1' }] });
    await expect(new Media(client).list()).resolves.toEqual([{ mediaID: 'm1' }]);
    expect(client.query).toHaveBeenLastCalledWith(mediaQueries.GET_MEDIAS, {});
    client.query.mockResolvedValueOnce({ mediaBySlug: { mediaID: 'm2' } });
    await expect(new Media(client).getBySlug('logo')).resolves.toEqual({ mediaID: 'm2' });
    expect(client.query).toHaveBeenLastCalledWith(mediaQueries.GET_MEDIA_BY_SLUG, { slug: 'logo' });
  });
});

describe('catalog.serviceAsset.list', () => {
  const rows = [
    { serviceAssetID: 'sa1', serviceID: 's1', assetID: 'a1' },
    { serviceAssetID: 'sa2', serviceID: 's2', assetID: 'a1' },
    { serviceAssetID: 'sa3', serviceID: 's1', assetID: 'a2' },
  ];

  test('`serviceAssets` sans pagination/tri/filtre côté service', () => {
    expect(rootField(serviceAssetQueries.GET_SERVICE_ASSETS)).toBe('serviceAssets');
    expect(rootArgs(serviceAssetQueries.GET_SERVICE_ASSETS)).toEqual({});
    expect(varTypes(serviceAssetQueries.GET_SERVICE_ASSETS)).toEqual({});
  });

  test('filtre serviceID appliqué par le SDK (appel du webapp : list({ filter: { serviceID } }))', async () => {
    const client = mockClient();
    client.query.mockResolvedValue({ serviceAssets: rows });
    const ctl = new ServiceAsset(client);
    await expect(ctl.list({ filter: { serviceID: 's1' } })).resolves.toEqual([rows[0], rows[2]]);
    expect(client.query).toHaveBeenCalledWith(serviceAssetQueries.GET_SERVICE_ASSETS, {});
    await expect(ctl.list({ filter: { serviceID: 's1', assetID: 'a2' } })).resolves.toEqual([rows[2]]);
    await expect(ctl.list()).resolves.toEqual(rows);
  });

  test('réponse vide ou nulle → tableau vide', async () => {
    const client = mockClient();
    client.query.mockResolvedValue({ serviceAssets: null });
    await expect(new ServiceAsset(client).list({ filter: { serviceID: 's1' } })).resolves.toEqual([]);
  });
});

describe('catalog — listes de médias sans arguments', () => {
  test('asset.listMedias / service.listMedias', async () => {
    expect(rootArgs(assetMediaQueries.GET_ASSET_MEDIAS)).toEqual({});
    expect(rootArgs(serviceMediaQueries.GET_SERVICE_MEDIAS)).toEqual({});
    const client = mockClient();
    client.query.mockResolvedValueOnce({ assetMedias: [{ assetMediaID: 'am1' }] });
    await expect(new Asset(client).listMedias()).resolves.toEqual([{ assetMediaID: 'am1' }]);
    expect(client.query).toHaveBeenLastCalledWith(assetMediaQueries.GET_ASSET_MEDIAS, {});
    client.query.mockResolvedValueOnce({ serviceMedias: [{ serviceMediaID: 'sm1' }] });
    await expect(new Service(client).listMedias()).resolves.toEqual([{ serviceMediaID: 'sm1' }]);
    expect(client.query).toHaveBeenLastCalledWith(serviceMediaQueries.GET_SERVICE_MEDIAS, {});
  });

  test('service.listByAuthorId (champ servicessByUserId inexistant) a été retiré', () => {
    expect((new Service(mockClient()) as any).listByAuthorId).toBeUndefined();
  });
});

describe('catalog.engagementController.listReportsByPeriod', () => {
  test('year / periodValue déclarés Float! comme dans mu-command', async () => {
    expect(varTypes(engagementQueries.GET_ENGAGEMENT_REPORTS_BY_PERIOD)).toEqual({ year: 'Float!', periodType: 'String!', periodValue: 'Float!' });
    const client = mockClient();
    client.query.mockResolvedValue({ engagementReportsByPeriod: [{ reportId: 'r1' }] });
    await expect(new EngagementController(client).listReportsByPeriod(2026, 'month', 9)).resolves.toEqual([{ reportId: 'r1' }]);
    expect(client.query).toHaveBeenCalledWith(engagementQueries.GET_ENGAGEMENT_REPORTS_BY_PERIOD, { year: 2026, periodType: 'month', periodValue: 9 });
  });
});
