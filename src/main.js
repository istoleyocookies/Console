// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueSocketio from 'vue-socket.io-extended'
import $socket from './socket-io-client'
import Buefy from 'buefy'
import VueCookies from 'vue-cookies'

import 'source-code-pro/source-code-pro.css'

import store from './store/index'

var moment = require('moment')
moment.relativeTimeThreshold('ss', 3)

Vue.config.productionTip = false
Vue.prototype.moment = moment
Vue.use(store)
Vue.use(VueSocketio, $socket, { store })
Vue.use(Buefy)
Vue.use(VueCookies)

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

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
