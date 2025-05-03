<template>
  <v-navigation-drawer v-model="menu">
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
          title="Lançamentos"
          prepend-icon="mdi-finance"
          color="primary"
          link
          :to="{ name: 'manager.launch' }"
        />
        <v-list-item
          prepend-icon="mdi-bank"
          title="Contas"
          color="primary"
          link
          :to="{ name: 'manager.account' }"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar>
    <v-btn
      v-tooltip:right="!menu ? 'Abrir menu lateral' : 'Fechar menu lateral'"
      :icon="menu ? 'mdi-menu-open' : 'mdi-menu-close'"
      rounded="circle"
      @click="menu = !menu"
    />
    <v-spacer />
    <v-list>
      <v-list-item>
        <v-btn
          v-if="authStore.isAuthenticated"
          @click="logout"
        >
          <v-icon> mdi-logout </v-icon>
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
      myLogo: "/img/HM-Black-old.png",
      menu: true
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