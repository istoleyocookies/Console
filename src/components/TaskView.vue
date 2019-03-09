<template>
  <section>
    <div class="task-background"></div>
    <div class="columns">
      <div class="column task-view">
        <app-console-message-list :messages="messages"></app-console-message-list>
      </div>
    </div>
  </section>
</template>

<script>
import consoleMessageList from './ConsoleMessageList'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TaskView',
  data () {
    return {
      content: null,
      query: null
    }
  },
  components: {
    appConsoleMessageList: consoleMessageList
  },
  computed: {
    ...mapState({
      messages: state => state.consoleMessages.list
    })
  },
  created () {
    console.log('page created: ' + this.$route.params.TaskId)
    this.getMessagesForTask(this.$route.params.TaskId)
  },
  beforeRouteLeave (to, from, next) {
    console.log('leaving route, clearing stuff')
    this.clearMessages()
    next()
  },
  methods: {
    ...mapActions([
      'clearMessages'
    ]),
    getMessagesForTask (taskId) {
      this.$socket.emit('getTaskMessage', { TaskId: taskId })
    }
  },
  watch: {
    $route () {
      console.log('route update route id: ' + this.$route.params.TaskId)
      this.getMessagesForTask(this.$route.params.TaskId)
      this.clearMessages()
    }
  }
}
</script>

<style scoped>
.task-background {
  background: #012121;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: -1337;
}
.task-view {
  padding: 20px 20px 20px 20px;
  font-family: "Source Code Pro", "Lucida Console", Monaco, monospace;
}
</style>
