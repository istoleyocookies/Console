<template>
  <section class="section">
    <div class="container">
      <div class="content content-container">
        <div class="settings-item">
          <p class="title is-3">Password</p>
          <div class="password-change-container">
            <b-field label="Current Password">
              <b-input v-model="currentPassword" type="password" password-reveal></b-input>
            </b-field>
            <b-field label="New Password">
              <b-input v-model="newPassword" type="password" password-reveal></b-input>
            </b-field>
            <b-field label="Confirm Password">
              <b-input v-model="confirmPassword" type="password" password-reveal></b-input>
            </b-field>
            <button class="button is-primary" @click="changePassword">Submit</button>
          </div>
        </div>
        <div class="settings-item">
          <p class="title is-3">API Keys</p>
          <p>
            Your API keys are below. Revoking a key will invalidate it. Note that your
            <strong>SessionToken</strong>
            is what you're currently logged into Faction with. If you delete that weird stuff might happen. A new
            SessionToken is created whenever you login to Faction with your username and password.
          </p>
        </div>
      </div>
      <div>
        <p>
          <b-table :data="apikeys" bordered>
            <template slot-scope="props">
              <b-table-column field="Id" label="ID" width="40" numeric>{{ props.row.Id }}</b-table-column>

              <b-table-column field="Type" label="Type">{{ props.row.Type }}</b-table-column>

              <b-table-column field="Name" label="Name">{{ props.row.Name }}</b-table-column>

              <b-table-column field="Created" label="Created">{{ props.row.Created }}</b-table-column>

              <b-table-column field="LastUsed" label="Last Used">{{ props.row.Created }}</b-table-column>

              <b-table-column field="delete" label="Delete">
                <button class="button is-danger" @click="deleteApiKey(props.row.Id)">
                  <b-icon icon="delete"></b-icon>
                </button>
              </b-table-column>
            </template>
          </b-table>
        </p>
        <div class="content content-container settings-item">
          <button @click="newApiKey" class="button is-primary">New API Key</button>
          <b-modal
            :active.sync="isNewApiKeyModalActive"
            scroll="keep"
            @close="clearNewApiKeyValues"
            :width="960"
          >
            <header class="modal-card-head">
              <p class="modal-card-title">New API Key</p>
            </header>
            <section class="modal-card-body">
              <p>Make note of this secret. Once you close this window, it is gone.</p>
              <pre class="is-paddingless">Name: {{ this.newApiKeyName }}
