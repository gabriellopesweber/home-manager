function formatCurrencyMaskBR(value) {
  // Remove tudo que não for número
  const cleaned = String(value)
    .replace(/[^\d-]/g, '')
    .replace(/(?!^)-/g, '')

  // Converte para número inteiro (centavos)
  let numeric = parseInt(cleaned, 10)

  if (isNaN(numeric)) numeric = 0

  // Divide por 100 para pegar reais e centavos
  const cents = (numeric / 100).toFixed(2)

  // Formata como moeda brasileira
  return cents.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}


export { formatCurrencyMaskBR }