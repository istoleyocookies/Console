<template>
  <section>
    <div class="columns">
      <div class="column is-one-fifth is-paddingless agent-list-column">
        <app-agent-list :agents="agents"></app-agent-list>
      </div>
      <div v-if="agent" class="column is-paddingless console-column">
        <div class="console-wrapper">
          <div ref="console" class="console">
            <h2 class="subtitle console-title">Console Output for {{ agent.Name }}</h2>
            <app-console-message-list ref="messageList" :messages="messages"></app-console-message-list>
          </div>
          <div class="console-input">
            <app-console-input :agent="agent"></app-console-input>
          </div>
        </div>
      </div>
      <div class="columns" v-else>
        <div class="column has-text-centered">Loading Agents</div>
      </div>
    </div>
  </section>
</template>

<script>
import consoleMessageList from './ConsoleMessageList'
import consoleInput from './ConsoleInput'
import agentList from '../AgentList'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'console',
  data () {
    return {
      showAgentDetails: false,
      getAgentFired: null,
      query: null
    }
  },
  components: {
    appConsoleMessageList: consoleMessageList,
    appConsoleInput: consoleInput,
    appAgentList: agentList
  },
  computed: {
    ...mapState({
      agent: state => state.agents.currentAgent,
      agents: state => state.agents.list,
      messages: state => state.consoleMessages.list
    }),
    osIcon () {
      if (this.agent.OperatingSystem.includes('indows')) {
        return 'windows'
      } else if (this.agent.OperatingSystem.includes('acOS')) {
        return 'apple'
      } else if (this.agent.OperatingSystem.includes('nix')) {
        return 'linux'
      } else {
        return 'laptop'
      }
    }
  },
  methods: {
    ...mapActions([
      'updateCurrentAgentId',
      'clearCurrentAgent',
      'clearMessages',
      'clearCommands'
    ]),
    getCommands () {
      console.log('[Console.vue] sending getAgentCommands with AgentId ' + this.agent.Id)
      this.$socket.client.emit('getAgentCommands', { AgentId: this.agent.Id })
    }
  },
  created () {
    console.log('[Console.vue] Created. Updating agent and getting commands for agent id: ' + this.$route.params.AgentId)
    this.updateCurrentAgentId(this.$route.params.AgentId)
    this.getCommands(this.$route.params.AgentId)
  },
  beforeRouteLeave (to, from, next) {
    console.log('[Console.vue] leaving route, clearing currentAgent and messages')
    this.clearCurrentAgent()
    this.clearMessages()
    this.clearCommands()
    next()
  },
  watch: {
    $route () {
      this.updateCurrentAgentId(this.$route.params.AgentId)
      this.clearMessages()
      this.getCommands(this.$route.params.AgentId)
    },
    agent () {
      if (this.agent != null) {
        console.log('[Console.vue] joining room ' + this.agent.Id)
        this.$socket.client.emit('joinAgent', { AgentId: this.agent.Id })
      }
    },
    agents () {
      console.log('[Console.vue] agents updated, setting current agents')
      this.updateCurrentAgentId(this.$route.params.AgentId)
      this.getCommands(this.$route.params.AgentId)
    },
    messages () {
      this.$nextTick(function () {
        console.log('[Console.vue] Messages updated')
        var messageList = this.$refs.console
        if (messageList.scrollHeight !== undefined) {
          messageList.scrollTop = messageList.scrollHeight
        }
      })
    }
  }
}
</script>

<style scoped>
.agent-list-column {
  min-width: 350px;
}
.console-column {
  background: #012121;
}
.console-wrapper {
  height: 100vh;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 40px;
  background: #012121;
  z-index: -1;
}

.console-title,
.console-input > input {
  font-family: "Source Code Pro", "Lucida Console", Monaco, monospace;
}

.console {
  position: fixed;
  top: 52px;
  left: 25%;
  right: 0;
  bottom: 40px;
  min-height: 400px;
  padding-top: 10px;
  padding-left: 10px;
  overflow-y: auto;
}

.console-title {
  color: #eff7f7;
}

@media only screen and (max-width: 1023px) {
  .agent-list-column {
    display: none;
  }
  .console {
    left: 0;
  }

  .console-input,
  .console-input .input {
    left: 0;
  }
}

@media only screen and (min-width: 1024px) and (max-width: 1407px) {
  .console {
    left: 30%;
  }

  .console-input,
  .console-input .input {
    left: 30%;
  }
}
</style>
