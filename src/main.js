// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import Buefy from 'buefy'
import 'source-code-pro/source-code-pro.css'
import { createProvider } from './vue-apollo'
import 'babel-polyfill'

const moment = require('moment')
moment.relativeTimeThreshold('ss', 3)

Vue.config.productionTip = false
Vue.prototype.moment = moment

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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  apolloProvider: createProvider(),
  store
})
