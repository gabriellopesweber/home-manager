const headerReports = [{
  title: '',
  value: 'month',
  align: 'center',
  width: 5
}, {
  title: 'Entradas',
  value: 'income',
}, {
  title: 'Saídas',
  value: 'expense',
}, {
  title: 'Resultado',
  value: 'result',
}, {
  title: 'Saldo',
  value: 'balance',
}].map(h => ({ ...h, nowrap: true }))

export { headerReports }