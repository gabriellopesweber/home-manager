import { createApp } from 'vue'
import { createPinia } from "pinia"

import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify'
import validationPlugin from "@/plugins/validationPlugin"
import messagePlugin from "@/plugins/messagePlugin"
import { setupInterceptors } from './services/interceptor'
import '@/assets/global.css'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)
app.use(messagePlugin)
app.use(validationPlugin)
dayjs.extend(customParseFormat)
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

setupInterceptors()

app.mount('#app')