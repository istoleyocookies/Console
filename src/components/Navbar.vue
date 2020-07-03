<template>
  <nav class="navbar is-fixed-top">
    <div class="navbar-brand">
      <router-link :to="{ name: 'home'}" class="navbar-item">
       <img src="../assets/faction-white-orange.png">
      </router-link>
      <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="menuActive = !menuActive">
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div class="navbar-menu" :class="{'is-active':menuActive}">
      <div class="navbar-start">
        <router-link :to="{ name: 'home' }" class="navbar-item">
          Agents
        </router-link>
        <router-link :to="{ name: 'tasks' }" class="navbar-item">
          Tasks
        </router-link>
        <router-link :to="{ name: 'payloads' }" class="navbar-item">
          Payloads
        </router-link>
        <router-link :to="{ name: 'transports' }" class="navbar-item">
          Transports
        </router-link>
        <router-link :to="{ name: 'files' }" class="navbar-item">
          Files
        </router-link>
        <router-link :to="{ name: 'iocs' }" class="navbar-item">
          IOCs
        </router-link>
      </div>
      <div class="navbar-end has-text-centered">
        <div class="navbar-item has-dropdown is-paddingless user-menu is-hoverable" :class="{'is-active':menuActive}">
          <a class="navbar-item username" slot="trigger">
            <p>{{ username }}</p>
          </a>
          <div class="navbar-dropdown is-right user-dropdown">
            <router-link class="navbar-item" :to="{ name: 'settings'}">
              Settings
            </router-link>
            <router-link class="navbar-item" :to="{ name: 'errors'}">
              Error Messages
            </router-link>
            <router-link class="navbar-item" :to="{ name: 'logout'}">
              Logout
            </router-link>
          </div>
        </div>
        <b-dropdown class="connection-status-dropdown is-paddingless" position="is-bottom-left" hoverable>
          <a class="navbar-item" slot="trigger">
            <b-icon icon="circle" size="is-small"
              v-bind:class="{ 'has-text-success': connected, 'has-text-danger': !connected }">
            </b-icon>
          </a>
          <b-dropdown-item custom paddingless>
            <div class="connection-status">
              <p>{{ connectionStatus }}</p>
              <span v-if="connected">{{ connectionStatusMessage }}</span>
            </div>
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      connectionError: false,
      menuActive: false
    }
  },
  computed: mapState({
    connected: state => state.faction.connected,
    connectionStatus: state => state.faction.connectionStatus,
    connectionStatusMessage: state => state.faction.connectionStatusMessage,
    username: state => state.faction.username
  })
}
</script>

<style scoped>
  .navbar {
    background-color: #034748;
    -webkit-box-shadow: 0px 0px 2px 2px rgba(0,0,0,1);
    -moz-box-shadow: 0px 0px 2px 2px rgba(0,0,0,1);
    box-shadow: 0px 0px 2px 2px rgba(0,0,0,1);
    text-align: center;
  }

  .navbar a {
    color:#eff7f7;
  }

  .navbar-item:hover {
    background-color: #006E90
  }

  h1 {
    text-align: center;
    padding-top: 10px;
  }

  li {
    margin: 0 auto;
    text-align: center;
    max-width: 50%;
  }

  .faction-text {
    color:#fe621d;
  }

  .menu-list a {
    background-color: #034748;
    color: #eff7f7;
  }

  .menu-list a:hover {
    background-color: #034748;
    color: #eff7f7;
    border-bottom: #fe621d;
    border-bottom-style: solid;
    border-bottom-width: 1px;
  }

  .user-dropdown a {
    color: #034748;
  }

  .connection-status {
    padding: 5px 0 5px 0;
  }

  .notification {
    /* position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px; */
    padding: 10px
  }

  .connection-status-dropdown > .dropdown-menu {
    padding: 0;
    background-color: #23d160 !important;
  }

  @media only screen and (max-width: 1087px) {
    .navbar-menu {
      background-color: inherit;
      text-align: right;
      position: fixed;
      right: 0;
      width: 250px;
      height: 425px;
    }

    .connection-status-dropdown {
      display: none;
    }

    .user-dropdown, .username, .dropdown-trigger {
      width: 100%;
    }

    .user-dropdown {
      background: #eff7f7;
    }

    .dropdown-trigger {
      width: 100%;
    }

    .navbar-end {
      text-align: right !important;
    }
  }
</style>
