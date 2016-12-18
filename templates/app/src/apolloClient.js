import ApolloClient, {
  createNetworkInterface,
  addTypeName,
} from 'apollo-client';
import { GRAPHQL_URL } from 'config'; // eslint-disable-line

const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: GRAPHQL_URL,
  }),
  initialState: typeof window !== 'undefined' ? window.__APOLLO_STATE__ : null, // eslint-disable-line
  ssrForceFetchDelay: 100,
  queryTransformer: addTypeName,
});

export default client;
