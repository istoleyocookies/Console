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
              {{ props.row.Id }}
            </b-table-column>

            <b-table-column field="Name" label="Name" sortable>
              {{ props.row.Name }}
            </b-table-column>

            <b-table-column field="AgentType.Name" label="Type" sortable>
              {{ props.row.AgentType.Name }}
            </b-table-column>

            <b-table-column field="Transport.Name" label="Transport" sortable>
              {{ props.row.Transport.Name }}
            </b-table-column>

            <b-table-column field="OperatingSystem.Name" label="OS" sortable>
              {{ props.row.OperatingSystem.Name }}
            </b-table-column>

            <b-table-column field="Architecture.Name" label="Arch" sortable>
              {{ props.row.Architecture.Name }}
            </b-table-column>

            <b-table-column field="Configuration.Name" label="Configuration" sortable>
              {{ props.row.Configuration.Name }}
            </b-table-column>

            <b-table-column field="Format.Name" label="Format" sortable>
              {{ props.row.Format.Name }}
            </b-table-column>

            <b-table-column field="BeaconInterval" label="Beacon Interval" sortable>
              {{ props.row.BeaconInterval }}
            </b-table-column>

            <b-table-column field="Jitter" label="Jitter" sortable>
              {{ props.row.Jitter }}
            </b-table-column>

            <b-table-column field="ExpirationDate" label="Expiration Date" sortable>
              {{ props.row.ExpirationDate | formatDateTime }}
            </b-table-column>

            <b-table-column field='Enabled' label='Enabled' sortable>
                <b-checkbox v-model="props.row.Enabled" @click.native="togglePayload(props.row.Id, $event)"></b-checkbox>
            </b-table-column>

            <b-table-column field='Hide' label='Hide' centered>
              <button class="button is-danger is-small is-rounded" @click="hidePayload(props.row.Id)">
                <b-icon icon="delete" size="is-small"></b-icon>
              </button>
            </b-table-column>

            <b-table-column field='Download' label='Download'>
              <!-- We thrown the name on the end of this link to bust caching -->
              <a :href="apiEndpoint + '/payload/' + props.row.Id + '/file/' + '?' + props.row.Name">
                <button :disabled="!props.row.Built" class="button is-information">
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
                      v-for="agentType in availableAgentTypes"
                      :value="agentType"
                      :key="agentType.Id">
                      {{ agentType.Name }}
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
                        v-for="architecture in newPayloadAgentType.Architectures"
                        :value="architecture"
                        :key="architecture.Id">
                        {{ architecture.Name }}
                      </option>
                    </b-select>
                  </b-field>
                  <b-field label="Version">
                    <b-select placeholder="Select an Version" v-model="newPayloadVersion">
                      <option
                        v-for="version in newPayloadAgentType.Versions"
                        :value="version"
                        :key="version.Id">
                        {{ version.Name }}
                      </option>
                    </b-select>
                  </b-field>
                  <b-field label="Operating System">
                    <b-select placeholder="Select an Operating System" v-model="newPayloadOperatingSystem">
                      <option
                        v-for="operatingsystem in newPayloadAgentType.OperatingSystems"
                        :value="operatingsystem"
                        :key="operatingsystem.Id">
                        {{ operatingsystem.Name }}
                      </option>
                    </b-select>
                  </b-field>
                  <b-field label="Configuration">
                    <b-select placeholder="Select an Configuration" v-model="newPayloadConfiguration">
                      <option
                        v-for="configuration in newPayloadAgentType.Configurations"
                        :value="configuration"
                        :key="configuration.Id">
                        {{ configuration.Name }}
                      </option>
                    </b-select>
                  </b-field>
                  <b-field label="Format">
                      <b-select placeholder="Select an Payload Format" v-model="newPayloadFormat">
                        <option
                          v-for="format in newPayloadAgentType.Formats"
                          :value="format"
                          :key="format.Id">
                          {{ format.Name }}
                        </option>
                      </b-select>
                  </b-field>
                </div>
                <div class="column">
                  <b-field label="Agent Transport">
                    <b-select placeholder="Select an Agent Transport Type" v-model="newPayloadTransport">
                      <option
                        v-for="transport in newPayloadAgentType.AvailableTransports"
                        :value="transport"
                        :key="transport.Id">
                        {{ transport.Name }}
                      </option>
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
          <footer class="modal-card-foot">
            <button class="button is-primary" @click="clearNewDevPayloadValues">Dismiss</button>
          </footer>
        </div>
      </b-modal>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      error: false,
      message: null,
      processing: false,
      apiEndpoint: process.env.VUE_APP_API_ENDPOINT,
      isNewPayloadModalActive: false,
      availableAgentTypes: [],
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
      query: null
    }
  },
  computed: {
    ...mapState({
      payloads: state => state.payloads.list,
      userId: state => state.faction.userId,
      accessKeyId: state => state.faction.accessKeyId,
      accessSecret: state => state.faction.accessSecret,
      isDevPayloadModalActive: state => state.payloads.isDevPayloadModalActive,
      devPayloadKey: state => state.payloads.devPayloadKey,
      devPayloadJitter: state => state.payloads.devPayloadJitter,
      devPayloadBeaconInterval: state => state.payloads.devPayloadBeaconInterval,
      devPayloadExpirationDate: state => state.payloads.devPayloadExpirationDate
    }),
    payloadsList () {
      if (this.showHidden) {
        return this.payloads
      } else {
        return this.payloads.filter(function (payload) {
          if (payload.Visible) {
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
    ...mapActions([
      'clearNewDevPayloadValues'
    ]),
    getPayloads () {
      this.loading = true
      console.log('[Payloads.vue] sending getPayloads')
      this.$socket.client.emit('getPayload', { PayloadId: 'all' })
      this.loading = false
    },
    findPayloads (query) {
      return this.payloadsList.filter(function (payload) {
        for (var property in payload) {
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
        newPayloadFormatId = this.newPayloadFormat.Id
      }

      let newPayloadTransportId = 0
      let newPayloadAgentTransportId = 0
      if (this.newPayloadTransport) {
        newPayloadTransportId = this.newPayloadTransport.Id
        newPayloadAgentTransportId = this.newPayloadTransport.AgentTransportId
      }

      let newPayloadOperatingSystemId = 0
      if (this.newPayloadOperatingSystem) {
        newPayloadOperatingSystemId = this.newPayloadOperatingSystem.Id
      }

      let newPayloadArchitectureId = 0
      if (this.newPayloadArchitecture) {
        newPayloadArchitectureId = this.newPayloadArchitecture.Id
      }

      let newPayloadVersionId = 0
      if (this.newPayloadVersion) {
        newPayloadVersionId = this.newPayloadVersion.Id
      }

      let newPayloadConfigurationId = 0
      if (this.newPayloadConfiguration) {
        newPayloadConfigurationId = this.newPayloadConfiguration.Id
      }

      this.$socket.client.emit('newPayload',
        {
          'Description': this.newPayloadDescription,
          'AgentType': this.newPayloadAgentType.Id,
          'FormatId': newPayloadFormatId,
          'TransportId': newPayloadTransportId,
          'AgentTransportId': newPayloadAgentTransportId,
          'OperatingSystemId': newPayloadOperatingSystemId,
          'ArchitectureId': newPayloadArchitectureId,
          'VersionId': newPayloadVersionId,
          'AgentTypeConfigurationId': newPayloadConfigurationId,
          'BeaconInterval': parseInt(this.newPayloadBeaconInterval),
          'Jitter': parseFloat(this.newPayloadJitter),
          'ExpirationDate': expirationDate,
          'Debug': this.newPayloadDebug
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
    hidePayload (id) {
      console.log('[Payloads.vue] hidePayload firing with payload id: ' + id)
      this.$socket.client.emit('hidePayload', { PayloadId: id })
    },
    getAgentTypes () {
      axios.defaults.withCredentials = true
      axios.get((process.env.VUE_APP_API_ENDPOINT + '/agent/type/?token=' + this.accessKeyId + ':' + this.accessSecret)
      ).then(function (response) {
        if (!response.data.Success) {
          this.error = true
          this.message = response.data.Message
        } else {
          this.availableAgentTypes = response.data.Results
        }
        this.proccessing = false
      }.bind(this))
    },
    openNewPayloadModal () {
      this.getAgentTypes()
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
      if (this.newPayloadAgentType != null) {
        this.newPayloadFormat = this.newPayloadAgentType.Formats[0]
        this.newPayloadTransport = this.newPayloadAgentType.AvailableTransports[0]
        this.newPayloadOperatingSystem = this.newPayloadAgentType.OperatingSystems[0]
        this.newPayloadArchitecture = this.newPayloadAgentType.Architectures[0]
        this.newPayloadVersion = this.newPayloadAgentType.Versions[0]
        this.newPayloadConfiguration = this.newPayloadAgentType.Configurations[0]
        this.newPayloadBeaconInterval = 5
        this.newPayloadJitter = 0
      }
    }
  },
  beforeMount () {
    this.getPayloads()
  }
}
</script>
