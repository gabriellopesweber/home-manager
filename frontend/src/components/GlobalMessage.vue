<template>
  <v-alert
    v-if="messageStore.visible"
    :type="messageStore.type"
    variant="tonal"
    class="message-alert"
  >
    {{ messageStore.message }}
  </v-alert>
</template>

<script>
import { useMessageStore } from "@/stores/messageStore"

export default {
  setup() {
    const messageStore = useMessageStore()
    return { messageStore }
  },
}
</script>

<style scoped>
.message-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  width: 400px;
}
</style>
