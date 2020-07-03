// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'

import Buefy from 'buefy'

import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-client'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'

import 'source-code-pro/source-code-pro.css'

const moment = require('moment')
moment.relativeTimeThreshold('ss', 3)

Vue.config.productionTip = false
Vue.prototype.moment = moment

const getHeaders = () => {
  console.log('[main:getHeaders] running..')
  const headers = {}
  const token = window.localStorage.getItem('apollo-token')

  if (token) {
    headers.authorization = `Bearer ${token}`
  }
  return headers
}

// const httpLink = new HttpLink({
//   // You should use an absolute URL here
//   uri: 'http://localhost:8088/v1/graphql',
//   fetch,
//   headers: getHeaders()
// })

const wsLink = new WebSocketLink({
  uri: 'wss://' + location.host + '/api/v1/graphql',
  options: {
    reconnect: true,
    timeout: 30000,
    connectionParams: () => {
      return { headers: getHeaders() }
    }
  }
})
//
// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query)
//     return kind === 'OperationDefinition' && operation === 'subscription'
//   },
//   wsLink,
//   httpLink
// )

const apolloClient = new ApolloClient({
  link: wsLink,
  cache: new InMemoryCache({
    addTypename: true
  }),
  connectToDevTools: true
})

// Install the vue plugin
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
  defaultOptions: {
    $loadingKey: 'loading'
  }
})

Vue.filter('truncate', function (value, length) {
  return value.length > length
    ? value.substr(0, length) + '...'
    : value
})

Vue.filter('formatDate', function (date) {
  return moment.utc(date).local().format('MM/DD/YY')
})

Vue.filter('formatDateTime', function (date) {
  return moment.utc(date).local().format('MM/DD LTS')
})

Vue.filter('formatDateTimeAgo', function (date) {
  return moment.utc(date).local().fromNow()
})

Vue.use(Buefy)
Vue.use(VueApollo)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  apolloProvider,
  components: { App },
  template: '<App/>',
  store
})
