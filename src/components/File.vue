<template>
  <section>
    <div class="faction-container">
      <div class=columns>
        <div class="column is-two-thirds">
          <h1 class="title">Files</h1>
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
            Files here have either been uploaded through the Faction console, or uploaded from an agent.
          </p>
          <p>
            You can reference a file in an agent command with <code>f2:files/[filename]</code>. When you do this, Faction will
            replace that string with a base64 encoded byte array of the file before sending it to the agent. Commands that
            expect an uploaded file as a parameter (for example, <code>download</code>) handle this byte array automatically.
          </p>
        </div>
      </b-message>
      <p>
        <b-table
          :data='filteredFiles'
          hoverable
          >
          <template slot-scope="props">
            <b-table-column field='Id' label='ID' width='40' numeric sortable>
              {{ props.row.Id }}
            </b-table-column>

            <b-table-column field="Name" label="Name" sortable>
              {{ props.row.Name }}
            </b-table-column>

            <b-table-column field="Username" label="Username" sortable>
              {{ props.row.Username }}
            </b-table-column>

            <b-table-column field="AgentName" label="Agent" sortable>
              {{ props.row.AgentName }}
            </b-table-column>

            <b-table-column field="Created" label="Created" sortable>
              {{ props.row.Created }}
            </b-table-column>

            <b-table-column field='Download' label='Download'>
              <a :href="apiEndpoint + '/file/' + props.row.Name + '/download/'">
                <button class="button is-information">
                  <b-icon icon="download"></b-icon>
                </button>
              </a>
            </b-table-column>
          </template>
        </b-table>
      </p>
      <input type="file" id="files" ref="files" multiple v-on:change="handleFileUploads()" style="display:none"/>
      <button class="button is-primary" v-on:click="$refs.files.click()">Upload Files</button>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      error: false,
      message: null,
      processing: false,
      apiEndpoint: process.env.VUE_APP_API_ENDPOINT,
      isHelpActive: false,
      isInitial: true,
      isSaving: false,
      query: null,
      fileUploads: []
    }
  },
  computed: {
    ...mapState({
      files: state => state.files.list,
      userId: state => state.faction.userId,
      accessKeyId: state => state.faction.accessKeyId,
      accessSecret: state => state.faction.accessSecret
    }),
    filteredFiles (text) {
      if (this.query) {
        return this.findFiles(this.query)
      } else {
        return this.files
      }
    }
  },
  methods: {
    getFiles () {
      this.loading = true
      console.log('[File.vue] sending getFile')
      this.$socket.client.emit('getFile', { Filename: 'all' })
      this.loading = false
    },
    findFiles (query) {
      return this.files.filter(function (file) {
        for (var property in file) {
          if (!['Created', 'LastDownload'].includes(property)) {
            if (String(file[property]).toLowerCase().includes(query.toLowerCase())) {
              return file
            }
          }
        }
      })
    },
    handleFileUploads () {
      this.fileUploads = this.$refs.files.files
    },
    submitFiles () {
      let formData = new FormData()
      for (var i = 0; i < this.fileUploads.length; i++) {
        let file = this.fileUploads[i]
        formData.append('files', file)
      }
      axios.defaults.withCredentials = true
      axios.post((process.env.VUE_APP_API_ENDPOINT + '/file/?token=' + this.accessKeyId + ':' + this.accessSecret),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      ).then(function (response) {
        console.log(response)
        if (!response.data.Success) {
          this.error = true
          this.message = response.data.Message
        } else {
          this.availableAgentTypes = response.data.Results
        }
        this.proccessing = false
      }.bind(this))
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
    fileUploads () {
      this.submitFiles()
    }
  },
  beforeMount () {
    this.getFiles()
  }
}
</script>
