import './assets/css/main.css'
import 'vue3-toastify/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useUserStore } from './stores/userStore'
import YmapPlugin from 'vue-yandex-maps'

import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(i18n)
const userStore = useUserStore(pinia)
userStore.loadUser()

const settings = {
  apiKey: '#e089730e-a638-43c4-8f79-b637f2cb49a5',
  lang: 'ru_RU',
  coordorder: 'latlong',
  enterprise: false,
  version: '2.1',
}

// Create the Yandex Maps plugin with settings
app.use(YmapPlugin, settings)

app.mount('#app')
