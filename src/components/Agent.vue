<template>
  <li>
    <router-link class="agent-link" :to="{ name: 'console', params: {AgentId: agent.Id}}">
      <div class="columns is-paddingless is-marginless">
        <div class="column is-paddingless is-marginless">
          <p>
            <span class="has-text-weight-bold">{{ agent.Name }}</span>
          </p>
        </div>
        <div class="column is-paddingless is-marginless">
          <p class="tags has-addons is-pulled-right">
            <span class="tag is-danger" v-if="agent.Admin">Admin</span>
            <span class="tag">
              <i v-bind:class="osIcon" v-bind:title="agent.OperatingSystem"></i>
            </span>
          </p>
        </div>
      </div>
      <div class="columns is-paddingless is-marginless">
        <div class="column is-paddingless is-marginless">
          <p>
            {{ agent.Username }}@{{ agent.Hostname }}
          </p>
          <span class="checkin-date is-pulled-right">{{ agent.LastCheckin | formatDateTime }}</span>
        </div>
      </div>
    </router-link>
  </li>
</template>'

<script>
export default {
  props: [
    'agent'
  ],
  computed: {
    osIcon () {
      if (this.agent.OperatingSystem.includes('indows')) {
        return 'mdi mdi-windows'
      } else if (this.agent.OperatingSystem.includes('acOS')) {
        return 'mdi mdi-apple'
      } else if (this.agent.OperatingSystem.includes('nix')) {
        return 'mdi mdi-linux'
      } else {
        return 'mdi mdi-laptop'
      }
    }
  }
}
</script>

<style scoped>
  li {
    padding: 0;
  }

  a:hover {
    background: #edf1f4;
  }

  .router-link-exact-active {
    background: #dce4ea;
  }

  .agent-link {
    max-height: 100px;
  }

  @media only screen and (max-width: 1407px) {
    .checkin-date {
      display: block;
      float: none !important;
    }
  }
  @media only screen and (min-width: 1408px) and (max-width: 1524px) {

  }
</style>
