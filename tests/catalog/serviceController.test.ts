import { parse, OperationDefinitionNode, FieldNode, print } from 'graphql';
import { Service } from '../../src/domains/catalog/ServiceController';
import { ServiceAsset } from '../../src/domains/catalog/ServiceAssetController';
import { serviceQueries } from '../../src/api/graphql/catalog/queries';
import { serviceMutations, serviceAssetMutations } from '../../src/api/graphql/catalog/mutations';
import { serviceAssetQueries, serviceMediaQueries } from '../../src/api/graphql/catalog/queries';

/** Type déclaré d'une variable d'opération, ex. "[ID!]!". */
function varType(doc: string, name: string): string | undefined {
  const op = parse(doc).definitions[0] as OperationDefinitionNode;
  const v = op.variableDefinitions?.find((d) => d.variable.name.value === name);
  return v ? print(v.type) : undefined;
}

/** Nom des arguments du champ racine, ex. ["Slug", "admin"]. */
function rootArgs(doc: string): string[] {
  const op = parse(doc).definitions[0] as OperationDefinitionNode;
  const root = op.selectionSet.selections[0] as FieldNode;
  return (root.arguments ?? []).map((a) => a.name.value);
}

function rootSelection(doc: string): FieldNode {
  const op = parse(doc).definitions[0] as OperationDefinitionNode;
  return op.selectionSet.selections[0] as FieldNode;
}

function selects(doc: string, path: string[]): boolean {
  let node: FieldNode | undefined = rootSelection(doc);
  for (const seg of path) {
    node = node?.selectionSet?.selections.find(
      (s) => s.kind === 'Field' && (s as FieldNode).name.value === seg,
    ) as FieldNode | undefined;
    if (!node) return false;
  }
  return true;
}

describe('catalog — alignement des opérations service avec le schéma mu-catalog', () => {
  test('GET_SERVICES_BY_IDS déclare $serviceIDs: [ID!]! (le schéma gateway refuse [String!]!)', () => {
    expect(varType(serviceQueries.GET_SERVICES_BY_IDS, 'serviceIDs')).toBe('[ID!]!');
    expect(varType(serviceQueries.GET_SERVICES_BY_IDS, 'admin')).toBe('Boolean');
  });

  test('GET_SERVICES_BY_IDS sélectionne les champs nécessaires aux cartes de recommandation', () => {
    const q = serviceQueries.GET_SERVICES_BY_IDS;
    for (const path of [
      ['serviceID'], ['title'], ['price'], ['topicID'], ['billingPlan'], ['negotiable'],
      ['averageRating'], ['reviewCount'], ['likes'],
      ['serviceMedias', 'listingPosition'], ['serviceMedias', 'media', 'url'],
      ['location', 'city'], ['location', 'country'],
    ]) {
      expect({ path, ok: selects(q, path) }).toEqual({ path, ok: true });
    }
  });

  test('les requêtes *BySlug utilisent l’argument "Slug" exposé par mu-catalog', () => {
    expect(rootArgs(serviceQueries.GET_SERVICE_BY_SLUG)).toEqual(['Slug', 'admin']);
    expect(rootArgs(serviceAssetQueries.GET_SERVICE_ASSET_BY_SLUG)).toEqual(['Slug']);
    expect(rootArgs(serviceMediaQueries.GET_SERVICE_MEDIA_BY_SLUG)).toEqual(['Slug']);
  });

  test('les identifiants sont typés ID! là où le schéma attend ID!', () => {
    expect(varType(serviceQueries.GET_SERVICES_BY_AGENT_ID, 'agentID')).toBe('ID!');
    for (const v of ['serviceID', 'assetID', 'authorID']) {
      expect(varType(serviceAssetMutations.LINK_ASSET_TO_SERVICE, v)).toBe('ID!');
    }
    for (const v of ['serviceID', 'assetID']) {
      expect(varType(serviceAssetMutations.UNLINK_ASSET_FROM_SERVICE, v)).toBe('ID!');
    }
  });

  test('addServiceToFavorites renvoie un JSONObject : aucune sous-sélection autorisée', () => {
    expect(rootSelection(serviceMutations.ADD_SERVICE_TO_FAVORITES).selectionSet).toBeUndefined();
  });
});

describe('Service controller — lecture des réponses GraphQL (graphql-request renvoie `data` déjà déballé)', () => {
  const svc = { serviceID: 's1', title: 'T', price: 100, state: 'online' };

  test('getByIds transmet les IDs et renvoie servicesByIDs', async () => {
    const client: any = { query: jest.fn().mockResolvedValue({ servicesByIDs: [svc] }) };
    const out = await new Service(client).getByIds(['s1', 's2']);
    expect(client.query).toHaveBeenCalledWith(serviceQueries.GET_SERVICES_BY_IDS, { serviceIDs: ['s1', 's2'], admin: undefined });
    expect(out).toEqual([svc]);
  });

  test('getBySlug / getBySlugs / getByAgentID ne lisent plus un `response.data` inexistant', async () => {
    const client: any = { query: jest.fn() };
    const ctrl = new Service(client);
    client.query.mockResolvedValueOnce({ serviceBySlug: svc });
    await expect(ctrl.getBySlug('t')).resolves.toEqual(svc);
    client.query.mockResolvedValueOnce({ servicesBySlugs: [svc] });
    await expect(ctrl.getBySlugs(['t'])).resolves.toEqual([svc]);
    client.query.mockResolvedValueOnce({ servicesByAgentID: [svc] });
    await expect(ctrl.getByAgentID('a1')).resolves.toEqual([svc]);
  });

  test('ServiceAsset.linkAssetToService renvoie linkAssetToService déballé', async () => {
    const sa = { serviceAssetID: 'sa1', serviceID: 's1', assetID: 'a1' };
    const client: any = { query: jest.fn(), mutate: jest.fn().mockResolvedValue({ linkAssetToService: sa }) };
    await expect(new ServiceAsset(client).linkAssetToService('s1', 'a1', 'u1')).resolves.toEqual(sa);
    expect(client.mutate).toHaveBeenCalledWith(serviceAssetMutations.LINK_ASSET_TO_SERVICE, { serviceID: 's1', assetID: 'a1', authorID: 'u1' });
  });
});
