import { Expense, Income, Transfer } from '../models/Finance.js'

const DashboardController = {
  async lastThree(req, res) {
    try {
      const userId = req.user.id

      const [incomes, expenses, transfers] = await Promise.all([
        Income.find({ user: userId })
          .sort({ date: -1 })
          .limit(10)
          .populate('account category'),

        Expense.find({ user: userId })
          .sort({ date: -1 })
          .limit(10)
          .populate('account category'),

        Transfer.find({ user: userId })
          .sort({ date: -1 })
          .limit(10)
          .populate('originAccount destinationAccount')
      ])

      const formatted = [
        ...incomes.map(item => ({
          type: 'income',
          date: item.date,
          value: item.value,
          description: item.description || item.category?.name || 'Receita',
          status: item.status,
          accountName: item.account?.name || 'Conta não informada'
        })),
        ...expenses.map(item => ({
          type: 'expense',
          date: item.date,
          value: item.value,
          description: item.description || item.category?.name || 'Despesa',
          status: item.status,
          accountName: item.account?.name || 'Conta não informada'
        })),
        ...transfers.map(item => ({
          type: 'transfer',
          date: item.date,
          value: item.value,
          description: item.description || 'Transferência',
          status: item.status,
          accountName: item.originAccount?.name || 'Conta de origem não informada'
        }))
      ]

      const lastThree = formatted
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3)

      return res.status(200).json(lastThree)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao listar lançamentos', error })
    }
  }
}

export { DashboardController }
