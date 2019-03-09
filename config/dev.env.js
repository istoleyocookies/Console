'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ROUTER_MODE: '"hash"',
  API_ENDPOINT: '"http://127.0.0.1:5000/api/v1"',
  SOCKETIO_ENDPOINT: '"http://127.0.0.1:5000"'
})
