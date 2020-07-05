import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const faction = {
  state: {
    connected: false,
    connectionStatus: 'Disconnected from Faction API',
    connectionStatusMessage: null,
    loggedIn: false,
    accessToken: null,
    userId: null,
    username: null,
    notificationMessage: null,
    notificationType: null
  },
  mutations: {
    websocketConnected: (state, data) => {
      console.log('[vuex:websocketConnected] Connection established.')
      state.connected = true
      state.connectionStatus = 'Connected to Faction API'
    },
    websocketDisconnected: (state, data) => {
      console.log('[vuex:websocketConnected] Connection established.')
      state.connected = false
      state.connectionStatus = 'Disconnected from Faction API'
    },
    loginUser: (state, data) => {
      console.log('[vuex:LoginUserMutation] Running with User Id: ' + data.user_id)
      console.log('[vuex:LoginUserMutation] Running with User Role: ' + data.user_role)
      console.log('[vuex:LoginUserMutation] Running with username ' + data.username)
      console.log('[vuex:LoginUserMutation] Running with Access Token ' + data.access_key)
      if ((data.username && data.user_id && data.user_role)) {
        state.username = data.username
        state.userId = data.user_id
        state.userRole = data.user_role
        state.accessToken = data.accessToken
        state.loggedIn = true
      } else {
        console.log('[vuex:LoginUserMutation] Need both an Id and a Secret')
        state.connectionStatus = 'Error in login process'
      }
    },
    clearLoginState: (state) => {
      console.log('[vuex:clearLoginState] Running..')
      state.username = null
      state.userId = null
      state.userRole = null
      state.accessToken = null
      state.loggedIn = false
    }
  },
  actions: {
    loginUser: (context, data) => {
      context.commit('loginUser', data)
    },
    clearLoginState: (context) => {
      context.commit('clearLoginState')
    }
  }
}

export default new Vuex.Store({
  modules: {
    faction
  }
})
