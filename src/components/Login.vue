<template>
  <div class="login-container has-background-light login-page level">
    <div class="level-item">
      <div class="login-box">
        <figure class="logo image is-128x128">
          <img class="is-rounded" src="../assets/faction-white-orange-fist-outline.png">
        </figure>
        <b-loading :is-full-page=true :active.sync="loginRunning"></b-loading>
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
console.log('Endpoint: ' + process.env.API_ENDPOINT)
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
      this.username = this.$cookies.get('Username')
      var userid = this.$cookies.get('UserId')
      var userrole = this.$cookies.get('UserRole')
      var keyid = this.$cookies.get('AccessKeyId')
      var secret = this.$cookies.get('AccessSecret')
      console.log('[Login:updateApiCookie] UserId from cookie: ' + userid)
      console.log('[Login:updateApiCookie] UserRole from cookie: ' + userrole)
      console.log('[Login:updateApiCookie] KeyId from cookie: ' + keyid)
      console.log('[Login:updateApiCookie] Secret from cookie: ' + secret)
      if (keyid != null && secret != null) {
        console.log('[Login:updateApiCookie] Trying to login')
        this.loginUser({
          username: this.username,
          userId: userid,
          userRole: userrole,
          keyId: keyid,
          secret: secret
        })
      } else {
        this.loginRunning = false
      }
    },
    submitLogin () {
      this.loginRunning = true
      axios.defaults.withCredentials = true
      axios.post((process.env.API_ENDPOINT + '/login/'),
        {
          'Username': this.username,
          'Password': this.password
        }).then(function (response) {
        console.log(response)
        if (response.data.Success) {
          console.log('[Login:submitLogin] Trying to login..')
          console.log('[Login:submitLogin] UserId: ' + response.data.UserId)
          console.log('[Login:submitLogin] Username: ' + response.data.Username)
          console.log('[Login:submitLogin] UserRole: ' + response.data.UserRole)
          console.log('[Login:submitLogin] AccessKeyId: ' + response.data.AccessKeyId)
          console.log('[Login:submitLogin] AccessSecret: ' + response.data.AccessSecret)
          var loginSuccess = this.loginUser({
            username: response.data.Username,
            userId: response.data.UserId,
            userRole: response.data.UserRole,
            keyId: response.data.AccessKeyId,
            secret: response.data.AccessSecret
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
      console.log('[Login:Redirect] Params: ')
      console.log(this.$route.query)
      if (this.$route.query.next) {
        console.log('[Login:Redirect] Next is specified as ' + this.$route.query.next)
        this.$router.push(this.$route.query.next)
      } else {
        console.log('[Login:Redirect] Next is not specified. Going home')
        this.$router.push('/')
      }
    }
  },
  watch: {
    connectionStatus () {
      if (this.connectionStatus.includes('Connected')) {
        console.log('[Login:connectionStatus] - Connected. Setting cookies and redirecting')
        this.$cookies.set('Username', this.username, '30d')
        this.$cookies.set('UserId', this.userId, '30d')
        this.$cookies.set('UserRole', this.userRole, '30d')
        this.$cookies.set('AccessKeyId', this.accessKeyId, '30d')
        this.$cookies.set('AccessSecret', this.accessSecret, '30d')
        this.redirect()
      } else if (this.connectionStatus.includes('Error')) {
        console.log('[Login:connectionStatus] - Connection in error state. Clearing cookies and token.')
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
</style>
