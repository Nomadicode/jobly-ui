import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import './assets/scss/app.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import VueAxios from 'vue-axios'
import api from '@/api'

import router from './router'

import App from './App.vue'

//region PrimeVue Configs
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import Aura from '@primevue/themes/aura'
//endregion

import VueGtag from "vue-gtag"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(VueAxios, api)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.dark',
        }
    }
})
app.use(DialogService)
app.use(ToastService)
app.use(ConfirmationService)

app.use(VueGtag, {
    config: { id: import.meta.env.VITE_APP_GOOGLE_MEASUREMENT_ID }
})
app.provide('api', app.config.globalProperties.axios)

app.mount('#app')
