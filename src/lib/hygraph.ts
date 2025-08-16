import { GraphQLClient } from 'graphql-request';

// Use environment variables for endpoint and token
export const client = new GraphQLClient(process.env.HYGRAPH_API_URL!, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_API_TOKEN}`,
  },
});
