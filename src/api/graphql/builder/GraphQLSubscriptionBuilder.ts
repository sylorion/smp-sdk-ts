import { GraphQLBuilder } from "./GraphQLBuilder.js";

class GraphQLSubscriptionBuilder<TVariables = {}> extends GraphQLBuilder<typeof GraphQLBuilder.SubscriptionSchemaType, GraphQLSubscriptionType, TVariables> {
    constructor(operationField: keyof GraphQLSubscriptionType, operationName?: string) {
      super(GraphQLBuilder.SubscriptionSchemaType, operationField, operationName);
    }
  }
  