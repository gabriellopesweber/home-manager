function formatCurrencyBR(value) {
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
}

export { formatCurrencyBR }