<template>
  <section>
    <div v-if="currentIoc" class="error-message content">
      <p>
        <strong>Timestamp:</strong> {{ currentIoc.Timestamp }}
      </p>
      <p>
        <strong>Username:</strong> {{ currentIoc.Username }}
      </p>
      <p>
        <strong>Agent Name:</strong> {{ currentIoc.Agent.Name }}
      </p>
      <p>
        <strong>Console Command:</strong> {{ currentIoc.ConsoleMessage.Display }}
      </p>
      <p>
        <strong>IOC Type:</strong> {{ currentIoc.Type }}
      </p>
      <p>
        <strong>Action:</strong> {{ currentIoc.Action }}
      </p>
      <p>
        <strong>Identifier:</strong> {{ currentIoc.Identifier }}
      </p>
      <p v-if="currentIoc.Hash">
        <strong>Hash:</strong> {{ currentIoc.Hash }}
      </p>
      <p>
        <strong>Description:</strong> {{ currentIoc.Description }}
      </p>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'Ioc',
  computed: {
    ...mapState({
      iocs: state => state.iocs.list,
      currentIoc: state => state.iocs.currentIoc,
      updated: state => state.iocs.updated
    })
  },
  created () {
    console.log('page created: ' + this.$route.params.IocId)
    console.log('running getIoc')
    this.updateCurrentIoc(this.$route.params.IocId)
    if (this.currentIoc == null) {
      this.getIoc(this.$route.params.IocId)
    }
  },
  methods: {
    ...mapActions([
      'updateCurrentIoc'
    ]),
    getIoc (iocId) {
      console.log('Get Ioc fired with id of ' + iocId)
      this.$socket.client.emit('getIoc', { IocId: iocId })
    }
  },
  watch: {
    $route () {
      console.log('route update route id: ' + this.$route.params.IocId)
      this.getIoc(this.$route.params.IocId)
    },
    iocs () {
      this.updateCurrentIoc(this.$route.params.IocId)
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
}
</style>
