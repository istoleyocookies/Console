import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const faction = {
  state: {
    connected: false,
    connectionStatus: 'Disconnected from Faction API',
    connectionStatusMessage: null,
    loggedIn: false,
    accessKeyId: null,
    accessSecret: null,
    userId: null,
    username: null,
    notificationMessage: null,
    notificationType: null
  },
  mutations: {
    loginUser: (state, data) => {
      console.log('[vuex:LoginUserMutation] Running with User Id: ' + data['userId'])
      console.log('[vuex:LoginUserMutation] Running with User Role: ' + data['userRole'])
      console.log('[vuex:LoginUserMutation] Running with username ' + data['username'])
      if ((data['username'] && data['userId'] && data['userRole'])) {
        state.username = data['username']
        state.userId = data['userId']
        state.userRole = data['userRole']
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
      state.accessKeyId = null
      state.accessSecret = null
    }
  },
  actions: {
    loginUser: (context, data) => {
      console.log('[vuex:LoginUser Action] - Running with Key Id: ' + data['keyId'])
      console.log('[vuex:LoginUser Action] - Running with Secret: ' + data['secret'])
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
