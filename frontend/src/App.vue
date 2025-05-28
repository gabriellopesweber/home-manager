<template>
  <v-app>
    <GlobalMessage />
    <ToolbarDefault v-if="authStore.isAuthenticated" />
    
    <v-main>
      <router-view v-slot="{ Component }">
        <v-scroll-x-transition mode="out-in">
          <component :is="Component" />
        </v-scroll-x-transition>
      </router-view>
    </v-main>
  </v-app>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore"
import ToolbarDefault from "@/components/ToolbarDefault.vue"
import GlobalMessage from "@/components/GlobalMessage.vue"

const authStore = useAuthStore()
</script>