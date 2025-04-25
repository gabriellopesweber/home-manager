import dayjs from 'dayjs'
import { Income, Expense, Transfer } from '../models/Finance.js'
import { validateRequiredFields } from '../utils/validations.js'
import { formatExpenseItem, formatIncomeItem, formatTransferItem } from '../utils/format.js'

const LaunchController = {
  // Listar todas as Receitas, Despesas e Transferencias de acordo com a data inicial e final
  async getAll(req, res) {
    try {
      const { initial_date, final_date } = req.query
      const userId = req.user.id

      const validation = validateRequiredFields({ initial_date, final_date })
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message })
      }

      const start = dayjs(initial_date).startOf('day').toDate()
      const end = dayjs(final_date).endOf('day').toDate()

      const [incomes, expenses, transfers] = await Promise.all([
        Income.find({ user: userId, date: { $gte: start, $lte: end } }),
        Expense.find({ user: userId, date: { $gte: start, $lte: end } }),
        Transfer.find({ user: userId, date: { $gte: start, $lte: end } })
      ])

      const incomesFormatted = incomes.map(income => { return formatIncomeItem(income, true) })
      const expenseFormatted = expenses.map(expense => { return formatExpenseItem(expense, true) })
      const transferFormatted = transfers.map(transfer => { return formatTransferItem(transfer, true) })

      const combined = [...incomesFormatted, ...expenseFormatted, ...transferFormatted]
        .sort((a, b) => new Date(a.date) - new Date(b.date))

      res.status(200).json(combined)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Erro ao listar lançamentos', error })
    }
  }
}

export { LaunchController }