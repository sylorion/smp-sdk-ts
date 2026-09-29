import * as fs from 'fs';
import * as path from 'path';
import { buildASTSchema, DefinitionNode, DocumentNode, GraphQLSchema, Kind, parse, specifiedRules, NoUnusedFragmentsRule, validate } from 'graphql';

import * as accountingQueries from '../../src/api/graphql/accounting/queries';
import * as accountingMutations from '../../src/api/graphql/accounting/mutations';
import * as applicationAuthMutations from '../../src/api/graphql/application/authMutations';
import * as authQueries from '../../src/api/graphql/auth/queries';
import * as authMutations from '../../src/api/graphql/auth/mutations';
import * as bookingQueries from '../../src/api/graphql/booking/queries';
import * as bookingMutations from '../../src/api/graphql/booking/mutations';
import * as catalogQueries from '../../src/api/graphql/catalog/queries';
import * as catalogMutations from '../../src/api/graphql/catalog/mutations';
import * as communicationQueries from '../../src/api/graphql/communication/queries';
import * as communicationMutations from '../../src/api/graphql/communication/mutations';
import * as flowQueries from '../../src/api/graphql/flow/queries';
import * as flowMutations from '../../src/api/graphql/flow/mutations';
import * as referralQueries from '../../src/api/graphql/referral/queries';
import * as referralMutations from '../../src/api/graphql/referral/mutations';
import * as capacityQueries from '../../src/api/graphql/capacity/queries';
import * as capacityMutations from '../../src/api/graphql/capacity/mutations';
import * as organizationQueries from '../../src/api/graphql/organization/queries';
import * as organizationMutations from '../../src/api/graphql/organization/mutations';
import * as organizationContactQueries from '../../src/api/graphql/organization/contactQueries';
import * as organizationContactMutations from '../../src/api/graphql/organization/contactMutations';
import * as organizationDocumentSettings from '../../src/api/graphql/organization/documentSettings';
import * as reviewQueries from '../../src/api/graphql/review/queries';
import * as reviewMutations from '../../src/api/graphql/review/mutations';
import * as userQueries from '../../src/api/graphql/user/queries';
import * as userMutations from '../../src/api/graphql/user/mutations';
import * as userSocialQueries from '../../src/api/graphql/user/socialQueries';
import * as userSocialMutations from '../../src/api/graphql/user/socialMutations';

/**
 * Alignement du SDK sur les schémas GraphQL des services.
 *
 * Chaque requête et mutation du SDK doit être valide contre le schéma du
 * sous-graphe qu'elle vise : un champ renommé, un argument retiré ou un type
 * d'entrée inconnu est une erreur à l'exécution que TypeScript ne voit pas.
 *
 * Les schémas de `schemas/` sont générés depuis le code des services
 * (`smp/scripts/graphql-schemas/generate.sh`). `legacy-misaligned.json` liste
 * les opérations héritées déjà cassées avant cette garde : la liste ne peut que
 * diminuer — une opération réparée doit en être retirée, une nouvelle opération
 * cassée fait échouer le test.
 */
const MODULES: Record<string, Record<string, unknown>> = {
  'accounting/queries': accountingQueries,
  'accounting/mutations': accountingMutations,
  'application/authMutations': applicationAuthMutations,
  'auth/queries': authQueries,
  'auth/mutations': authMutations,
  'booking/queries': bookingQueries,
  'booking/mutations': bookingMutations,
  'catalog/queries': catalogQueries,
  'catalog/mutations': catalogMutations,
  'communication/queries': communicationQueries,
  'communication/mutations': communicationMutations,
  'flow/queries': flowQueries,
  'flow/mutations': flowMutations,
  'referral/queries': referralQueries,
  'referral/mutations': referralMutations,
  'capacity/queries': capacityQueries,
  'capacity/mutations': capacityMutations,
  'organization/queries': organizationQueries,
  'organization/mutations': organizationMutations,
  'organization/contactQueries': organizationContactQueries,
  'organization/contactMutations': organizationContactMutations,
  'organization/documentSettings': organizationDocumentSettings,
  'review/queries': reviewQueries,
  'review/mutations': reviewMutations,
  'user/queries': userQueries,
  'user/mutations': userMutations,
  'user/socialQueries': userSocialQueries,
  'user/socialMutations': userSocialMutations,
};

