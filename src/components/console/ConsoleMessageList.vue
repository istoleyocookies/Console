<template>
  <section>
    <app-console-message ref="messageList"
      v-for="(message, index) in messages"
      :message="message"
      :index="index"
      :key="message.Received"
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
