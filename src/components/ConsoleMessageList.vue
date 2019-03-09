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
  // watch: {
  //   'messages': {
  //     immediate: true,
  //     handler () {
  //       console.log('Message list updated')
  //       var messageList = this.$refs.messageList
  //       if (typeof messageList !== 'undefined') {
  //         messageList.scrollTop = messageList.scrollHeight
  //       }
  //       console.log('Scroolled')
  //     }
  //   }
  // }
}
</script>

<style>

</style>
