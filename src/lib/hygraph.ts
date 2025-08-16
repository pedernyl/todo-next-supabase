import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://ap-south-1.cdn.hygraph.com/content/cmecyg1n9002l07wc1o31jjs7/master'; // Byt till din endpoint

export const client = new GraphQLClient(endpoint, {
  headers: {
    Authorization: `Bearer ${process.env.HYGRAPH_API_TOKEN}`
  }
});
