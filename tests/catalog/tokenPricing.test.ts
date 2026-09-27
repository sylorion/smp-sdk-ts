import { parse, visit, FieldNode } from 'graphql';
import * as catalogQueries from '../../src/api/graphql/catalog/queries';
import * as catalogMutations from '../../src/api/graphql/catalog/mutations';

/**
 * Prix en jetons plateforme (STK).
 *
 * mu-catalog expose `Service.pricingMode` (money | tokens | both) et
 * `Service.tokenPrice`. Sans ces champs, le tunnel de paiement ne peut pas
 * proposer « Payer avec mes jetons » et la fiche affiche un prix monétaire
 * pour un service vendu en jetons. Toute sélection de Service (repérée par
 * `billingPlan`) doit donc ramener les deux.
 */
function serviceSelectionsMissingTokenPricing(doc: string): string[] {
  const missing: string[] = [];
  const path: string[] = [];
  visit(parse(doc), {
    Field: {
      enter(node: FieldNode) {
        path.push(node.name.value);
        const fields = (node.selectionSet?.selections ?? []).filter((s): s is FieldNode => s.kind === 'Field').map((s) => s.name.value);
        if (fields.includes('billingPlan') && !(fields.includes('pricingMode') && fields.includes('tokenPrice'))) missing.push(path.join('.'));
      },
      leave() { path.pop(); },
    },
  });
  return missing;
}

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

describe('catalog — prix en jetons sélectionné avec le service', () => {
  const ops = allOperations().filter(([, d]) => /\bbillingPlan\b/.test(d));

  test('des sélections de Service sont bien découvertes', () => {
    expect(ops.length).toBeGreaterThanOrEqual(10);
  });

  test.each(ops)('%s : `pricingMode` et `tokenPrice` accompagnent `billingPlan`', (_name, doc) => {
    expect(serviceSelectionsMissingTokenPricing(doc)).toEqual([]);
  });

  test('le détecteur signale bien une sélection incomplète', () => {
    expect(serviceSelectionsMissingTokenPricing('query { service(id: "x") { serviceID billingPlan price currency } }')).toEqual(['service']);
  });
});
