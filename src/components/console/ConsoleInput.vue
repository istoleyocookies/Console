<template>
  <div>
    <div class="autocomplete">
      <console-auto-complete :input="content"></console-auto-complete>
    </div>
    <div class="field console-input">
      <div class="control has-icons-left">
        <input type="text" class="input" v-model="content" v-on:keyup.enter="submitMessage" />
        <span class="icon is-left">
                  <i class="mdi mdi-chevron-right mdi-24px"></i>
                </span>
        <a @click="submitMessage" class="button is-dark is-radiusless">Send</a>
      </div>
    </div>
  </div>
</template>

<script>
import consoleAutoComplete from './ConsoleAutoComplete'
export default {
  name: 'consoleInput',
  props: [
    'agent'
  ],
  components: {
    consoleAutoComplete
  },
  data () {
    return {
      content: null
    }
  },
  methods: {
    submitMessage () {
      if (this.content.length > 0) {
        console.log('[ConsoleInput.vue] Submitting Message')
        this.$socket.client.emit('newMessage', {
          AgentId: this.agent.Id,
          Content: this.content
        })
        this.content = ''
      }
    }
  }
}
</script>

<style scoped>

  .console-input {
    border-top: solid;
    border-top-color: #034748;
    border-top-width: 1px;
    position: fixed;
    right: 0;
    left: 25%;
    bottom: 0;
    height: 40px;
  }

  .console-input .control {
    width: 100%;
    height: 40px;
  }

  .console-input .input {
    background: #012121;
    height: 39px;
    color: #eff7f7;
    font-family: "Source Code Pro", "Lucida Console", Monaco, monospace;
    border: none;
    position: fixed;
    right: 0;
    left: 25%;
    bottom: 0;
    border-radius: 0;
  }

  .console-input input:focus {
    box-shadow: 0;
  }

  .console-input .button {
    position: fixed;
    right: 0;
    height: 40px;
  }

</style>
