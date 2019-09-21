<template>
  <div class="faction-container">
    <div class=columns>
      <div class="column is-two-thirds">
        <h1 class="title">Errors</h1>
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
    <b-message class="help-message" type="is-info" title="Error Help" :active.sync="isHelpActive">
      <div class="content">
        <p>
          Tasks are commands that have been issued to agents. This is a list of each task that that is in the database.
          Clicking on an entry will take you to the output from that task.
        </p>
      </div>
    </b-message>
    <b-table
      ref="table"
      :data='filteredErrors'
      hoverable
      @click="loadError">
      <template slot-scope='props'>
        <b-table-column field='Id' label='ID' width='40' sortable numeric>
            {{ props.row.Id }}
        </b-table-column>

        <b-table-column field='Source' label='Source' sortable>
            {{ props.row.Source }}
        </b-table-column>

        <b-table-column field='Message' label='Message' sortable>
            {{ props.row.Message }}
        </b-table-column>

        <b-table-column field='Timestamp' label='Timestamp' sortable>
            {{ props.row.Timestamp | formatDateTime }}
        </b-table-column>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'errors',
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
    errors () {
      return this.$store.state.errorMessages.list
    },
    filteredErrors (text) {
      if (this.query) {
        return this.findErrors(this.query)
      } else {
        return this.errors
      }
    }
  },
  methods: {
    getErrors () {
      this.loading = true
      console.log('[ErrorMessageList.vue] sending getError')
      this.$socket.client.emit('getErrorMessage', { ErrorMessageId: 'all' })
      this.loading = false
    },
    findErrors (query) {
      return this.errors.filter(function (error) {
        for (var property in error) {
          if (!['AgentId', 'Created', 'Id', 'Updates'].includes(property)) {
            if (String(error[property]).toLowerCase().includes(query.toLowerCase())) {
              return error
            }
            if ((query.toLowerCase() === 'complete') && (error.Complete === true)) {
              return error
            }
            if ((query.toLowerCase() === 'success') && (error.Success === true)) {
              return error
            }
          }
        }
      })
    },
    loadError (error) {
      this.$router.push({ name: 'errorMessage', params: { ErrorMessageId: error.Id } })
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.getErrors()
    },
    initSort () {
      this.$refs.table.initSort()
    }
  },
  beforeMount () {
    this.getErrors()
  },
  mounted () {
    setTimeout(this.initSort(), 1)
  }
}
</script>
