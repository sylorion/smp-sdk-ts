import { parse, visit, FieldNode } from 'graphql';
import * as catalogQueries from '../../src/api/graphql/catalog/queries';
import * as catalogMutations from '../../src/api/graphql/catalog/mutations';
import { serviceQueries } from '../../src/api/graphql/catalog/queries';

/**
 * Devise des services et assets.
 *
 * mu-catalog expose `Service.currency` et `Asset.currency` (devise ISO de
 * l'organisation vendeuse). Un prix sans sa devise est ambigu : le front
 * l'afficherait en euros pour une organisation en dollars. Toute sélection
 * qui ramène `price` doit donc ramener `currency`.
 */
function allOperations(): Array<[string, string]> {
  const ops: Array<[string, string]> = [];
  for (const mod of [catalogQueries, catalogMutations] as Record<string, unknown>[]) {
    for (const [groupName, group] of Object.entries(mod)) {
      if (!group || typeof group !== 'object') continue;
      for (const [name, doc] of Object.entries(group as Record<string, unknown>)) {
        if (typeof doc === 'string' && /\b(query|mutation)\b/.test(doc)) ops.push([`${groupName}.${name}`, doc]);
      }
    }
  }
  return ops;
}

/** Chemins des sélections qui contiennent `price` sans `currency`. */
function priceWithoutCurrency(doc: string): string[] {
  const missing: string[] = [];
  const path: string[] = [];
  visit(parse(doc), {
    Field: {
      enter(node: FieldNode) {
        path.push(node.name.value);
        const fields = (node.selectionSet?.selections ?? [])
          .filter((s): s is FieldNode => s.kind === 'Field')
          .map((s) => s.name.value);
        if (fields.includes('price') && !fields.includes('currency')) missing.push(path.join('.'));
      },
      leave() {
        path.pop();
      },
    },
  });
  return missing;
}

describe('catalog — devise sélectionnée avec le prix', () => {
  const ops = allOperations();

  test('les opérations du catalogue sont bien découvertes (le test ne peut pas passer à vide)', () => {
    expect(ops.length).toBeGreaterThan(20);
    expect(ops.some(([, d]) => /\bprice\b/.test(d))).toBe(true);
  });

  test.each(ops)('%s : chaque `price` est accompagné de `currency`', (_name, doc) => {
    expect(priceWithoutCurrency(doc)).toEqual([]);
  });

  test('le détecteur signale bien une sélection incomplète', () => {
    expect(priceWithoutCurrency('query { service(serviceID: "1") { price } }')).toEqual(['service']);
    expect(priceWithoutCurrency('query { service(serviceID: "1") { price currency } }')).toEqual([]);
  });

  test('les assets imbriqués dans un service portent aussi leur devise', () => {
    expect(serviceQueries.GET_SERVICE_BY_ID).toMatch(/asset\s*\{[\s\S]*?price\s+currency/);
  });
});
