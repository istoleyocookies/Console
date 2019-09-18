<template>
  <div class="login-container has-background-light level">
    <p>Logggging outtttt</p>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      loginRunning: true
    }
  },
  computed: {
    ...mapState({
      loggedIn: state => state.faction.loggedIn
    })
  },
  mounted () {
    this.logout()
  },
  methods: {
    ...mapActions([
      'clearLoginState'
    ]),
    logout () {
      this.loginRunning = true
      this.$cookies.remove('Username')
      this.$cookies.remove('UserId')
      this.$cookies.remove('UserRole')
      this.$cookies.remove('AccessKeyId')
      this.$cookies.remove('AccessSecret')
      this.$socket.client.emit('logout')
    }
  },
  watch: {
    loggedIn () {
      console.log('loggedIn chanced')
      if (this.loggedIn === false) {
        this.clearLoginState()
        this.$router.push({ name: 'home' })
      }
    }
  }
}
</script>

<style>

</style>
