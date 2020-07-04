<template>
  <div class="login-container has-background-light login-page level">
    <div class="level-item">
      <div class="login-box">
        <figure class="logo image is-128x128">
          <img class="is-rounded" src="../assets/faction-white-orange-fist-outline.png">
        </figure>
        <b-loading :is-full-page=true :active.sync="loginRunning"></b-loading>
        <div class="login-warning notification is-danger is-radiusless" v-if="loginRunning">
          <p>
            There's a bug in Faction that may cause your first login to take over a minute.
            <a href="https://github.com/FactionC2/Faction/issues/10" target="_blank">
              We're working to identify and fix it.
            </a>
          </p>
        </div>
        <div>
          <p class="title is-2 has-text-centered padding-10">Welcome to Faction</p>
          <b-notification type="is-danger" has-icon :active.sync="error">
            {{ errorMessage }}
          </b-notification>
          <form>
            <div class="field">
              <div class="control">
                <input type="text" class="input is-medium" autofocus="" placeholder="Username" v-model="username">
              </div>
            </div>
            <div class="field">
              <div class="control">
                <input @keyup.enter="submitLogin" type="password" class="input is-medium" placeholder="Password" v-model="password">
              </div>
            </div>
            <a class="button is-medium is-primary is-fullwidth" @click="submitLogin">Login</a>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import axios from 'axios'
console.log('[Login.vue] Endpoint: ' + process.env.VUE_APP_API_ENDPOINT)
export default {
  data () {
    return {
      username: null,
      password: null,
      error: false,
      errorMessage: null,
      loginRunning: true
    }
  },
  computed: {
    ...mapState({
      userId: state => state.faction.userId,
      userRole: state => state.faction.userRole,
      accessKeyId: state => state.faction.accessKeyId,
      accessSecret: state => state.faction.accessSecret,
      connected: state => state.faction.connected,
      connectionStatus: state => state.faction.connectionStatus
    })
  },
  mounted () {
    this.updateApiCookie()
  },
  methods: {
    ...mapActions([
      'loginUser',
      'clearLoginState'
    ]),
    updateApiCookie () {
      this.username = this.$cookies.get('username')
      const userId = this.$cookies.get('user_id')
      const userRole = this.$cookies.get('user_role')
      const accessKey = this.$cookies.get('access_key')
      console.log('[Login.vue:updateApiCookie] UserId from cookie: ' + userId)
      console.log('[Login.vue:updateApiCookie] UserRole from cookie: ' + userRole)
      console.log('[Login.vue:updateApiCookie] ApiKey from cookie: ' + accessKey)
      if (accessKey != null) {
        console.log('[Login.vue:updateApiCookie] Trying to login')
        this.loginUser({
          username: this.username,
          userId: userId,
          userRole: userRole,
          accessKey: accessKey
        })
      } else {
        this.loginRunning = false
      }
    },
    submitLogin () {
      this.loginRunning = true
      axios.defaults.withCredentials = true
      axios.post(('/api/v1/auth/login/'),
        {
          'Username': this.username,
          'Password': this.password
        }).then(function (response) {
        if (response.data.success) {
          console.log('[Login.vue:submitLogin] Trying to login..')
          console.log('[Login.vue:submitLogin] User Id: ' + response.data.user_id)
          console.log('[Login.vue:submitLogin] Username: ' + response.data.username)
          console.log('[Login.vue:submitLogin] User Role: ' + response.data.user_role)
          console.log('[Login.vue:submitLogin] Access Key: ' + response.data.access_key)
          var loginSuccess = this.loginUser({
            username: response.data.username,
            userId: response.data.user_id,
            userRole: response.data.user_role,
            accessKey: response.data.access_key
          })
          if (!loginSuccess) {
            this.error = true
            this.errorMessage = 'Error connecting to API'
            this.loginRunning = false
          }
        } else {
          this.error = true
          this.errorMessage = response.data.Message
          this.loginRunning = false
        }
      }.bind(this)
      )
    },
    redirect () {
      console.log('[Login.vue:Redirect] running..')
      if (this.$route.query.next) {
        console.log('[Login.vue:Redirect] Next is specified as ' + this.$route.query.next)
        this.$router.push(this.$route.query.next)
      } else {
        console.log('[Login.vue:Redirect] Next is not specified. Going home')
        this.$router.push('/')
      }
    }
  },
  watch: {
    connectionStatus () {
      if (this.connectionStatus.includes('Connected')) {
        console.log('[Login.vue:connectionStatus] - Connected. Setting cookies and redirecting')
        this.$cookies.set('Username', this.username, '30d')
        this.$cookies.set('UserId', this.userId, '30d')
        this.$cookies.set('UserRole', this.userRole, '30d')
        this.$cookies.set('AccessKeyId', this.accessKeyId, '30d')
        this.$cookies.set('AccessSecret', this.accessSecret, '30d')
        this.redirect()
      } else if (this.connectionStatus.includes('Error')) {
        console.log('[Login.vue:connectionStatus] - Connection in error state. Clearing cookies and token.')
        this.loginRunning = false
        this.error = true
        this.errorMessage = 'SocketIO connection failed.'
        this.$cookies.remove('Username')
        this.$cookies.remove('UserId')
        this.$cookies.remove('UserRole')
        this.$cookies.remove('AccessKeyId')
        this.$cookies.remove('AccessSecret')
        this.clearLoginState()
      }
    }
  }
}
</script>

<style>
.padding-10 {
  padding-bottom: 10px;
}

.logo {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 10px;
}

.login-container {
  margin-top: -3.25rem;
  width: 100%;
  height: 100vh;
}

.login-box {
  width: 30%;
  max-width: 380px;
}

.login-warning {
  position: fixed;
  top: 30px;
  left: 0;
  right: 0;
  text-align: center;
  z-index: 1000;
}
</style>
