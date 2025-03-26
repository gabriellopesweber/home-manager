import { validationRules } from "@/plugins/rules/index"

export default {
  install(app) {
    app.config.globalProperties.$validation = (rule, ...args) => {
      if (validationRules[rule]) {
        return validationRules[rule](...args)
      }
      console.warn(`Regra de validação "${rule}" não encontrada.`)
      return true
    }
  }
}
