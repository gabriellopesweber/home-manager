<template>
  <v-app>
    <ToolbarDefault v-if="authStore.isAuthenticated" />
    
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { useAuthStore } from "@/stores/authStore"
import ToolbarDefault from "@/components/ToolbarDefault.vue"

const authStore = useAuthStore()
</script>