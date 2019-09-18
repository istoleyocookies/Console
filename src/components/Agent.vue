<template>
  <li>
    <router-link
      class="agent-link has-text-grey"
      :to="{ name: 'console', params: {AgentId: agent.Id}}"
    >
      <div class="columns is-paddingless is-marginless">
        <div class="column is-paddingless is-marginless">
          <p>
            <span class="has-text-weight-bold">{{ agent.Name }}</span>
          </p>
        </div>
        <div class="column is-paddingless is-marginless">
          <p class="tags has-addons is-pulled-right">
            <span class="tag is-danger" v-if="agent.Admin">Admin</span>
          </p>
        </div>
      </div>
      <div class="columns is-paddingless is-marginless">
        <div class="column is-paddingless is-marginless">
          <p>
            <b-icon size="is-small" icon="account"></b-icon>
            {{ agent.Username }}
          </p>
          <p>
            <span class="icon is-small">
              <i v-bind:class="osIcon" v-bind:title="agent.OperatingSystem"></i>
            </span>
            {{ agent.Hostname }} (PID: {{ agent.Pid }})
          </p>
          <p>
            <span>
              <b-icon size="is-small" icon="earth"></b-icon>
              {{ agent.Transport.Name }}
            </span>
            <span class="checkin-date is-pulled-right">
              <b-icon size="is-small" icon="clock-outline"></b-icon>
              {{ agent.LastCheckin | formatDateTime }}
            </span>
          </p>
        </div>
      </div>
    </router-link>
  </li>
</template>'

<script>
export default {
  props: ["agent"],
  computed: {
    osIcon() {
      if (this.agent.OperatingSystem.includes("indows")) {
        return "mdi mdi-windows";
      } else if (this.agent.OperatingSystem.includes("acOS")) {
        return "mdi mdi-apple";
      } else if (this.agent.OperatingSystem.includes("nix")) {
        return "mdi mdi-linux";
      } else {
        return "mdi mdi-laptop";
      }
    }
  }
};
</script>

<style scoped>
li {
  padding: 0;
}

a:hover {
  color: #121212 !important;
  background: #edf1f4;
}

.router-link-exact-active {
  color: #121212 !important;
  background: #dce4ea;
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
