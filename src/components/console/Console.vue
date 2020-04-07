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
            <app-console-message-list ref="messageList" :messages="agent.ConsoleMessages"></app-console-message-list>
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

export default {
  name: 'console',
  data () {
    return {
      showAgentDetails: false,
      getAgentFired: null,
      query: null,
      agents: [],
      agent: null,
      agentId: this.$route.params.AgentId,
      error: null
    }
  },
  components: {
    appConsoleMessageList: consoleMessageList,
    appConsoleInput: consoleInput,
    appAgentList: agentList
  },
  computed: {
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
    getCommands () {
      console.log('[Console.vue] sending getAgentCommands with AgentId ' + this.agent.Id)
      // this.$socket.client.emit('getAgentCommands', { AgentId: this.agent.Id })
    },
    updateAgent () {
      const that = this
      console.log('[Console.vue] Getting agent: ' + this.$route.params.AgentId)
      const observer = this.$apollo.subscribe({
        query: require('../../graphql/agents/subscription-singleAgent.graphql'),
        variables: {
          agentID: this.$route.params.AgentId
        }
      })

      observer.subscribe({
        next (data) {
          console.log('Got data. Updating agent.')
          console.log(data.data.agent[0])
          that.agent = data.data.agent[0]
        },
        error (error) {
          this.error = JSON.stringify(error.message)
        }
      })
    }
  },
  created () {
    console.log('[Console.vue] Created. Updating agent and getting commands for agent id: ' + this.$route.params.AgentId)
    // this.updateCurrentAgentId(this.$route.params.AgentId)
    // this.getCommands(this.$route.params.AgentId)
  },
  beforeRouteLeave (to, from, next) {
    console.log('[Console.vue] leaving route, clearing currentAgent and messages')
    this.agent = null
    next()
  },
  mounted () {
    this.updateAgent()
  },
  watch: {
    $route: function () {
      // this.updateCurrentAgentId(this.$route.params.AgentId)
      // this.clearMessages()
      console.log('Route updated..')
      this.agent = null
      this.updateAgent()
    },
    messages () {
      this.$nextTick(function () {
        console.log('[Console.vue] Messages updated')
        const messageList = this.$refs.console
        if (messageList.scrollHeight !== undefined) {
          messageList.scrollTop = messageList.scrollHeight
        }
      })
    }
  },
  apollo: {
    $subscribe: {
      // agent: {
      //   query: require('../../graphql/agents/subscriptions/subscription-singleAgent.graphql'),
      //   variables () {
      //     return {
      //       agentID: this.agentId
      //     }
      //   },
      //   result (data) {
      //     this.agent = data.data.agent[0]
      //   },
      //   error (error) {
      //     this.error = JSON.stringify(error.message)
      //   }
      // },
      agents: {
        query: require('../../graphql/agents/subscription-allAgents.graphql'),
        result (data) {
          this.agents = data.data.agents
        },
        error (error) {
          this.error = JSON.stringify(error.message)
        }
      }
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
