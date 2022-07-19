/*
    (c) 2022 Pipele
    This code is licensed under MIT license (see LICENSE for details)\
*/

import { ApolloClient, gql } from '@apollo/client/core';
import { InMemoryCache } from '@apollo/client/cache';

export const pipeleGraphClient = new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/aireshbhat/beats',
    cache: new InMemoryCache(),
})


const hasSbtQuery = `
  query {
    tokens {
      id
      tokenID
      contentURI
      metadataURI
    }
  }
`

const fileIdQuery = `
  query {
    tokens {
      id
      tokenID
      contentURI
      metadataURI
    }
  }
`


export function canAccess() {
    return pipeleGraphClient.query({
        query: gql(hasSbtQuery),
        variables: {
            user: '',
            file: ''
        }
    });
}

export function getFileId() {
    return pipeleGraphClient.query({
        query: gql(fileIdQuery),
        variables: {
            user: '',
            file: ''
        }
    });
}
