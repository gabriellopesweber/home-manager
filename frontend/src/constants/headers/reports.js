const headerReports = [{
  title: '',
  value: 'month',
  align: 'center',
  width: 5
}, {
  title: 'Entradas',
  value: 'income',
  cellProps: () => ({
    class: 'text-green',
  })
}, {
  title: 'Saídas',
  value: 'expense',
  cellProps: () => ({
    class: 'text-error',
  })
}, {
  title: 'Resultado',
  value: 'result',
}, {
  title: 'Saldo',
  value: 'balance',
}].map(h => ({ ...h, nowrap: true }))

export { headerReports }
