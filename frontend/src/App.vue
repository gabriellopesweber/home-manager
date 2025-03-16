<template>
  <v-app>
    <ToolbarDefault />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import ToolbarDefault from '@/components/ToolbarDefault.vue'

export default {
  components: {
    ToolbarDefault
  }
}
</script>