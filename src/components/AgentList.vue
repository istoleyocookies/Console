<template>
  <aside class="menu agent-list is-paddingless">
    <div class="agent-search">
      <b-input v-model="query" rounded icon="filter" placeholder="Filter agents.."></b-input>
    </div>
    <ul class="menu-list">
    <app-agent
      v-for="(agent, index) in filteredAgents"
      :agent="agent"
      :index="index"
      :key="agent.Id"
    ></app-agent>
    </ul>
  </aside>
</template>

<script>
import agent from './Agent'
export default {
  props: ['agents'],
  data () {
    return {
      query: null
    }
  },
  components: {
    appAgent: agent
  },
  computed: {
    filteredAgents (text) {
      if (this.query) {
        return this.findAgents(this.query)
      } else {
        return this.agents
      }
    }
  },
  methods: {
    findAgents (query) {
      return this.agents.filter(function (agent) {
        for (var property in agent) {
          if (!['InitialCheckin', 'LastCheckin', 'Success', 'Admin'].includes(property)) {
            if (String(agent[property]).toLowerCase().includes(query.toLowerCase())) {
              return agent
            }
            if ((query.toLowerCase() === 'admin') && (agent.Admin === true)) {
              return agent
            }
          }
        }
      })
    }
  }
}
</script>

<style scoped>
  .agent-list {
    position: fixed;
    top: 55px;
    left: 0;
    right: 80%;
    bottom: 0;
    overflow-y: auto;
    background: #ffffff;
  }
  .agent-search, ul > li {
    border-bottom: solid;
    border-width: 1px;
    border-color: #efefef;
  }

  .agent-search {
    height: 60px;
    padding: 11px 10px 20px 20px;
  }

@media only screen and (min-width: 1024px) and (max-width: 1407px) {
  .agent-list {
    right: 70%;
  }
}

@media only screen and (min-width: 1408px) and (max-width: 1524px) {
  .agent-list {
    right: 75%;
  }
}

</style>
