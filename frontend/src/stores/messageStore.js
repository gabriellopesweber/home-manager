import { defineStore } from "pinia"

export const useMessageStore = defineStore("message", {
  state: () => ({
    message: "",
    type: "info",
    visible: false,
  }),
  actions: {
    showMessage(msg, type = "info") {
      this.message = msg
      this.type = type
      this.visible = true

      setTimeout(() => {
        this.visible = false
      }, 5000)
    },
  },
})