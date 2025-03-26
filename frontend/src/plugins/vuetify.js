import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { pt } from 'vuetify/locale'

export default createVuetify({
  components,
  directives,
  locale: {
    locale: 'pt', // Define o idioma padrão como português
    messages: { pt }, // Carrega as traduções para português
  },
  defaults: {
    VCard: {
      rounded: 'xl',
    },
    VBtn: {
      rounded: 'lg'
    },
    VTextField: {
      rounded: 'lg',
      density: 'comfortable'
    }
  },
})