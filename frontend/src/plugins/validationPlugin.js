const validationRules = {
  required: (value) => {
    if (!value) {
      return "Campo obrigatório."
    }

    return true
  },
  email: (value) => {
    const regex = /\S+@\S+\.\S+/
    if (!regex.test(value)) {
      return "E-mail inválido."
    }

    return true
  },
  minLength: (length) => (value) => {
    if (value && value.length >= length) {
      return `Mínimo de ${length} caracteres.`
    }

    return true
  },
  maxLength: (length) => (value) => {
    if (value && value.length <= length) {
      return `Máximo de ${length} caracteres.`
    }

    return true
  },
  passwordStrength: (value) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/
    if (!regex.test(value)) {
      return "A senha deve ter pelo menos 6 caracteres, incluindo letras e números."
    }

    return true
  }
}

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
