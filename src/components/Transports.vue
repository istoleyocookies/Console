<template>
  <div class="faction-container">
    <div class=columns>
      <div class="column is-two-thirds">
        <h1 class="title">Transports</h1>
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
    <b-message class="help-message" type="is-info" title="Transport Help" :active.sync="isHelpActive">
      <div class="content">
        <p>
          Transports sit between Faction and your agents. When you create a new Transport, you'll be asked to
          provide a name. This name is free form, use it to identify what this transport will be used for, for
          example: "Low and Slow HTTPS". Once your transport has been created, you will get an API key. The
          documentation for your transport should provide further details on what to do with this key.
        </p>
      </div>
    </b-message>
    <b-table
      ref="table"
      :data='filteredTransports'
      hoverable>
      <template slot-scope='props'>
        <b-table-column field='Id' label='ID' width='40' sortable numeric>
            {{ props.row.Id }}
        </b-table-column>

        <b-table-column field='Name' label='Name' sortable>
            {{ props.row.Name }}
        </b-table-column>

        <b-table-column field='TransportType' label='Type' sortable>
            {{ props.row.TransportType }}
        </b-table-column>

        <b-table-column field='ApiKeyName' label='API Key Name' sortable>
            {{ props.row.ApiKeyName }}
        </b-table-column>

        <b-table-column field='Created' label='Created' sortable>
            {{ moment.utc(props.row.Created).fromNow() }}
        </b-table-column>

        <b-table-column field='LastCheckin' label='Last Checkin' sortable>
            {{ moment.utc(props.row.LastCheckin).fromNow() }}
        </b-table-column>

        <b-table-column field='Enabled' label='Enabled' sortable>
            <b-checkbox v-model="props.row.Enabled" @click.native="toggleTransport(props.row.Id, $event)"></b-checkbox>
        </b-table-column>

        <b-table-column field='hide' label='Hide' centered>
          <button class="button is-danger is-small is-rounded" @click="hideTransport(props.row.Id)">
            <b-icon icon="delete" size="is-small"></b-icon>
          </button>
        </b-table-column>
      </template>
    </b-table>
    <div class="content content-container">
      <p>
        <button @click="openNewTransportModal" class="button is-primary">New Transport</button>
      </p>
    </div>
    <b-modal :active.sync="isNewTransportModalActive" scroll="keep">
      <div class="modal-card" style="width: auto">
        <header class="modal-card-head">
          <p class="modal-card-title">New Transport</p>
        </header>
        <section class="modal-card-body">
          <b-field label="Name">
            <b-input placeholder="Name" v-model="newTransportName">
            </b-input>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-primary" @click="createTransport">Create Transport</button>
        </footer>
      </div>
    </b-modal>
    <b-modal :active.sync="isNewTransportApiModalActive" scroll="keep" @close="clearNewTransportApiKeyValues" :width="1024" >
      <header class="modal-card-head">
        <p class="modal-card-title">New Transport API Key</p>
      </header>
      <section class="modal-card-body">
        <p>Make note of this secret. Once you close this window, it is gone.</p>
        <p>
<pre class="is-paddingless">
<strong>Transport ID:</strong> {{ this.newTransportId }}
<strong>API Key Name:</strong> {{ this.newTransportApiName }}
<strong>API Secret:</strong> {{ this.newTransportApiSecret }}
</pre>
        </p>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="closeNewTransportApiKeyWindow()">Close</button>
      </footer>
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Transports',
  data () {
    return {
      isPaginated: true,
      isPaginationSimple: false,
      currentPage: 1,
      perPage: 50,
      loading: false,
      selected: null,
      query: null,
      isHelpActive: false,
      isNewTransportModalActive: false,
      newTransportName: null
    }
  },
  computed: {
    ...mapState({
      transports: state => state.transports.list,
      isNewTransportApiModalActive: state => state.transports.isNewTransportApiModalActive,
      newTransportId: state => state.transports.newTransportId,
      newTransportApiName: state => state.transports.newTransportApiName,
      newTransportApiSecret: state => state.transports.newTransportApiSecret
    }),
    transportsList () {
      if (this.showHidden) {
        return this.transports
      } else {
        return this.transports.filter(function (transport) {
          if (transport.Visible) {
            return transport
          }
        })
      }
    },
    filteredTransports (text) {
      if (this.query) {
        return this.findTransports(this.query)
      } else {
        return this.transportsList
      }
    }
  },
  methods: {
    ...mapActions([
      'clearNewTransportApiKeyValues'
    ]),
    getTransports () {
      this.loading = true
      console.log('sending get maybe')
      this.$socket.client.emit('getTransport', { TransportId: 'all' })
      this.loading = false
    },
    findTransports (query) {
      return this.transportsList.filter(function (transport) {
        for (var property in transport) {
          if (!['AgentId', 'Created', 'Id', 'Updates'].includes(property)) {
            if (String(transport[property]).toLowerCase().includes(query.toLowerCase())) {
              return transport
            }
            if ((query.toLowerCase() === 'complete') && (transport.Complete === true)) {
              return transport
            }
            if ((query.toLowerCase() === 'success') && (transport.Success === true)) {
              return transport
            }
          }
        }
      })
    },
    loadTransport (transport) {
      this.$router.push({ name: 'transport', params: { TransportId: transport.Id } })
    },
    openNewTransportModal () {
      this.isNewTransportModalActive = true
    },
    clearNewTransportValues () {
      this.newTransportDescription = null
    },
    closeNewTransportWindow () {
      this.clearNewTransportValues()
      this.isNewTransportModalActive = false
    },
    createTransport () {
      this.processing = true
      this.$socket.client.emit('newTransport',
        {
          'Name': this.newTransportName
        })
      this.proccessing = false
      this.closeNewTransportWindow()
    },
    toggleTransport (transportId, state) {
      console.log('[toggleTransport] got transport: ' + transportId)
      console.log(state.target.checked)
      if (state.target.checked !== undefined) {
        console.log('[toggleTransport] transport enabled: ' + state.target.checked)
        this.$socket.client.emit('updateTransport',
          {
            'TransportId': transportId,
            'Enabled': state.target.checked
          })
      }
    },
    hideTransport (id) {
      console.log('deleting payload id: ' + id)
      this.$socket.client.emit('hideTransport', { TransportId: id })
    },
    closeNewTransportApiKeyWindow () {
      this.clearNewTransportApiKeyValues()
    },
    onSort (field, order) {
      this.sortField = field
      this.sortOrder = order
      this.getTransports()
    },
    initSort () {
      this.$refs.table.initSort()
      console.log('[TransportList:initSort] - Table sorted.')
    }
  },
  wactch: {
    newTransportId () {
      if (this.newTransportId != null) {
        this.isNewTransportApiModalActive = true
      }
    }
  },
  beforeMount () {
    this.getTransports()
  },
  mounted () {
    setTimeout(this.initSort(), 1)
  }
}
</script>
