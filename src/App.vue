<template>
  <div id="app">
    <app-navbar v-if="$route.name != 'login'"></app-navbar>
    <div>
      <div class="connection-notification has-background-danger level" v-if="connectionError">
        <p class="level-item">
          <b-icon icon="alert-circle-outline"></b-icon> <span>{{ connectionStatus }}</span>
        </p>
      </div>
      <router-view class="enable-scroll"/>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import { mapState } from 'vuex'
console.log('NodeJS Environment Setting: ' + process.env.NODE_ENV)
console.log('API Endpoint: ' + process.env.VUE_APP_API_ENDPOINT)
console.log('SocketIO Endpoint: ' + process.env.VUE_APP_SOCKETIO_ENDPOINT)
export default {
  name: 'App',
  data () {
    return {
      connectionError: false
    }
  },
  components: {
    appNavbar: Navbar
  },
  computed: {
    ...mapState({
      token: state => state.faction.token,
      connected: state => state.faction.connected,
      connectionStatus: state => state.faction.connectionStatus,
      connectionStatusMessage: state => state.faction.connectionStatusMessage,
      newErrorMessage: state => state.errorMessages.newErrorMessage,
      agentNotificationType: state => state.agents.notificationType,
      agentNotification: state => state.agents.agentNotification,
      transportNotification: state => state.transports.transportNotification,
      payloadNotification: state => state.payloads.payloadNotification
    })
  },
  watch: {
    connected () {
      if (this.connected) {
        this.connectionError = false
        console.log('Connected. Getting Agents.')
        this.$socket.client.emit('getAgent', { AgentId: 'all' })
        this.$toast.open({
          message: 'Connected to Faction!',
          type: 'is-success',
          queue: false
        })
      } else if (!this.connected) {
        this.connectionError = true
      }
    },
    agentNotification () {
      var actiontext = null
      if (this.agentNotificationType === 'connected') {
        actiontext = 'GO'
      }
      this.$snackbar.open({
        duration: 5000,
        message: 'Agent ' + this.agentNotificationType + ': ' + this.agentNotification.Name,
        actionText: actiontext,
        queue: false,
        onAction: () => {
          this.$router.push({ name: 'console', params: { AgentId: this.agentNotification.Id } })
        }
      })
    },
    payloadNotification () {
      this.$snackbar.open({
        duration: 5000,
        message: 'Payload updated: ' + this.payloadNotification.Name,
        actionText: 'GO',
        queue: false,
        onAction: () => {
          this.$router.push({ name: 'payloads' })
        }
      })
    },
    newErrorMessage () {
      this.$snackbar.open({
        duration: 10000,
        message: 'ERROR: ' + this.newErrorMessage.Message,
        actionText: 'GO',
        queue: false,
        type: 'is-danger',
        onAction: () => {
          this.$router.push({ name: 'errorMessage', params: { ErrorMessageId: this.newErrorMessage.Id } })
        }
      })
    }
  }
}
</script>

<style lang='scss'>
$mdi-font-path: '~@mdi/font/fonts';
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "~@mdi/font/scss/materialdesignicons";
// Global CSS stuff
.help-button {
  max-width: 50px;
}
.help-message {
  max-width: 800px;
  margin: 0 auto;
}
.faction-container {
  padding-top: 20px;
  padding-right: 2%;
  padding-left: 2%;
}
.connection-notification {
  text-align: center;
  height: 40px;
  color: #eff7f7;
  position: fixed;
  top: 50px;
  left: 0;
  right: 0;
}

.connection-notification span {
  padding-left: 10px;
}

.faction-html {
  overflow-y: auto !important;
}
.disable-scroll {
  overflow-y: hidden !important;
}

</style>
