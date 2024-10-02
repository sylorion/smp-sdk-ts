import { GraphQLBuilder } from "./GraphQLBuilder.js";

export class GraphQLQueryBuilder<TVariables = {}> extends GraphQLBuilder<typeof GraphQLBuilder.QuerySchemaType, GraphQLQueryType, TVariables> {
    constructor(operationField: keyof GraphQLQueryType, operationName?: string) {
      super(GraphQLBuilder.QuerySchemaType, operationField, operationName);
    }
  }

  
  