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
              style="height: 75px"
            >
          </div>
        </template>
      </v-list-item>
      <v-divider class="mb-2" />
      <v-list-item 
        link
        prepend-icon="mdi-view-dashboard"
        color="primary"
        title="Dashboard"
        :to="{ name: 'dashboard' }"
      />
      <v-list-group
        value="reports"
        prepend-icon="mdi-receipt-text-outline"
        color="primary"
      >
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            link
            color="primary"
            title="Relatórios"
          />
        </template>

        <v-list-item
          prepend-icon="mdi-receipt-text-arrow-right-outline"
          title="Receitas"
          color="primary"
          link
          :to="{ name: 'report.income' }"
        />
        
        <v-list-item
          link 
          prepend-icon="mdi-receipt-text-arrow-left-outline"
          title="Despesas"
          color="primary"
          :to="{ name: 'report.expense' }"
        />
      </v-list-group>
      <v-list-group
        value="mananger"
        prepend-icon="mdi-cash-multiple"
        color="primary"
      >
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Gerenciamento"
            color="primary"
            link
          />
        </template>

        <v-list-item
          title="Receitas"
          prepend-icon="mdi-arrow-right-thick"
          color="primary"
          link
          :to="{ name: 'manager.income' }"
        />
        <v-list-item
          prepend-icon="mdi-arrow-left-thick"
          title="Despesas"
          color="primary"
          link
          :to="{ name: 'manager.expense' }"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar>
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

<script>
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "vue-router"

export default {
  setup () {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  data () {
    return {
      myLogo: "/img/HM-Black-old.png"
    }
  },
  methods: {
    logout () {
      this.authStore.logout()
      this.router.push({
        name: 'login'
      })
    }
  }
}
</script>