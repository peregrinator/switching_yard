import { KeycloakConfig } from 'keycloak-angular'

let keycloakConfig: KeycloakConfig = {
  url: 'https://auth.example.com/auth',
  realm: 'example-com',
  clientId: 'example-com-web',
};


export const environment = {
  baseUrl: 'https://dev.example.com',
  apiUrl: 'https://dev.example.com/v1',
  wsUrl: 'wss://dev.example.com/v1',
  connectToDevTools: true,
  enableRouteTracing: false,
  production: true,
  keycloakConfig,
};