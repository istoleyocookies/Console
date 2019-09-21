<template>
  <section class="message">
    <div  v-if="type === 'AgentTask'">
      <p>[{{ moment.utc(recieved).local().format('LTS').toString() }}] [{{ username }}]</p>
      <p class="message-text">F2> {{ display }}</p>
    </div>
    <div v-else>
      <p v-if="type === 'HelpResponse' || type === 'ShowMessage'"
        class="response-details">[{{ moment.utc(recieved).local().format('LTS').toString() }}] [{{ username }}]
      </p>
      <p v-else class="response-details">[{{ moment.utc(recieved).local().format('LTS').toString() }}] [{{ username }}] [#{{ taskId }}]</p>
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
    'display',
    'username',
    'recieved',
    'type',
    'taskId'
  ],
  data () {
    return {
      isJson: false,
      columnNames: [],
      tableData: null
    }
  },
  methods: {
    checkJson () {
      try {
        var jsonContent = JSON.parse(this.display)
        console.log('Content is json')
        console.log(jsonContent[0])
        var keys = Object.keys(jsonContent[0])
        console.log(keys)
        for (var key in keys) {
          console.log(keys[key])
          this.columnNames.push({
            field: keys[key],
            label: keys[key],
            sortable: true
          })
        }
        this.tableData = jsonContent
        this.isJson = true
      } catch (err) {
        console.log('Content is not json')
        this.isJson = false
      }
    }
  },
  created () {
    console.log('checking if content is json')
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
