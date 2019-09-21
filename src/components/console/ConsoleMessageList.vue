<template>
  <section>
    <app-console-message ref="messageList"
      v-for="(message, index) in messages"
      :message="message"
      :index="index"
      :key="message.Issued"
      :display="message.Display"
      :username="message.Username"
      :recieved="message.Received"
      :type="message.Type"
      :taskId="message.AgentTaskId"
    ></app-console-message>
  </section>
</template>

<script>
import consolemessage from './ConsoleMessage'
export default {
  props: ['messages'],
  components: {
    appConsoleMessage: consolemessage
  }
}
</script>

<style>

</style>