const ROOT = path.resolve(__dirname, '../..');
const OPERATION = /^\s*(query|mutation|subscription)\b/;

function collectOperations(): Map<string, string> {
  const ops = new Map<string, string>();
  const visit = (mod: string, value: unknown, key: string, parent: string | null, depth: number) => {
    if (typeof value === 'string') {
      if (!OPERATION.test(value)) return;
      const plain = `${mod}::${key}`;
      const existing = ops.get(plain);
      // Deux objets d'un même module peuvent porter la même clé (ex. paymentMutations.UPDATE_CONTRACT
      // et contractMutations.UPDATE_CONTRACT) : un document différent ne doit pas écraser le premier,
      // sinon l'un des deux échappe à la validation.
      if (existing === undefined || existing === value) ops.set(plain, value);
      else ops.set(`${mod}::${parent ?? '(export)'}.${key}`, value);
      return;
    }
    if (value && typeof value === 'object' && depth < 2) {
      for (const [k, v] of Object.entries(value as Record<string, unknown>)) visit(mod, v, k, key, depth + 1);
    }
  };
  for (const [mod, exports] of Object.entries(MODULES)) {
    for (const [k, v] of Object.entries(exports)) visit(mod, v, k, null, 0);
  }
  return ops;
}

/**
 * Supergraphe approché : les types des sous-graphes sont fusionnés par nom
 * (champs, valeurs d'énumération et membres d'union réunis), comme le fait la
 * fédération pour une requête qui touche une entité enrichie par plusieurs services.
 */
function mergeSubgraphs(docs: DocumentNode[]): DocumentNode {
  const byName = new Map<string, any>();
  const order: string[] = [];
  for (const doc of docs) {
    for (const def of doc.definitions as readonly any[]) {
      if (def.kind === Kind.SCHEMA_DEFINITION || def.kind === Kind.SCHEMA_EXTENSION) continue;
      const name = def.name?.value;
      if (!name) continue;
      const key = `${def.kind === Kind.DIRECTIVE_DEFINITION ? '@' : ''}${name}`;
      const kind = String(def.kind).replace('Extension', 'Definition');
      const prev = byName.get(key);
      if (!prev) { byName.set(key, { ...def, kind }); order.push(key); continue; }
      const mergeList = (a: readonly any[] = [], b: readonly any[] = []) => {
        const seen = new Set(a.map((x) => x.name?.value));
        return [...a, ...b.filter((x) => !seen.has(x.name?.value))];
      };
      if (prev.fields || def.fields) prev.fields = mergeList(prev.fields, def.fields);
      if (prev.values || def.values) prev.values = mergeList(prev.values, def.values);
      if (prev.types || def.types) prev.types = mergeList(prev.types, def.types);
    }
  }
  return { kind: Kind.DOCUMENT, definitions: order.map((k) => byName.get(k)) as DefinitionNode[] };
}

function loadSchemas(): Array<[string, GraphQLSchema]> {
  const dir = path.join(ROOT, 'schemas');
  const docs = fs.readdirSync(dir)
    .filter((f) => f.endsWith('.graphql'))
    .map((f) => parse(fs.readFileSync(path.join(dir, f), 'utf8')));
  return [['supergraph', buildASTSchema(mergeSubgraphs(docs), { assumeValidSDL: true })]];
}

const RULES = specifiedRules.filter((r) => r !== NoUnusedFragmentsRule);

