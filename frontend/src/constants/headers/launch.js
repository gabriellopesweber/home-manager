const headerLaunch = [
  {
    title: 'Tipo',
    value: 'type',
    align: 'center',
    sortable: true
  },
  {
    title: 'Descrição',
    value: 'description',
    sortable: true
  },
  {
    title: 'Categoria',
    value: 'category',
    sortable: true
  },
  {
    title: 'Data',
    value: 'date',
    sortable: true
  },
  {
    title: 'Valor',
    value: 'value',
    sortable: true,
    nowrap: true
  },
  {
    title: 'Conta',
    value: 'account',
    sortable: true,
    nowrap: true
  },
  {
    title: 'Status',
    value: 'status',
    align: 'center',
    sortable: true
  },
  {
    title: 'Ação',
    value: 'actions'
  }
].map(h => ({ ...h, nowrap: true }))

export { headerLaunch }