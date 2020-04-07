<template>
  <section class="message">
    <div  v-if="type === 'AgentTask'">
      <p>{{ taskId }}[{{ moment.utc(received).local().format('LTS').toString() }}] [{{ username }}]</p>
      <p class="message-text">F2> {{ display }}</p>
    </div>
    <div v-else>
      <p v-if="type === 'HelpResponse' || type === 'ShowMessage'"
        class="response-details">[{{ moment.utc(received).local().format('LTS').toString() }}] [{{ username }}]
      </p>
      <p v-else class="response-details">{{ taskId }}[{{ moment.utc(received).local().format('LTS').toString() }}] [{{ username }}]</p>
      <b-table
        v-if="tableData"
        :data="tableData"
        :columns="columnNames"
        narrowed
        :row-class="(row, index) => 'response-row'"
        class="response-table">
      </b-table>
      <p v-else class="response-text content">{{ display }}</p>
    </div>
  </section>
</template>

<script>
export default {
  props: [
    'message'
  ],
  data () {
    return {
      received: this.message.Received,
      display: this.message.Display,
      type: this.message.Type,
      isJson: false,
      columnNames: [],
      tableData: null
    }
  },
  computed: {
    username () {
      if (this.message.User) {
        return this.message.User.Username
      } else if (this.message.Agent) {
        return this.message.Agent.Name
      } else {
        return ''
      }
    },
    taskId () {
      if (this.message.AgentTaskId) {
        return '[#' + this.message.AgentTaskId + '] '
      } else {
        return ''
      }
    }
  },
  methods: {
    checkJson () {
      try {
        var jsonContent = JSON.parse(this.display)
        // console.log('[ConsoleMessage.vue] Content is json')
        var keys = Object.keys(jsonContent[0])
        for (var key in keys) {
          this.columnNames.push({
            field: keys[key],
            label: keys[key],
            sortable: true
          })
        }
        this.tableData = jsonContent
        this.isJson = true
      } catch (err) {
        // console.log('[ConsoleMessage.vue] Content is not json')
        this.isJson = false
      }
    }
  },
  created () {
    this.checkJson()
  }
}
</script>

<style>
  .message {
    font-family: 'Source Code Pro', 'Courier New', Courier, monospace;
    color: #ebeb00;
    background: #012121;
    margin-bottom: 12px !important;
  }

  .response-row {
    color: #aaaaaa;
    background: #012121;
  }

  .response-table .table-wrapper .table {
    background-color: #012121;
  }

  .response-table .table-wrapper .table th {
    color: #aaaaaa;
    border-bottom-color: #333333;
  }

  .response-row td {
    word-wrap: break-word;
    border-bottom-color: #333333;
  }

  .message-text {
    color: #f2f2f2;
  }

  .response-details {
    color: #FE7031;
  }

  .response-text {
    color: #aaaaaa;
  }

  .content {
    white-space: pre-wrap;
  }
</style>