function misaligned(ops: Map<string, string>, schemas: Array<[string, GraphQLSchema]>): Map<string, string[]> {
  const out = new Map<string, string[]>();
  for (const [key, doc] of ops) {
    const ast = parse(doc);
    let best: string[] | null = null;
    for (const [, schema] of schemas) {
      const errors = validate(schema, ast, RULES).map((e) => e.message);
      if (errors.length === 0) { best = []; break; }
      if (!best || errors.length < best.length) best = errors;
    }
    if (best && best.length) out.set(key, best);
  }
  return out;
}

describe('SDK ↔ schémas GraphQL des services', () => {
  const ops = collectOperations();
  const schemas = loadSchemas();
  const allowed: string[] = JSON.parse(fs.readFileSync(path.join(__dirname, 'legacy-misaligned.json'), 'utf8'));
  const broken = misaligned(ops, schemas);

  test('tous les modules GraphQL du SDK sont inspectés (le test ne peut pas passer à vide)', () => {
    const files = (dir: string): string[] => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? files(path.join(dir, e.name)) : [path.join(dir, e.name)]);
    const onDisk = files(path.join(ROOT, 'src/api/graphql'))
      .map((f) => path.relative(path.join(ROOT, 'src/api/graphql'), f).replace(/\.ts$/, ''))
      .filter((f) => f !== 'index' && !/fragments$/.test(f));
    expect(onDisk.sort()).toEqual(Object.keys(MODULES).sort());
    expect(ops.size).toBeGreaterThan(300);
    expect(fs.readdirSync(path.join(ROOT, 'schemas')).filter((f) => f.endsWith('.graphql')).length).toBeGreaterThanOrEqual(10);
  });

  test('aucune opération cassée hors de la liste héritée', () => {
    const unexpected = [...broken.entries()].filter(([k]) => !allowed.includes(k)).map(([k, e]) => `${k}\n  - ${e.slice(0, 3).join('\n  - ')}`);
    expect(unexpected).toEqual([]);
  });

  test('la liste héritée ne garde que des opérations encore cassées (retirer celles qui ont été réparées ou supprimées)', () => {
    const stale = allowed.filter((k) => !broken.has(k));
    expect(stale).toEqual([]);
  });

  test('les opérations des flows, de l’apport d’affaires, des contrats et des jetons sont alignées', () => {
    const keys = [...ops.keys()].filter((k) => k.startsWith('flow/') || k.startsWith('referral/') || k.startsWith('capacity/')
      || /::(REJECT_CONTRACT|RESEND_CONTRACT_INVITATION|MARK_CONTRACT_INVITATION_OPENED|DUPLICATE_CONTRACT|GET_ORGANIZATION_SIGNATURE_SETTINGS|UPDATE_ORGANIZATION_SIGNATURE_SETTINGS|SAVE_ORGANIZATION_SIGNER|REMOVE_ORGANIZATION_SIGNER|SEND_CONTRACT|CREATE_ORDER|GET_AGENT_EXECUTION_STATUS|TOKEN_USAGE_SUMMARY|TOKEN_USAGE_HISTORY|TOKEN_COST_ESTIMATE|CONSUME_TOKENS|PAY_SERVICE_WITH_TOKENS)$/.test(k));
    expect(keys.length).toBeGreaterThanOrEqual(62);
    expect(keys.filter((k) => broken.has(k))).toEqual([]);
  });

  test('une clé homonyme portée par deux objets d’un même module est validée séparément', () => {
    const colliding = [...ops.keys()].filter((k) => /::[A-Za-z]+\.[A-Z_]+$/.test(k));
    for (const k of colliding) {
      const plain = k.replace(/::[A-Za-z]+\./, '::');
      expect(ops.has(plain)).toBe(true);
      expect(ops.get(plain)).not.toBe(ops.get(k));
    }
  });

  test('le détecteur signale bien un champ inconnu', () => {
    const fake = new Map([['x::BROKEN', 'query Broken { serviceFlow(flowId: "f") { notAField } }']]);
    expect(misaligned(fake, schemas).get('x::BROKEN')?.[0]).toMatch(/notAField/);
  });
});
