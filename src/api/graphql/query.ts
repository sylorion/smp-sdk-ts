

type GraphQLQueryType = {
  user: { 
    variables: { id: string }, 
    fields: { id: string, name: string, profile: { age: number, location: string } }
  };
  profile: {
    variables: {id: string, uuid: string},
    fields: { title: string, content: string }
  };
};