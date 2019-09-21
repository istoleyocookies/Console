<template>
  <div class="autocomplete">
    <b-table :data="filteredCommands"
             v-if="filteredCommands.length > 0 && commandSelected != true && input.length > 0"
             class="autocomplete-table"
             :row-class="(row, index) => 'autocomplete-row'">
      <template slot-scope="props">
        <b-table-column field='Name' label="Name">
          {{ props.row.Name }}
        </b-table-column>
        <b-table-column field='Description' label="Description">
          {{ props.row.Description }}
        </b-table-column>
      </template>
    </b-table>
    <div v-if="filteredCommands.length == 1 && filteredCommands[0].Parameters.length > 0 && commandSelected == true">
      <b-table :data="filteredCommands[0].Parameters"
               class="autocomplete-table"
               :row-class="(row, index) => 'autocomplete-row'">
        <template slot-scope="props">
          <b-table-column field='Name' label="Name">
            /{{ props.row.Name }}:
          </b-table-column>
          <b-table-column field='Help' label="Help">
            {{ props.row.Help }}
          </b-table-column>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'consoleAutoComplete',
  props: [
    'input'
  ],
  computed: {
    ...mapState({
      agent: state => state.agents.currentAgent,
      commandsList: state => state.agents.commandsList
    }),
    commandText () {
      if (this.input) {
        return this.input.split(' ')[0]
      } else {
        return null
      }
    },
    filteredCommands () {
      if (this.input) {
        return this.findCommands(this.commandText)
      } else {
        return this.commandsList
      }
    },
    commandSelected () {
      if (this.input && this.input.indexOf(' ') > 1) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    ...mapActions([
      'clearCommands'
    ]),
    findCommands (query) {
      return this.commandsList.filter(function (command) {
        if (String(command['Name']).toLowerCase().startsWith(query.toLowerCase())) {
          return command
        }
      })
    },
    getCommands () {
      console.log('sending getAgentCommands')
      this.$socket.client.emit('getAgentCommands', { AgentId: this.agent.Id })
    }
  },
  beforeMount () {
    this.getCommands()
  },
  beforeRouteLeave (to, from, next) {
    console.log('leaving route, clearing stuff')
    this.clearCommands()
    next()
  }
}
</script>

<style >
  .autocomplete {
    color: #fff;
    position: fixed;
    left: 27%;
    bottom: 52px;
  }

  .autocomplete-row {
    color: #aaaaaa;
    background: #034748;
  }

  .autocomplete-table .table-wrapper table {
    background-color: #034748;
  }

  .autocomplete-table .table-wrapper table th {
    color: #aaaaaa;
    border-bottom-color: #333333;
  }

  .autocomplete-row td {
    word-wrap: break-word;
    border-bottom-color: #333333;
  }

</style>