Secret: {{ this.newApiKeySecret }}
</pre>
            </section>
            <footer class="modal-card-foot">
              <button class="button" @click="closeNewApiKeyWindow()">Close</button>
            </footer>
          </b-modal>
          <!-- Ran out of time on this for release. Removing for now.
              <div class="settings-item">
              <p class="title is-3">Logs</p>
              <p>
                Logs are provided in CSV format.
              </p>
              <p>
                <button class="button is-primary">Activity Log</button>
                <button class="button is-primary">Debug Log</button>
              </p>
          </div>-->
        </div>
      </div>
      <div class="content" v-if="userRole === 'admin'">
        <div class="settings-item content-container">
          <p class="title is-3">Users</p>
          <p>Define the users for faction here.</p>
          <ul>
            <li>Administrator: Has full control over this Faction instance</li>
            <li>Operator: Can do everything in faction except create new users</li>
            <li>ReadOnly: Read only access to Faction</li>
          </ul>
        </div>
        <div>
          <p>
            <b-table :data="users" bordered>
              <template slot-scope="props">
                <b-table-column field="Id" label="ID" width="40" numeric>{{ props.row.Id }}</b-table-column>

                <b-table-column field="Username" label="Username">{{ props.row.Username }}</b-table-column>

                <b-table-column field="Role" label="Role">{{ props.row.Role }}</b-table-column>

                <b-table-column field="Created" label="Created">{{ props.row.Created }}</b-table-column>

                <b-table-column field="LastLogin" label="Last Login">{{ props.row.LastLogin }}</b-table-column>

                <b-table-column field="delete" label="Delete">
                  <button class="button is-danger" @click="deleteUser(props.row.Id)">
                    <b-icon icon="delete"></b-icon>
                  </button>
                </b-table-column>
              </template>
            </b-table>
          </p>
        </div>
        <div class="content content-container">
          <p>
            <button @click="newUserModal" class="button is-primary">New User</button>
          </p>
          <b-modal :active.sync="isNewUserModalActive" scroll="keep">
            <div class="modal-card" style="width: auto">
              <header class="modal-card-head">
                <p class="modal-card-title">New User</p>
              </header>
              <section class="modal-card-body">
                <b-field label="Username">
                  <b-input type="username" v-model="newUserName" required></b-input>
                </b-field>

                <b-field label="Role">
                  <b-select placeholder="Select a Role" v-model="newUserRole">
                    <option
                      v-for="role in availableRoles"
                      :value="role.Name"
                      :key="role.Id"
                    >{{ role.Name }}</option>
                  </b-select>
                </b-field>

                <b-field label="Password">
                  <b-input type="password" v-model="newUserPassword" password-reveal required></b-input>
                </b-field>

                <b-field label="Confirm Password">
                  <b-input
                    type="password"
                    v-model="newUserConfirmPassword"
                    password-reveal
                    required
                  ></b-input>
                </b-field>
              </section>
              <footer class="modal-card-foot">
                <button class="button is-primary" @click="createUser">Create User</button>
              </footer>
            </div>
          </b-modal>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  data () {
    return {
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
      error: false,
      message: null,
      processing: false,
      apikeys: [],
      isNewApiKeyModalActive: false,
      newApiKeyName: null,
      newApiKeySecret: null,
      users: [],
      isNewUserModalActive: false,
      newUserName: null,
      newUserRole: null,
      newUserPassword: null,
      newUserConfirmPassword: null,
      availableRoles: []
    }
  },
  computed: {
    ...mapState({
      userId: state => state.faction.userId,
      userRole: state => state.faction.userRole,
      accessKeyId: state => state.faction.accessKeyId,
      accessSecret: state => state.faction.accessSecret
    })
  },
  methods: {
    changePassword () {
      this.processing = true
      if (this.currentPassword && this.newPassword === this.confirmPassword) {
        axios.defaults.withCredentials = true
        axios
          .post(
            process.env.VUE_APP_API_ENDPOINT + '/user/' + this.userId + '/password/?token=' + this.accessKeyId + ':' + this.accessSecret,
            {
              CurrentPassword: this.currentPassword,
              NewPassword: this.newPassword
            }
          )
          .then(
            function (response) {
              this.currentPassword = this.newPassword = this.confirmPassword = null
              if (!response.data.Success) {
                this.error = true
              }
              this.message = response.data.Message
            }.bind(this)
          )
      } else {
        if (this.currentPassword == null) {
          this.message = 'You have to enter your password first dingus.'
        } else {
          this.message = 'New password and Confirm password do not match.'
        }
        this.error = true
      }
      this.processing = false
    },
    getApiKeys () {
      this.processing = true
      axios.defaults.withCredentials = true
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT + '/user/' + this.userId + '/apikey/?token=' + this.accessKeyId + ':' + this.accessSecret
        )
        .then(
          function (response) {
            if (!response.data.Success) {
              this.error = true
              this.message = response.data.Message
            } else {
              this.apikeys = response.data.Results
            }
          }.bind(this)
        )
      this.proccessing = false
    },
    newApiKey () {
      this.processing = true
      axios.defaults.withCredentials = true
      axios
        .post(
          process.env.VUE_APP_API_ENDPOINT + '/user/' + this.userId + '/apikey/?token=' + this.accessKeyId + ':' + this.accessSecret
        )
        .then(
          function (response) {
            if (!response.data.Success) {
              this.error = true
              this.message = response.data.Message
              this.proccessing = false
            } else {
              this.newApiKeyName = response.data.Name
              this.newApiKeySecret = response.data.Secret
              this.isNewApiKeyModalActive = true
              this.getApiKeys()
            }
          }.bind(this)
        )
      this.processing = false
    },
    deleteApiKey (apiKeyId) {
      axios.defaults.withCredentials = true
      axios
        .delete(
          process.env.VUE_APP_API_ENDPOINT + '/user/' + this.userId + '/apikey/' + apiKeyId + '/?token=' + this.accessKeyId + ':' + this.accessSecret
        )
        .then(
          function (response) {
            if (!response.data.Success) {
              this.error = true
            }
            this.message = response.data.Message
            this.proccessing = false
            this.getApiKeys()
          }.bind(this)
        )
    },
    clearNewApiKeyValues () {
      this.newApiKeyName = null
      this.newApiKeySecret = null
    },
    closeNewApiKeyWindow () {
      this.clearNewApiKeyValues()
      this.isNewApiKeyModalActive = false
    },
    getUsers () {
      axios.defaults.withCredentials = true
      axios.get(process.env.VUE_APP_API_ENDPOINT + '/user/?token=' + this.accessKeyId + ':' + this.accessSecret).then(
        function (response) {
          if (!response.data.Success) {
            this.error = true
            this.message = response.data.Message
          } else {
            this.users = response.data.Results
          }
          this.proccessing = false
        }.bind(this)
      )
    },
    createUser () {
      if (this.newUserPassword === this.newUserConfirmPassword) {
        this.processing = true
        axios.defaults.withCredentials = true
        axios
          .post(process.env.VUE_APP_API_ENDPOINT + '/user/?token=' + this.accessKeyId + ':' + this.accessSecret, {
            Username: this.newUserName,
            RoleName: this.newUserRole,
            Password: this.newUserPassword
          })
          .then(
            function (response) {
              if (!response.data.Success) {
                this.error = true
                this.message = response.data.Message
              } else {
                this.isNewUserModalActive = false
                this.getUsers()
              }
              this.proccessing = false
              this.clearNewUserValues()
            }.bind(this)
          )
      } else {
        this.error = true
        this.message = 'Password and Confirm Password do not match'
      }
      this.processing = false
    },
    deleteUser (userId) {
      axios.defaults.withCredentials = true
      axios
        .delete(process.env.VUE_APP_API_ENDPOINT + '/user/?token=' + this.accessKeyId + ':' + this.accessSecret + userId + '/')
        .then(
          function (response) {
            if (!response.data.Success) {
              this.error = true
            }
            this.message = response.data.Message
            this.proccessing = false
            this.getUsers()
          }.bind(this)
        )
    },
    clearNewUserValues () {
      this.newUserName = null
      this.newUserRole = null
      this.newUserPassword = null
      this.newUserConfirmPassword = null
    },
    closeNewUserWindow () {
      this.clearNewUserValues()
      this.isNewUserModalActive = false
    },
    getUserRoles () {
      axios.defaults.withCredentials = true
      axios.get(process.env.VUE_APP_API_ENDPOINT + '/user/role/?token=' + this.accessKeyId + ':' + this.accessSecret).then(
        function (response) {
          if (!response.data.Success) {
            this.error = true
            this.message = response.data.Message
          } else {
            this.availableRoles = response.data.Results
          }
          this.proccessing = false
        }.bind(this)
      )
    },
    newUserModal () {
      this.getUserRoles()
      this.isNewUserModalActive = true
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
    }
  },
  beforeMount () {
    this.getApiKeys()
    if (this.userRole === 'admin') {
      this.getUsers()
    }
  }
}
</script>

<style scoped>
.content-container {
  max-width: 860px;
  margin: 20px auto;
}
.settings-item {
  padding-bottom: 40px;
}

.password-change-container {
  max-width: 450px;
}
</style>
