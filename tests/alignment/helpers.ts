import { FieldNode, OperationDefinitionNode, parse, print } from 'graphql';

/** Client GraphQL simulé : chaque test fixe la réponse et inspecte l'appel. */
export function mockClient() {
  return { query: jest.fn(), mutate: jest.fn() } as any;
}

function root(doc: string): FieldNode {
  const op = parse(doc).definitions[0] as OperationDefinitionNode;
  return op.selectionSet.selections[0] as FieldNode;
}

/** Nom du champ racine visé par le document. */
export function rootField(doc: string): string {
  return root(doc).name.value;
}

/** Arguments du champ racine : { nomArgument: valeur imprimée }. */
export function rootArgs(doc: string): Record<string, string> {
  return Object.fromEntries((root(doc).arguments ?? []).map((a) => [a.name.value, print(a.value)]));
}

/** Variables déclarées : { nom: type imprimé }. */
export function varTypes(doc: string): Record<string, string> {
  const op = parse(doc).definitions[0] as OperationDefinitionNode;
  return Object.fromEntries((op.variableDefinitions ?? []).map((v) => [v.variable.name.value, print(v.type)]));
}

/** Champs sélectionnés directement sous le champ racine (ou sous `path`). */
export function selected(doc: string, path: string[] = []): string[] {
  let node: FieldNode | undefined = root(doc);
  for (const seg of path) {
    node = node?.selectionSet?.selections.find((s) => (s as FieldNode).name?.value === seg) as FieldNode | undefined;
  }
  return (node?.selectionSet?.selections ?? []).map((s) => (s as FieldNode).name.value);
}
