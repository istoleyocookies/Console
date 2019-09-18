<template>
  <div class="faction-container">
    <div class=columns>
      <div class="column is-two-thirds">
        <h1 class="title">Tasks</h1>
      </div>
      <div class="column">
        <b-input v-model="query" rounded icon="filter" placeholder="Filter.."></b-input>
      </div>
      <div class="column help-button">
        <button class="button is-info is-pulled-right" @click="isHelpActive = !isHelpActive">
          <b-icon icon="help"></b-icon>
        </button>
      </div>
    </div>
    <b-message class="help-message" type="is-info" title="Task Help" :active.sync="isHelpActive">
      <div class="content">
        <p>
          Tasks are commands that have been issued to agents. This is a list of each task that that is in the database.
          Clicking on an entry will take you to the output from that task.
        </p>
      </div>
    </b-message>
    <b-table
      ref="table"
      :data='filteredTasks'
      hoverable
      @click="loadTask">
      <template slot-scope='props'>
        <b-table-column field='Id' label='ID' width='40' sortable numeric>
            {{ props.row.Id }}
        </b-table-column>

        <b-table-column field='AgentName' label='Agent Name' sortable>
            {{ props.row.AgentName }}
        </b-table-column>

        <b-table-column field='Action' label='Action' sortable>
            {{ props.row.Action }}
        </b-table-column>

        <b-table-column field='Command' label='Command' sortable>
            {{ props.row.Command | truncate(40) }}
        </b-table-column>

        <b-table-column field='Username' label='Username' sortable>
            {{ props.row.Username }}
        </b-table-column>

        <b-table-column field='Complete' label='Complete' sortable>
            {{ props.row.Complete }}
        </b-table-column>

        <b-table-column field='Success' label='Success' sortable>
            {{ props.row.Success }}
        </b-table-column>

        <b-table-column field='Created' label='Created' sortable>
            {{ moment.utc(props.row.Created).fromNow() }}
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'tasks',
  data () {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 50,
      loading: false,
      selected: null,
      query: null,
      isHelpActive: false
    }
  },
  computed: {
    tasks () {
      return this.$store.state.tasks.list
    },
    filteredTasks (text) {
      if (this.query) {
        return this.findTasks(this.query)
      } else {
        return this.tasks
      }
    }
  },
  methods: {
    getTasks () {
      this.loading = true
      console.log('sending getTask')
      this.$socket.client.emit('getTask', { TaskId: 'all' })
      this.loading = false
    },
    findTasks (query) {
      return this.tasks.filter(function (task) {
        for (var property in task) {
          if (!['AgentId', 'Created', 'Id', 'Updates'].includes(property)) {
            if (String(task[property]).toLowerCase().includes(query.toLowerCase())) {
              return task
            }
            if ((query.toLowerCase() === 'complete') && (task.Complete === true)) {
              return task
            }
            if ((query.toLowerCase() === 'success') && (task.Success === true)) {
              return task
            }
          }
        }
      })
    },
    loadTask (task) {
      this.$router.push({ name: 'task', params: { TaskId: task.Id } })
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.getTasks()
    },
    initSort () {
      this.$refs.table.initSort()
      console.log('[TaskList:initSort] - Table sorted.')
    }
  },
  beforeMount () {
    this.getTasks()
  },
  mounted () {
    setTimeout(this.initSort(), 1)
  }
}
</script>
