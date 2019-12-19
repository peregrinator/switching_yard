import { NgModule } from '@angular/core'
import { Router } from '@angular/router'
import { HttpHeaders, HttpErrorResponse } from '@angular/common/http'

import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular'
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http'
import { ApolloLink, from, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { setContext } from "apollo-link-context"
import { InMemoryCache } from 'apollo-cache-inmemory'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { KeycloakService } from 'keycloak-angular'

import {ɵstringify as stringify} from '@angular/core'

import { environment } from 'src/environments/environment'

interface Definintion {
  kind: string
  operation?: string
}

export function createApollo(
  httpLink: HttpLink,
  keycloak: KeycloakService,
  router: Router,
) {
  // create http link
  const http = httpLink.create({
    uri: `${environment.apiUrl}/graphql`
  })


  // create websocket link
  const ws = new WebSocketLink({
    uri: `${environment.wsUrl}/graphql`,
    options: {
      // lazy: true,
      reconnect: true,
      connectionParams: keycloak.getToken().then((token) => {
        return {
          headers: {"Authorization": `Bearer ${token}`}
        }
      })
    },
  })

  // send data to each link depending on what kind of operation
  // is being sent
  const splitLink = split(
    // split based on operation type
    ({ query }) => {
      const { kind, operation }: Definintion = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    ws,
    http,
  )

  const authMiddleware = setContext(async (req, { headers }) => {
    const token: string = await keycloak.getToken()
  
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      },
    }
  })

  // post-request
  const unauthorizedRequest = onError(({ networkError }) => {
    const networkErrorRef:HttpErrorResponse = networkError as HttpErrorResponse

    if (networkErrorRef && networkErrorRef.status === 401) {
      router.navigate(['/auth'])
    }
  })

  return {
    link: from([authMiddleware, unauthorizedRequest, splitLink]),
    cache: new InMemoryCache(),
    connectToDevTools: environment.connectToDevTools
  }
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, KeycloakService, Router],
    },
  ],
})
export class GraphQLModule {}