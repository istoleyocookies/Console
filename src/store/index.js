import Vue from 'vue'
import Vuex from 'vuex'
import $socket from '../socket-io-client'
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
    SOCKET_CONNECT: (state, status) => {
      state.connected = true
      state.connectionStatus = 'Connected to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_CONNECT_ERROR: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Error connecting to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_CONNECT_FAILED: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Failed to connect to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_CONNECT_TIMEOUT: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Timedout connecting to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_CONNECTING: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Connecting to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_DISCONNECT: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Disconnected from Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_RECONNECT: (state, status) => {
      state.connected = false
      state.connectionStatusMessage = status
    },
    SOCKET_RECONNECTING: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Reconnecting to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_RECONNECT_ATTEMPT: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Reconnect Attempt'
      state.connectionStatusMessage = status
    },
    SOCKET_RECONNECT_ERROR: (state, status) => {
      state.connected = false
      state.connectionStatusMessage = status
    },
    SOCKET_RECONNECT_FAILED: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Error reconnecting to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_ERROR: (state, status) => {
      state.connected = false
      state.connectionStatus = 'Error connecting to Faction API'
      state.connectionStatusMessage = status
    },
    SOCKET_LOGGEDOUT: (state, status) => {
      console.log('[vuex:SOCKET_LOGGEDOUT] Firing..')
      state.loggedIn = false
    },
    loginUser: (state, data) => {
      console.log('[vuex:LoginUserMutation] Running with User Id: ' + data['userId'])
      console.log('[vuex:LoginUserMutation] Running with User Role: ' + data['userRole'])
      console.log('[vuex:LoginUserMutation] Running with Key Id: ' + data['keyId'])
      console.log('[vuex:LoginUserMutation] Running with Secret: ' + data['secret'])
      if ((data['username'] && data['userId'] && data['keyId']) && (data['secret'])) {
        state.username = data['username']
        state.userId = data['userId']
        state.userRole = data['userRole']
        state.accessKeyId = data['keyId']
        state.accessSecret = data['secret']
        $socket.io.opts.query = {
          token: data['keyId'] + ':' + data['secret']
        }
        console.log('[vuex:LoginUserMutation] Opening Socket')
        $socket.open()
        state.loggedIn = true
      } else {
        console.log('[vuex:LoginUserMutation] Need both an Id and a Secret')
        state.connectionStatus = 'Error in login process'
      }
    },
    clearLoginState: (state) => {
      console.log('[vuex:clearLoginState] Running..')
      $socket.close()
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

const agents = {
  state: {
    list: [],
    currentAgent: null,
    commandsList: [],
    updated: null,
    notificationType: null,
    agentNotification: null
  },
  mutations: {
    SOCKET_GETAGENT: (state, agentObjects) => {
      console.log('[vuex:SOCKET_GETAGENT] mutation fired')
      state.list = agentObjects
      state.updated = Date.now()
    },
    SOCKET_NEWAGENT: (state, agentObject) => {
      console.log('[vuex:SOCKET_NEWAGENT] mutation fired')
      if (agentObject.Success) {
        state.list.push(agentObject)
        state.updated = Date.now()
        state.notificationType = 'connected'
        state.agentNotification = agentObject
      } else {
        console.log('[vuex:SOCKET_NEWAGENT] Error adding agent: ' + agentObject.message)
      }
    },
    SOCKET_AGENTCHECKIN: (state, agentCheckin) => {
      console.log('[vuex:SOCKET_AGENTCHECKIN] got: ' + agentCheckin.Id)
      let agent = state.list.find(agent => agent.Id === agentCheckin.Id)
      if (agent) {
        console.log('[vuex:SOCKET_AGENTCHECKIN] Updating agentid ' + agentCheckin.Id + ' LastCheckin to: ' + agentCheckin.Received)
        agent.LastCheckin = agentCheckin.Received
        state.updated = Date.now()
      } else {
        console.log('[vuex:SOCKET_AGENTCHECKIN] Could not find agent')
      }
    },
    SOCKET_AGENTUPDATED: (state, agentUpdated) => {
      console.log('[vuex:SOCKET_AGENTUPDATED] got agent id: ' + agentUpdated.Agent.Id)
      let agent = state.list.find(agent => agent.Id === agentUpdated.Agent.Id)
      if (agent.Visible && agentUpdated.Agent.Visible) {
        state.notificationType = 'updated'
      } else {
        state.notificationType = 'removed'
      }
      if (agent) {
        agent.Name = agentUpdated.Agent.Name
        agent.Enabled = agentUpdated.Agent.Enabled
        agent.Visible = agentUpdated.Agent.Visible
        state.updated = Date.now()
        state.agentNotification = agent
      } else {
        state.list.push(agentUpdated.Agent)
        state.updated = Date.now()
        state.notificationType = 'connected'
        state.agentNotification = agentUpdated
      }
    },
    SOCKET_GETAGENTCOMMANDS: (state, commands) => {
      console.log('[vuex:SOCKET_GETAGENTCOMMANDS] fired')
      console.log('[vuex:SOCKET_GETAGENTCOMMANDS] clearing commands list')
      state.commandsList = []
      state.commandsList = commands
    },
    SOCKET_AGENTCOMMANDSUPDATED: (state, update) => {
      console.log('[vuex:SOCKET_AGENTCOMMANDSUPDATED] fired')
      console.log('[vuex:SOCKET_AGENTCOMMANDSUPDATED] Current Agent Id: ' + state.currentAgent.Id + ', this update is for agent id: ' + update.AgentId)
      if (state.currentAgent.Id === update.AgentId) {
        console.log('[vuex:SOCKET_AGENTCOMMANDSUPDATED] updating this agents commands')
        console.log(update.Commands)
        state.commandsList = state.commandsList.concat(update.Commands)
      } else {
        console.log('[vuex:SOCKET_AGENTCOMMANDSUPDATED] not for our current agent, ignoring')
      }
    },
    updateCurrentAgent: (state, agentId) => {
      console.log('[vuex:updateCurrentAgent] running for id: ' + agentId)
      var idList = state.list.map(item => item.Id)
      var index = idList.indexOf(parseInt(agentId, 10))
      console.log('[vuex:updateCurrentAgent] Got index: ' + index)
      if (index > -1) {
        state.currentAgent = state.list[index]
      } else {
        console.log('[vuex:updateCurrentAgent] Could not find agent')
      }
    },
    clearCurrentAgent: (state) => {
      console.log('[vuex:clearCurrentAgent] nulling current agent')
      state.currentAgent = null
    },
    clearCommands: (state) => {
      console.log('[vuex:clearCommands] clear commands')
      state.commandsList = []
    }
  },
  actions: {
    updateCurrentAgentId: (context, agentId) => {
      console.log('[vuex:updateCurrentAgentId] got agentId: ' + agentId)
      context.commit('updateCurrentAgent', agentId)
    },
    clearCurrentAgent: (context) => {
      context.commit('clearCurrentAgent')
    },
    clearCommands: (context) => {
      context.commit('clearCommands')
    }
  }
}

const consoleMessages = {
  state: {
    list: []
  },
  mutations: {
    SOCKET_GETMESSAGE: (state, messageObjects) => {
      console.log('[vuex:SOCKET_GETMESSAGE] mutation fired')
      state.list = messageObjects
    },
    SOCKET_GETTASKMESSAGE: (state, messageObjects) => {
      console.log('[vuex:SOCKET_GETTASKMESSAGE] mutation fired')
      state.list = messageObjects.Results
    },
    SOCKET_CONSOLEMESSAGEANNOUNCEMENT: (state, messageObject) => {
      console.log('[vuex:SOCKET_CONSOLEMESSAGEANNOUNCEMENT] mutation fired')
      state.list.push(messageObject)
    },
    clearMessages: (state) => {
      console.log('[vuex:clearMessages] clearMessages running')
      state.list = []
    }
  },
  actions: {
    clearMessages: (context) => {
      context.commit('clearMessages')
    },
    getMessagesForTask: (context, taskId) => {
      context.commit('getMessagesForTask', taskId)
    }
  }
}

const errorMessages = {
  state: {
    list: [],
    currentErrorMessage: null,
    newErrorMessage: null,
    updated: null
  },
  mutations: {
    SOCKET_GETERRORMESSAGE: (state, errorObjects) => {
      console.log('[vuex:SOCKET_GETERRORMESSAGE] fired')
      state.list = errorObjects.Results
      state.updated = Date.now()
    },
    SOCKET_ERRORMESSAGEANNOUNCEMENT: (state, message) => {
      console.log('[vuex:SOCKET_ERRORMESSAGEANNOUNCEMENT] Firing..')
      state.newErrorMessage = message
      state.updated = Date.now()
    },
    updateCurrentErrorMessage: (state, messageId) => {
      console.log('[vuex:updateCurrentErrorMessage] running for id: ' + messageId)
      var idList = state.list.map(item => item.Id)
      var index = idList.indexOf(parseInt(messageId, 10))
      console.log('[vuex:updateCurrentErrorMessage] Got index: ' + index)
      if (index > -1) {
        state.currentErrorMessage = state.list[index]
      } else {
        console.log('[vuex:updateCurrentErrorMessage] Could not find error message')
      }
    }
  },
  actions: {
    updateCurrentErrorMessage: (context, messageId) => {
      context.commit('updateCurrentErrorMessage', messageId)
    }
  }
}

const files = {
  state: {
    list: []
  },
  mutations: {
    SOCKET_GETFILE: (state, fileObjects) => {
      console.log('[vuex:SOCKET_GETFILE] mutation fired')
      state.list = fileObjects.Results
    },
    SOCKET_NEWFILE: (state, fileObject) => {
      console.log('[vuex:SOCKET_NEWFILE] mutation fired')
      state.list.push(fileObject.Result)
    }
  }
}

const iocs = {
  state: {
    list: [],
    currentIoc: null,
    updated: null
  },
  mutations: {
    SOCKET_GETIOC: (state, iocObjects) => {
      console.log('[vuex:SOCKET_GETIOC] mutation fired')
      state.list = iocObjects.Results
      state.updated = Date.now()
    },
    SOCKET_NEWIOC: (state, iocObject) => {
      console.log('[vuex:SOCKET_NEWIOC] mutation fired')
      state.list.push(iocObject.Result)
      state.updated = Date.now()
    },
    updateCurrentIoc: (state, iocId) => {
      console.log('[vuex:updateCurrentIoc] running for id: ' + iocId)
      var idList = state.list.map(item => item.Id)
      var index = idList.indexOf(parseInt(iocId, 10))
      console.log('[vuex:updateCurrentIoc] Got index: ' + index)
      if (index > -1) {
        state.currentIoc = state.list[index]
      } else {
        console.log('[vuex:updateCurrentIoc] Could not find ioc')
      }
    }
  },
  actions: {
    updateCurrentIoc: (context, iocId) => {
      context.commit('updateCurrentIoc', iocId)
    }
  }
}

const payloads = {
  state: {
    list: [],
    payloadNotification: null,
    isDevPayloadModalActive: false,
    devPayloadKey: null,
    devPayloadJitter: null,
    devPayloadBeaconInterval: null,
    devPayloadExpirationDate: null
  },
  mutations: {
    SOCKET_GETPAYLOAD: (state, payloadObjects) => {
      console.log('[vuex:SOCKET_GETPAYLOAD] mutation fired')
      state.list = payloadObjects.Results
    },
    SOCKET_PAYLOADCREATED: (state, payloadObject) => {
      console.log('[vuex:SOCKET_NEWPAYLOAD] mutation fired')
      state.list.push(payloadObject.Payload)
    },
    SOCKET_DEVPAYLOADCREATED: (state, payloadObject) => {
      console.log('[vuex:SOCKET_DEVPAYLOADCREATED] got: ' + payloadObject)
      state.devPayloadKey = payloadObject.StagingKey
      state.devPayloadJitter = payloadObject.Jitter
      state.devPayloadBeaconInterval = payloadObject.BeaconInterval
      state.devPayloadExpirationDate = payloadObject.ExpirationDate
      state.isDevPayloadModalActive = true
    },
    SOCKET_PAYLOADUPDATED: (state, payloadObject) => {
      console.log('[vuex:SOCKET_PAYLOADUPDATED] got: ' + payloadObject.Payload.Id)
      console.log(payloadObject)
      let payload = state.list.find(payload => payload.Id === payloadObject.Payload.Id)
      if (payload) {
        console.log('[vuex:SOCKET_PAYLOADUPDATED] Updating payload ' + payload.Id)
        payload.Built = payloadObject.Payload.Built
        payload.BeaconInterval = payloadObject.Payload.BeaconInterval
        payload.Jitter = payloadObject.Payload.Jitter
        payload.ExpirationDate = payloadObject.Payload.ExpirationDate
        payload.Enabled = payloadObject.Payload.Enabled
        payload.Visible = payloadObject.Payload.Visible
        state.updated = Date.now()
        state.payloadNotification = payload
      } else {
        console.log('[vuex:SOCKET_PAYLOADUPDATED] Could not find payload')
      }
    },
    clearNewDevPayloadValues: (state) => {
      state.devPayloadKey = null
      state.devPayloadJitter = null
      state.devPayloadBeaconInterval = null
      state.devPayloadExpirationDate = null
      state.isDevPayloadModalActive = false
    }
  },
  actions: {
    clearNewDevPayloadValues: (context) => {
      context.commit('clearNewDevPayloadValues')
    }
  }
}

const tasks = {
  state: {
    list: []
  },
  mutations: {
    SOCKET_GETTASK: (state, taskObjects) => {
      console.log('[vuex:SOCKET_GETTASK] mutation fired')
      state.list = taskObjects.Results
    },
    SOCKET_NEWTASK: (state, taskObject) => {
      console.log('[vuex:SOCKET_NEWTASK] mutation fired')
      state.list.push(taskObject.Result)
    }
  }
}

const transports = {
  state: {
    list: [],
    isNewTransportApiModalActive: false,
    newTransportId: null,
    newTransportApiName: null,
    newTransportApiSecret: null,
    transportNotification: null
  },
  mutations: {
    SOCKET_GETTRANSPORT: (state, transportObjects) => {
      console.log('[vuex:SOCKET_GETTRANSPORT] mutation fired')
      state.list = transportObjects.Results
    },
    SOCKET_TRANSPORTCREATED: (state, transportObject) => {
      console.log('[vuex:SOCKET_TRANSPORTCREATED] mutation fired')
      if (transportObject.hasOwnProperty('ApiKey')) {
        state.newTransportId = transportObject.TransportId
        state.newTransportApiName = transportObject.ApiKey.KeyName
        state.newTransportApiSecret = transportObject.ApiKey.Secret
        state.isNewTransportApiModalActive = true
      }
      state.list.push(transportObject.Transport)
      state.transportNotification = transportObject.Transport
    },
    SOCKET_TRANSPORTUPDATED: (state, transportObject) => {
      console.log('[vuex:SOCKET_TRANSPORTUPDATED] fired')
      let transport = state.list.find(transport => transport.Id === transportObject.Transport.Id)
      if (transport) {
        console.log('[vuex:SOCKET_TRANSPORTUPDATED] Updating transport ' + transport.Id)
        transport.Name = transportObject.Transport.Name
        transport.Description = transportObject.Transport.Description
        transport.Enabled = transportObject.Transport.Enabled
        transport.Visible = transportObject.Transport.Visible
        state.updated = Date.now()
      } else {
        console.log('[vuex:SOCKET_TRANSPORTUPDATED] Could not find transport')
      }
    },
    SOCKET_TRANSPORTAPIKEY: (state, apiKeyObject) => {
      console.log('[vuex:SOCKET_TRANSPORTAPIKEY] fired')
    },
    clearNewTransportApiKeyValues: (state) => {
      state.newTransportId = null
      state.newTransportApiName = null
      state.newTransportApiSecret = null
      state.isNewTransportApiModalActive = false
    }
  },
  actions: {
    clearNewTransportApiKeyValues: (context) => {
      context.commit('clearNewTransportApiKeyValues')
    }
  }
}

export default new Vuex.Store({
  modules: {
    faction,
    agents,
    consoleMessages,
    errorMessages,
    iocs,
    files,
    payloads,
    tasks,
    transports
  }
})
