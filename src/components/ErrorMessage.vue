<template>
  <section>
    <div v-if="currentErrorMessage" class="error-message content">
      <p>
        <strong>Timestamp:</strong> {{ currentErrorMessage.Timestamp }}
      </p>
      <p>
        <strong>Source:</strong> {{ currentErrorMessage.Source }}
      </p>
      <p>
        <strong>Message:</strong> {{ currentErrorMessage.Message }}
      </p>

      <div v-if="currentErrorMessage.Details" class="details">
        <p>
          <strong>Details</strong>
        </p>
        {{ currentErrorMessage.Details }}
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ErrorMessage',
  computed: {
    ...mapState({
      errorMessages: state => state.errorMessages.list,
      currentErrorMessage: state => state.errorMessages.currentErrorMessage,
      updated: state => state.errorMessages.updated
    })
  },
  created () {
    this.updateCurrentErrorMessage(this.$route.params.ErrorMessageId)
    if (this.currentErrorMessage == null) {
      this.getErrorMessage(this.$route.params.ErrorMessageId)
    }
  },
  methods: {
    ...mapActions([
      'updateCurrentErrorMessage'
    ]),
    getErrorMessage (errorMessageId) {
      console.log('[ErrorMessage.vue] Get Error Message fired with id of ' + errorMessageId)
      this.$socket.client.emit('getErrorMessage', { ErrorMessageId: errorMessageId })
    }
  },
  watch: {
    $route () {
      this.getErrorMessage(this.$route.params.ErrorMessageId)
    },
    errorMessages () {
      this.updateCurrentErrorMessage(this.$route.params.ErrorMessageId)
    }
  }
}
</script>

<style>
.error-message {
  padding: 20px;
  max-width: 1024px;
  margin: 0 auto;
}

.details {
  white-space: pre-line;
  display: block;
  font-family: mono;
  background-color: #eeeeee;
  padding: 10px;
  word-break: break-all;
}
</style>
