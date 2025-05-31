import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import RGBCanvas from './components/apps/RGBCanvas.vue'
import MBrot from './components/apps/MBrot.vue'
import Home from './components/apps/Home.vue'
import MattMcDade from './components/apps/MattMcDade.vue'
import BlueConditionVue from './components/apps/BlueCondition/BlueCondition.vue'
import GameTwo from './components/apps/GameTwo/GameTwo.vue'
import VibeRPG from './components/apps/VibeRPG/VibeRPG.vue'
import Frets from './components/apps/Frets/Frets.vue'

const routes = [
  { 
    path: '/', 
    component: Frets,
  },
  { 
    path: '/r', 
    component: Home,
  },
  {
    path: '/bluecondition',
    component: BlueConditionVue
  },
  { 
    path: '/mbrot', 
    component: MBrot,
  },
  { 
    path: '/supercircle',
    component: RGBCanvas,
  },
  { 
    path: '/gametwo',
    component: GameTwo,
  },
  { 
    path: '/viberpg',
    component: VibeRPG,
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
