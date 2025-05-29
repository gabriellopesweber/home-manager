<template>
  <v-navigation-drawer
    v-model="menu"
    :rail="!menu"
    expand-on-hover
  >
    <v-list
      density="comfortable"
      nav
    >
      <!-- Logo -->
      <v-list-item>
        <v-img
          :src="myLogo"
          height="75"
          class="mx-auto"
          type="image/png"
          alt="Logo"
        />
      </v-list-item>

      <v-divider class="mb-2" />

      <!-- Itens de Navegação -->
      <v-list-item
        link
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        :to="{ name: 'dashboard' }"
        active-class="text-primary"
      />
      <v-list-item
        link
        prepend-icon="mdi-receipt-text-outline"
        title="Relatórios"
        :to="{ name: 'reports' }"
        active-class="text-primary"
      />

      <!-- Subgrupo: Gerenciamento -->
      <v-list-group
        value="manager"
        prepend-icon="mdi-cash-multiple"
        color="primary"
      >
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Gerenciamento"
            link
            active-class="text-primary"
          />
        </template>

        <v-list-item
          title="Lançamentos"
          prepend-icon="mdi-finance"
          link
          :to="{ name: 'manager.launch' }"
          active-class="text-primary"
        />
        <v-list-item
          title="Contas"
          prepend-icon="mdi-bank"
          link
          :to="{ name: 'manager.account' }"
          active-class="text-primary"
        />
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <!-- Barra Superior -->
  <v-app-bar elevation="2">
    <v-btn
      v-tooltip:right="!menu ? 'Abrir menu lateral' : 'Fechar menu lateral'"
      :icon="menu ? 'mdi-menu-open' : 'mdi-menu-close'"
      rounded="circle"
      aria-label="Alternar menu lateral"
      @click="menu = !menu"
    />

    <v-spacer />

    <v-tooltip location="bottom">
      <template #activator="{ props }">
        <v-btn
          v-if="authStore.isAuthenticated"
          icon
          v-bind="props"
          @click="logout"
        >
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </template>
      <span>Sair</span>
    </v-tooltip>
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
      myLogo: `${import.meta.env.BASE_URL}img/HM-Black-old.png`,
      menu: true
    }
  },
  methods: {
    logout () {
      this.authStore.logout()
      this.router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>
/* Se quiser uma aparência mais moderna com bordas arredondadas, adicione aqui */
.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.08);
}
</style>
