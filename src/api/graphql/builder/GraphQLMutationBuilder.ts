import { GraphQLBuilder } from "./GraphQLBuilder.js";

export class GraphQLMutationBuilder<TVariables = {}> extends GraphQLBuilder<typeof GraphQLBuilder.MutationSchemaType,  GraphQLMutationType, TVariables> {
    constructor(operationField: keyof GraphQLMutationType, operationName?: string) {
      super(GraphQLBuilder.MutationSchemaType, operationField, operationName);
    }
  }
  