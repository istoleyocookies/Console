<template>
  <div class="faction-container">
    <div class=columns>
      <div class="column is-two-thirds">
        <h1 class="title">IOCs</h1>
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
    <b-message class="help-message" type="is-info" title="IOC Help" :active.sync="isHelpActive">
      <div class="content">
        <p>
          Tasks are commands that have been issued to agents. This is a list of each task that that is in the database.
          Clicking on an entry will take you to the output from that task.
        </p>
      </div>
    </b-message>
    <b-table
      ref="table"
      :data='filteredIOCs'
      hoverable
      @click="loadIOC">
      <template slot-scope='props'>
        <b-table-column field='Id' label='ID' width='40' sortable numeric>
            {{ props.row.Id }}
        </b-table-column>

        <b-table-column field='Agent.Name' label='Agent Name' sortable>
            {{ props.row.Agent.Name }}
        </b-table-column>

        <b-table-column field='Agent.Hostname' label='Hostname' sortable>
          {{ props.row.Agent.Hostname }}
        </b-table-column>

        <b-table-column field='Description' label='Description' sortable>
            {{ props.row.Description }}
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
  name: 'iocs',
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
    iocs () {
      return this.$store.state.iocs.list
    },
    filteredIOCs (text) {
      if (this.query) {
        return this.findIOCs(this.query)
      } else {
        return this.iocs
      }
    }
  },
  methods: {
    getIOCs () {
      this.loading = true
      console.log('[IocList.vue] sending getIOC')
      this.$socket.client.emit('getIOC', { IocId: 'all' })
      this.loading = false
    },
    findIOCs (query) {
      return this.iocs.filter(function (ioc) {
        for (var property in ioc) {
          if (!['AgentId', 'Created', 'Id', 'Updates'].includes(property)) {
            if (String(ioc[property]).toLowerCase().includes(query.toLowerCase())) {
              return ioc
            }
            if ((query.toLowerCase() === 'complete') && (ioc.Complete === true)) {
              return ioc
            }
            if ((query.toLowerCase() === 'success') && (ioc.Success === true)) {
              return ioc
            }
          }
        }
      })
    },
    loadIOC (ioc) {
      this.$router.push({ name: 'ioc', params: { IocId: ioc.Id } })
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.getIOCs()
    },
    initSort () {
      this.$refs.table.initSort()
    }
  },
  beforeMount () {
    this.getIOCs()
  },
  mounted () {
    setTimeout(this.initSort(), 1)
  }
}
</script>
