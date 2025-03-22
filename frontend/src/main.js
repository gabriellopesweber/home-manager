import { createApp } from 'vue'
import { createPinia } from "pinia"

import App from './App.vue'
import router from './router/index'
import vuetify from './plugins/vuetify'
import validationPlugin from "@/plugins/validationPlugin"
import messagePlugin from "@/plugins/messagePlugin"

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)
app.use(messagePlugin)
app.use(validationPlugin)

app.mount('#app')