import { useMessageStore } from "@/stores/messageStore"

export default {
  install(app) {
    app.config.globalProperties.$showMessage = (msg, type = "info") => {
      const store = useMessageStore()
      store.showMessage(msg, type)
    }
  },
}
