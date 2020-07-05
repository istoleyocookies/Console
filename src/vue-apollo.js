import Vue from 'vue'
import VueApollo from 'vue-apollo'
// import { setContext } from 'apollo-link-context'
import { createApolloClient, restartWebsockets } from 'vue-cli-plugin-apollo/graphql-client'

// Install the vue plugin
Vue.use(VueApollo)

// Name of the localStorage item
const AUTH_TOKEN = 'faction-api-key'

// Http endpoint
const httpEndpoint = 'https://' + location.host + '/api/v1/graphql'
const wsEndpoint = 'wss://' + location.host + '/api/v1/graphql'

// const authLink = setContext((_, { headers }) => {
//   console.log('In authlink')
//   // get the authentication token from local storage if it exists
//   const token = localStorage.getItem(AUTH_TOKEN)
//   console.log('Got token: ' + token)
//   // return the headers to the context so httpLink can read them
//   return {
//     headers: {
//       ...headers,
//       authorization: token ? 'Bearer ' + token : ''
//     }
//   }
// })

// Config
const defaultOptions = {
  // You can use `https` for secure connection (recommended in production)
  httpEndpoint,
  // You can use `wss` for secure connection (recommended in production)
  // Use `null` to disable subscriptions
  wsEndpoint: wsEndpoint,
  // LocalStorage token
  tokenName: AUTH_TOKEN,
  // Enable Automatic Query persisting with Apollo Engine
  persisting: false,
  // Use websockets for everything (no HTTP)
  // You need to pass a `wsEndpoint` for this to work
  websocketsOnly: false,
  // Is being rendered on the server?
  ssr: false

  // Override default apollo link
  // note: don't override httpLink here, specify httpLink options in the
  // httpLinkOptions property of defaultOptions.
  // link: authLink

  // Override default cache
  // cache: myCache

  // Override the way the Authorization header is set
  // getAuth: (tokenName) => ...

  // Additional ApolloClient options
  // apollo: { ... }

  // Client local data (see apollo-link-state)
  // clientState: { resolvers: { ... }, defaults: { ... } }
}

// Call this in the Vue app file
export function createProvider (options = {}) {
  // Create apollo client
  const { apolloClient, wsClient } = createApolloClient({
    ...defaultOptions,
    ...options
  })
  wsClient.onConnected(() => console.log('websocketConnected'))
  wsClient.onDisconnected(() => console.log('websocketDisconnected'))
  wsClient.onReconnected(() => console.log('websocketConnected'))
  apolloClient.wsClient = wsClient

  // Create vue apollo provider
  const apolloProvider = new VueApollo({
    defaultClient: apolloClient,
    defaultOptions: {
      $query: {
        // fetchPolicy: 'cache-and-network',
      }
    },
    errorHandler (error) {
      // eslint-disable-next-line no-console
      console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
    }
  })
  return apolloProvider
}

// Manually call this when user log in
export function onLogin (apolloClient, token) {
  console.log('[vue-apollo:onLogin] Got token: ' + token)
  if (typeof localStorage !== 'undefined' && token) {
    console.log('[vue-apollo:onLogin] Setting localstorage')
    localStorage.setItem(AUTH_TOKEN, token)
  }
  if (apolloClient.wsClient) {
    console.log('[vue-apollo:onLogin] Restarting wsClient')
    restartWebsockets(apolloClient.wsClient)
  }
  try {
    apolloClient.resetStore()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log('%cError on cache reset (login)', 'color: orange;', e.message)
  }
}

// Manually call this when user log out
// function onLogout (apolloClient) {
//   if (typeof localStorage !== 'undefined') {
//     localStorage.removeItem(AUTH_TOKEN)
//   }
//   if (apolloClient.wsClient) restartWebsockets(apolloClient.wsClient)
//   try {
//     apolloClient.resetStore()
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log('%cError on cache reset (logout)', 'color: orange;', e.message)
//   }
// }
