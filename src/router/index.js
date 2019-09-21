import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/components/Home'
import Console from '@/components/console/Console'
import File from '@/components/File'
import Login from '@/components/Login'
import Logout from '@/components/Logout'
import Settings from '@/components/Settings'
import Error from '@/components/Error'
import ErrorMessage from '@/components/ErrorMessage'
import ErrorMessageList from '@/components/ErrorMessageList'
import Ioc from '@/components/Ioc'
import IocList from '@/components/IocList'
import Payloads from '@/components/Payloads'
import TaskView from '@/components/TaskView'
import TaskList from '@/components/TaskList'
import Transports from '@/components/Transports'

import store from '../store/index'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: process.env.ROUTER_MODE,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/console/:AgentId/',
      name: 'console',
      component: Console
    },
    {
      path: '/errors/',
      name: 'errors',
      component: ErrorMessageList
    },
    {
      path: '/error/:ErrorMessageId/',
      name: 'errorMessage',
      component: ErrorMessage
    },
    {
      path: '/files/',
      name: 'files',
      component: File
    },
    {
      path: '/iocs/',
      name: 'iocs',
      component: IocList
    },
    {
      path: '/ioc/:IocId/',
      name: 'ioc',
      component: Ioc
    },
    {
      path: '/tasks/',
      name: 'tasks',
      component: TaskList
    },
    {
      path: '/task/:TaskId/',
      name: 'task',
      component: TaskView
    },
    {
      path: '/payloads/',
      name: 'payloads',
      component: Payloads
    },
    {
      path: '/transports/',
      name: 'transports',
      component: Transports
    },
    {
      path: '/login/',
      name: 'login',
      component: Login
    },
    {
      path: '/logout/',
      name: 'logout',
      component: Logout
    },
    {
      path: '/settings/',
      name: 'settings',
      component: Settings
    },
    {
      path: '*',
      name: 'catchall',
      component: Error
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log('[router] Trying to get to ' + to.path)
  console.log('[router] Authed: ' + store.state.faction.loggedIn)
  if (store.state.faction.loggedIn) {
    console.log('[router] User is logged in, sending them on their way.')
    next()
  } else if (to.name === 'login') {
    console.log('[router] User is trying to log in, sending them on their way.')
    next()
  } else if (!store.state.faction.loggedIn && to.name !== 'login') {
    next({ name: 'login', query: { next: to.fullPath } })
  }
  next()
})

export default router
