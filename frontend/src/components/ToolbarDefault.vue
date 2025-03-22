<template>
  <v-navigation-drawer
    absolute
  >
    <v-list
      density="comfortable"
      nav
    >
      <v-list-item>
        <template #title>
          <div class="d-flex align-center justify-center">
            <img
              class="mx-auto"
              :src="myLogo"
              style="height: 75px; width: 200px;"
            >
          </div>
        </template>
      </v-list-item>
      <v-divider />
      <div class="mt-2">
        <v-list-item 
          link
          prepend-icon="mdi-view-dashboard"
          color="primary"
          title="Dashboard"
          :to="{ name: 'dashboard' }"
        />
        <v-list-group
          value="reports"
          prepend-icon="mdi-file-document"
          color="primary"
        >
          <template #activator="{ props }">
            <v-list-item
              v-bind="props"
              link
              
              title="Relatórios"
            />
          </template>

          <v-list-item
            link
            title="Relatorio de Entradas"
            :to="{ name: 'relatorio.receitas' }"
          />
        
          <v-list-item
            link 
            title="Relatorio de Saidas"
            :to="{ name: 'relatorio.saidas' }"
          />
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar title="HomeManager">
    <v-spacer />
    <v-list>
      <v-list-item>
        <v-btn
          v-if="authStore.isAuthenticated"
          @click="logout"
        >
          Sair
        </v-btn>
      </v-list-item>
    </v-list>
  </v-app-bar>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"
import { ref } from "vue"

const authStore = useAuthStore()
const router = useRouter()

const myLogo = ref("/img/HM-Black.svg")

const logout = () => {
  authStore.logout()
  router.push({
    name: 'login'
  })
}
</script>