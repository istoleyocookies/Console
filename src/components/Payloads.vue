<template>
  <section>
    <div class="faction-container">
      <div class=columns>
        <div class="column is-two-thirds">
          <h1 class="title">Payloads</h1>
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
      <b-message class="help-message" type="is-info" title="Help" :active.sync="isHelpActive">
        <div class="content">
          <p>
            Payloads are run on targets and establish an agent. When an payload first establishes a connection
            to Faction, it provides details about the host system and in turn gets an agent id and password. The
            agent inherits the settings (beacon interval, jitter, expiration date) that are associated with the
            payload it spawn from.
          </p>
          <p>
            Optionally, you can set an expiration date on payload. Once this date passes, the payload will no longer be able to spawn new Faction
            agents. You can also disable a payload, once disabled no agents will be able to spawn from this payload.
          </p>
        </div>
      </b-message>
      <p>
        <b-table
          :data='filteredPayloads'
          hoverable
        >
          <template slot-scope="props">
            <b-table-column field='Id' label='ID' width='40' numeric sortable>
              {{ props.row.id }}
            </b-table-column>

            <b-table-column field="Name" label="Name" sortable>
              {{ props.row.name }}
            </b-table-column>

            <b-table-column field="AgentType.name" label="Type" sortable>
              {{ props.row.agent_type.name }}
            </b-table-column>

            <b-table-column field="Transport.name" label="Transport" sortable>
              {{ props.row.transport.name }}
            </b-table-column>

            <b-table-column field="operating_system.name" label="OS" sortable>
              {{ props.row.operating_system.name }}
            </b-table-column>

            <b-table-column field="Architecture.name" label="Arch" sortable>
              {{ props.row.architecture.name }}
            </b-table-column>

            <b-table-column field="Configuration.name" label="Configuration" sortable>
              {{ props.row.configuration.name }}
            </b-table-column>

            <b-table-column field="Format.name" label="Format" sortable>
              {{ props.row.format.name }}
            </b-table-column>

            <b-table-column field="BeaconInterval" label="Beacon Interval" sortable>
              {{ props.row.beacon_interval }}
            </b-table-column>

            <b-table-column field="Jitter" label="Jitter" sortable>
              {{ props.row.jitter }}
            </b-table-column>

            <b-table-column field="ExpirationDate" label="Expiration Date" sortable>
              {{ props.row.expiration_date | formatDateTime }}
            </b-table-column>

            <b-table-column field='Enabled' label='Enabled' sortable>
              <b-checkbox v-model="props.row.enabled" @click.native="togglePayload(props.row.id, $event)"></b-checkbox>
            </b-table-column>

            <b-table-column field='Hide' label='Hide' centered>
              <button class="button is-danger is-small is-rounded" @click="hidePayload(props.row.id)">
                <b-icon icon="delete" size="is-small"></b-icon>
              </button>
            </b-table-column>

            <b-table-column field='Download' label='Download'>
              <!-- We thrown the name on the end of this link to bust caching -->
              <a :href="apiEndpoint + '/payload/' + props.row.id + '/file/' + '?' + props.row.name">
                <button :disabled="!props.row.built" class="button is-information">
                  <b-icon icon="download"></b-icon>
                </button>
              </a>
            </b-table-column>
          </template>
        </b-table>
      </p>
      <div class="content content-container">
        <p>
          <button @click="openNewPayloadModal" class="button is-primary">New Payload</button>
        </p>
      </div>
      <b-modal :active.sync="isNewPayloadModalActive" scroll="keep">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">New Payload</p>
          </header>
          <section class="modal-card-body">
            <b-field label="Agent Type">
              <b-select placeholder="Select an Agent Type" v-model="newPayloadAgentType">
                <option
                  v-for="agentType in agentTypes"
                  :value="agentType"
                  :key="agentType.id">
                  {{ agentType.name }}
                </option>
              </b-select>
            </b-field>

            <b-field label="Description" >
              <b-input placeholder="Description" v-model="newPayloadDescription">
              </b-input>
            </b-field>
            <div class="columns" v-if="newPayloadAgentType">
              <div class="column">
                <b-field label="Architecture">
                  <b-select placeholder="Select an Architecture" v-model="newPayloadArchitecture">
                    <option
                      v-for="architecture in newPayloadAgentType.agent_type_architectures"
                      :value="architecture"
                      :key="architecture.id">
                      {{ architecture.name }}
                    </option>
                  </b-select>
                </b-field>
                <b-field label="Version">
                  <b-select placeholder="Select an Version" v-model="newPayloadVersion">
                    <option
                      v-for="version in newPayloadAgentType.agent_type_versions"
                      :value="version"
                      :key="version.id">
                      {{ version.name }}
                    </option>
                  </b-select>
                </b-field>
                <b-field label="Operating System">
                  <b-select placeholder="Select an Operating System" v-model="newPayloadOperatingSystem">
                    <option
                      v-for="operating_system in newPayloadAgentType.agent_type_operating_systems"
                      :value="operating_system"
                      :key="operating_system.id">
                      {{ operating_system.name }}
                    </option>
                  </b-select>
                </b-field>
                <b-field label="Configuration">
                  <b-select placeholder="Select an Configuration" v-model="newPayloadConfiguration">
                    <option
                      v-for="configuration in newPayloadAgentType.agent_type_configurations"
                      :value="configuration"
                      :key="configuration.id">
                      {{ configuration.name }}
                    </option>
                  </b-select>
                </b-field>
                <b-field label="Format">
                  <b-select placeholder="Select an Payload Format" v-model="newPayloadFormat">
                    <option
                      v-for="format in newPayloadAgentType.agent_type_formats"
                      :value="format"
                      :key="format.id">
                      {{ format.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column">
                <b-field label="Agent Transport">
                  <b-select placeholder="Select an Agent Transport Type"
                            v-model="newPayloadTransport">
                    <optgroup
                      v-for="agentTransport in newPayloadAgentType.agent_transport_types"
                      :value="agentTransport"
                      :key="agentTransport.id"
                      :label="agentTransport.name"
                    >
                      <option
                        v-for="transport in agentTransport.available_transports"
                        :value="transport"
                        :key="transport.id">
                        {{ transport.name }}
                      </option>
                    </optgroup>
                  </b-select>
                </b-field>

                <b-field label="Beacon Interval">
                  <b-input
                    v-model="newPayloadBeaconInterval"
                    type="number"
                    min="0"
                    required>
                  </b-input>
                </b-field>

                <b-field label="Jitter">
                  <b-input
                    v-model="newPayloadJitter"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    required>
                  </b-input>
                </b-field>

                <b-field label="Expiration Date">
                  <b-datepicker
                    position="is-top-right"
                    v-model="newPayloadExpirationDate">
                    <button class="button is-danger"
                            @click="newPayloadExpirationDate = null">
                      <b-icon icon="close"></b-icon>
                      <span>Clear</span>
                    </button>
                  </b-datepicker>
                </b-field>
                <b-field label="Debug">
                  <b-switch
                    v-model="newPayloadDebug">
                  </b-switch>
                </b-field>
              </div>
            </div>
          </section>
          <footer class="modal-card-foot">
            <button class="button is-primary" @click="createPayload">Create Payload</button>
          </footer>
        </div>
      </b-modal>
      <b-modal :active.sync="isDevPayloadModalActive" scroll="keep">
        <div class="modal-card" style="width: auto">
          <header class="modal-card-head">
            <p class="modal-card-title">Development Payload Created</p>
          </header>
          <section class="modal-card-body">
            <p>Make a note of this information as there's no easy way to get it back once you close this window.</p>
            <pre class="is-paddingless">
{
  "StagingKey": {{this.devPayloadKey}},
  "BeaconInterval": {{this.devPayloadBeaconInterval}},
  "Jitter": {{this.devPayloadJitter}},
  "ExpirationDate": {{this.devPayloadExpirationDate}}
}
            </pre>
          </section>
          <!--          <footer class="modal-card-foot">-->
          <!--            <button class="button is-primary" @click="clearNewDevPayloadValues">Dismiss</button>-->
          <!--          </footer>-->
        </div>
      </b-modal>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'payloads',
  data () {
    return {
      apiEndpoint: process.env.vUE_APP_API_ENDPOINT,
      payloads: [],
      isDevPayloadModalActive: null,
      devPayloadKey: null,
      devPayloadJitter: null,
      devPayloadBeaconInterval: null,
      devPayloadExpirationDate: null,
      isNewPayloadModalActive: false,
      availableAgentTypes: [],
      newPayloadAgentTransport: null,
      newPayloadAgentType: null,
      newPayloadArchitecture: null,
      newPayloadConfiguration: null,
      newPayloadOperatingSystem: null,
      newPayloadVersion: null,
      newPayloadDescription: null,
      newPayloadFormat: null,
      newPayloadTransport: null,
      newPayloadBeaconInterval: 5,
      newPayloadJitter: 0,
      newPayloadExpirationDate: null,
      newPayloadDebug: false,
      isHelpActive: false,
      query: null,
      error: false,
      message: null,
      processing: false
    }
  },
  computed: {
    ...mapState({
      // payloads: state => state.payloads.list,
      userId: state => state.faction.userId,
      accessKeyId: state => state.faction.accessKeyId,
      accessSecret: state => state.faction.accessSecret
      // isDevPayloadModalActive: state => state.payloads.isDevPayloadModalActive,
      // devPayloadKey: state => state.payloads.devPayloadKey,
      // devPayloadJitter: state => state.payloads.devPayloadJitter,
      // devPayloadBeaconInterval: state => state.payloads.devPayloadBeaconInterval,
      // devPayloadExpirationDate: state => state.payloads.devPayloadExpirationDate
    }),
    payloadsList () {
      if (this.showHidden) {
        return this.payloads
      } else {
        return this.payloads.filter(function (payload) {
          if (payload.visible) {
            return payload
          }
        })
      }
    },
    filteredPayloads (text) {
      if (this.query) {
        return this.findPayloads(this.query)
      } else {
        return this.payloadsList
      }
    },
    utcExpirationDate () {
      return moment(this.newPayloadExpirationDate).utc().toISOString()
    }
  },
  methods: {
    // ...mapActions([
    //   'clearNewDevPayloadValues'
    // ]),
    // getPayloads () {
    //   this.loading = true
    //   console.log('[Payloads.vue] sending getPayloads')
    //   this.$socket.client.emit('getPayload', { PayloadId: 'all' })
    //   this.loading = false
    // },
    findPayloads (query) {
      return this.payloadsList.filter(function (payload) {
        for (const property in payload) {
          if (!['Created', 'Key', 'Name', 'LastDownload'].includes(property)) {
            if (String(payload[property]).toLowerCase().includes(query.toLowerCase())) {
              return payload
            }
          }
        }
      })
    },
    createPayload () {
      this.processing = true
      let expirationDate = null
      if (this.utcExpirationDate != null) {
        expirationDate = this.utcExpirationDate
      }

      let newPayloadFormatId = 0
      if (this.newPayloadFormat) {
        newPayloadFormatId = this.newPayloadFormat.id
      }

      let newPayloadTransportId = 0
      if (this.newPayloadTransport) {
        newPayloadTransportId = this.newPayloadTransport.id
      }

      let newPayloadOperatingSystemId = 0
      if (this.newPayloadOperatingSystem) {
        newPayloadOperatingSystemId = this.newPayloadOperatingSystem.id
      }

      let newPayloadArchitectureId = 0
      if (this.newPayloadArchitecture) {
        newPayloadArchitectureId = this.newPayloadArchitecture.id
      }

      let newPayloadVersionId = 0
      if (this.newPayloadVersion) {
        newPayloadVersionId = this.newPayloadVersion.id
      }

      let newPayloadConfigurationId = 0
      if (this.newPayloadConfiguration) {
        newPayloadConfigurationId = this.newPayloadConfiguration.id
      }

      this.$apollo.mutate({
        mutation: require('../graphql/payload-mutation-create.graphql'),
        variables: {
          'description': this.newPayloadDescription,
          'agentTypeId': this.newPayloadAgentType.id,
          'formatId': newPayloadFormatId,
          'transportId': newPayloadTransportId,
          'operating_systemId': newPayloadOperatingSystemId,
          'architectureId': newPayloadArchitectureId,
          'versionId': newPayloadVersionId,
          'configurationId': newPayloadConfigurationId,
          'beaconInterval': parseInt(this.newPayloadBeaconInterval),
          'jitter': parseFloat(this.newPayloadJitter),
          'expirationDate': expirationDate,
          'debug': this.newPayloadDebug
        },
        update: (cache, { data: { insert_payload } }) => {
          console.log(insert_payload)
        }
      })
      this.proccessing = false
      this.closeNewPayloadWindow()
    },
    togglePayload (payloadId, state) {
      console.log('[Payloads.vue] togglePayload got payload: ' + payloadId)
      if (state.target.checked !== undefined) {
        console.log('[Payloads.vue] togglePayload is payload enabled?: ' + state.target.checked)
        this.$socket.client.emit('updatePayload',
          {
            'Id': payloadId,
            'Enabled': state.target.checked
          })
      }
    },
    // hidePayload (id) {
    //   console.log('[Payloads.vue] hidePayload firing with payload id: ' + id)
    //   this.$socket.client.emit('hidePayload', { PayloadId: id })
    // },
    // getAgentTypes () {
    //   axios.defaults.withCredentials = true
    //   axios.get((process.env.vUE_APP_API_ENDPOINT + '/agent/type/?token=' + this.accessKeyId + ':' + this.accessSecret)
    //   ).then(function (response) {
    //     if (!response.data.success) {
    //       this.error = true
    //       this.message = response.data.message
    //     } else {
    //       this.availableAgentTypes = response.data.results
    //     }
    //     this.proccessing = false
    //   }.bind(this))
    // },
    openNewPayloadModal () {
      this.isNewPayloadModalActive = true
    },
    clearNewPayloadValues () {
      this.newPayloadFormat = null
      this.newPayloadTransport = null
      this.newPayloadOperatingSystem = null
      this.newPayloadArchitecture = null
      this.newPayloadVersion = null
      this.newPayloadConfiguration = null
      this.newPayloadBeaconInterval = 5
      this.newPayloadJitter = 0
    },
    closeNewPayloadWindow () {
      this.clearNewPayloadValues()
      this.isNewPayloadModalActive = false
    }
  },
  watch: {
    message () {
      if (this.message != null) {
        if (this.error) {
          this.$buefy.toast.open({
            duration: 5000,
            message: this.message,
            type: 'is-danger',
            queue: false
          })
        } else {
          this.$buefy.toast.open({
            duration: 5000,
            message: this.message,
            type: 'is-success',
            queue: false
          })
        }
      }
      this.message = null
      this.error = false
    },
    newPayloadAgentType () {
      console.log('NewPayloadAgentType Changed')
      if (this.newPayloadAgentType != null) {
        this.newPayloadFormat = this.newPayloadAgentType.agent_type_formats[0]
        this.newPayloadTransport = this.newPayloadAgentType.agent_transport_types[0].available_transports[0]
        this.newPayloadOperatingSystem = this.newPayloadAgentType.agent_type_operating_systems[0]
        this.newPayloadArchitecture = this.newPayloadAgentType.agent_type_architectures[0]
        this.newPayloadVersion = this.newPayloadAgentType.agent_type_versions[0]
        this.newPayloadConfiguration = this.newPayloadAgentType.agent_type_configurations[0]
        this.newPayloadBeaconInterval = 5
        this.newPayloadJitter = 0
      }
    }
  },
  apollo: {
    agentTypes: {
      query: require('../graphql/agentType-query-all.graphql'),
      update: data => data.agent_types
    },
    $subscribe: {
      payloads: {
        query: require('../graphql/payloads/subscription-allPayloads.graphql'),
        result (data) {
          this.payloads = data.data.payloads
        },
        error (error) {
          this.error = JSON.stringify(error.message)
        }
      }
    }
  }
}
</script>
