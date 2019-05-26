<template>
  <div class="faction-container">
    <div class=columns>
      <div class="column is-two-thirds">
        <h1 class="title">Agents</h1>
      </div>
      <div class="column">
        <b-input v-model="query" rounded icon="filter" placeholder="Filter.."></b-input>
      </div>
    </div>
    <b-table
      ref="table"
      :data='filteredAgents'
      hoverable
      :default-sort="['Id', 'asc']"
      v-on:click="loadConsole">
      <template slot-scope='props'>
        <b-table-column field='Id' label='ID' width='40' sortable numeric>
            {{ props.row.Id }}
        </b-table-column>

        <b-table-column field='Name' label='Name' sortable>
            {{ props.row.Name }}
        </b-table-column>

        <b-table-column field='AgentType.Name' label='Type' sortable>
            {{ props.row.AgentType.Name }}
        </b-table-column>

        <b-table-column field='Username' label='Username' sortable>
            {{ props.row.Username }}
        </b-table-column>

        <b-table-column field='Hostname' label='Hostname' sortable>
            {{ props.row.Hostname }}
        </b-table-column>

        <b-table-column field='OperatingSystem' label='OS' sortable>
            {{ props.row.OperatingSystem }}
        </b-table-column>

        <b-table-column field='PID' label='PID' numeric sortable>
            {{ props.row.Pid }}
        </b-table-column>

        <b-table-column field='TransportName' label='Transport Name' numeric sortable>
            {{ props.row.Transport.Name }}
        </b-table-column>

        <b-table-column field='LastCheckin' label='Last Checkin' sortable>
            {{ props.row.LastCheckin | formatDateTime }}
        </b-table-column>

        <b-table-column field='hide' label='Delete' centered>
          <button class="button is-danger is-small is-rounded" @click.stop="hideAgent(props.row.Id)">
            <b-icon icon="delete" size="is-small"></b-icon>
          </button>
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 10,
      loading: false,
      selected: null,
      query: null
    }
  },
  computed: {
    agents () {
      return this.$store.state.agents.list
    },
    agentsList () {
      if (this.showHidden) {
        return this.agents
      } else {
        return this.agents.filter(function (agent) {
          if (agent.Visible) {
            return agent
          }
        })
      }
    },
    filteredAgents (text) {
      if (this.query) {
        return this.findAgents(this.query)
      } else {
        return this.agentsList
      }
    }
  },
  methods: {
    getAgents () {
      this.loading = true
      console.log('sending get maybe')
      this.$socket.emit('getAgent', { AgentId: 'all' })
      this.loading = false
    },
    findAgents (query) {
      return this.agentsList.filter(function (agent) {
        for (var property in agent) {
          if (!['InitialCheckin', 'LastCheckin', 'Success', 'Admin'].includes(property)) {
            if (String(agent[property]).toLowerCase().includes(query.toLowerCase())) {
              return agent
            }
            if ((query.toLowerCase() === 'admin') && (agent.Admin === true)) {
              return agent
            }
          }
        }
      })
    },
    hideAgent (id) {
      console.log('deleting agent id: ' + id)
      this.$socket.emit('hideAgent', { AgentId: id })
    },
    loadConsole (agent) {
      this.$router.push({ name: 'console', params: { AgentId: agent.Id } })
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.getAgents()
    },
    initSort () {
      this.$refs.table.initSort()
      console.log('[Home:initSort] - Table sorted.')
    }
  },
  beforeMount () {
    this.getAgents()
  },
  mounted () {
    setTimeout(this.initSort(), 1)
  }
}
</script>
