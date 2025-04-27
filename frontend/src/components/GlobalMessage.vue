<template>
  <v-alert
    v-if="messageStore.visible"
    :type="messageStore.type"
    elevation="2"
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
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  width: 400px;
}
</style>
