export type GraphQLSchemaType = 'query' | 'mutation' | 'subscription';

  export class GraphQLBuilder<
  TOperation extends GraphQLSchemaType,
  TFields extends Record<string, { variables: any; fields: any }>, // Capturer les types de variables et de champs
  TVariables = TFields[keyof TFields]['variables']
> {
  private operationType: TOperation;
  private operationName?: string;
  private operationField: keyof TFields;
  private fields: (keyof TFields[keyof TFields]['fields'] | Record<string, any[]>)[] = [];
  private variables: Partial<Record<keyof TVariables, any>> = {}; // Mapping des types de variables

  public static QuerySchemaType: GraphQLSchemaType = 'query';
  public static MutationSchemaType: GraphQLSchemaType = 'mutation';
  public static SubscriptionSchemaType: GraphQLSchemaType = 'subscription';

  constructor(operationType: TOperation, operationField: keyof TFields, operationName?: string) {
    this.operationType = operationType;
    this.operationField = operationField;
    this.operationName = operationName;
  }

  // Sélection des champs
  public select(...fields: (keyof TFields[keyof TFields]['fields'] | Record<string, any[]>)[]): this {
    this.fields.push(...fields);
    return this;
  }

  // Définir les variables
  public setVariables(vars: Partial<Record<keyof TVariables, any>>): this {
    this.variables = { ...this.variables, ...vars };
    return this;
  }

  // Construction de la requête
  public build(): string {
    const varDeclarationString = this.buildVariableDeclarations();
    const varUsageString = this.buildVariableUsages();
    const fieldString = this.buildFields(this.fields);
    const operationNameString = this.operationName ? `${this.operationName} ` : '';

    return `${this.operationType} ${operationNameString}${varDeclarationString} { ${String(this.operationField)}(${varUsageString}) { ${fieldString} } }`;
  }

  // Gérer la sélection des champs imbriqués récursivement
  private buildFields(fields: (keyof TFields[keyof TFields]['fields'] | Record<string, any[]>)[]): string {
    return fields
      .map(field => {
        if (typeof field === 'string') {
          return field;
        } else if (typeof field === 'object') {
          const [key, subFields] = Object.entries(field)[0];
          return `${key} { ${this.buildFields(subFields)} }`;
        }
      })
      .join(' ');
  }

  // Construire la déclaration des variables pour la requête
  private buildVariableDeclarations(): string {
    const varKeys = Object.keys(this.variables);
    const varVals = Object.values(this.variables);
    console.log(JSON.stringify(varVals));
    if (varKeys.length === 0) return ''; // Pas de variables définies
    const varDeclarations = varKeys
      .map((key, idx) => `$${key}:${typeof varVals[idx]}`)
      .join(', ');
    return `(${varDeclarations})`;
  }
  
  // Construire l'utilisation des variables dans le corps de la requête
  private buildVariableUsages(): string {
    const varKeys = Object.keys(this.variables);
    if (varKeys.length === 0) return ''; // Pas de variables à utiliser
    const varUsages = varKeys
      .map(key => `${key}: $${key}`) // Utilisation des variables dans le corps
      .join(', ');
    return varUsages;
  }

  // Récupérer la configuration des champs
  private getFieldConfig(field: keyof TFields) {
    return {} as TFields[typeof field]; // Simulation d'accès à la configuration, adapter selon vos besoins
  }
}
