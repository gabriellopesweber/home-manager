import dayjs from 'dayjs'
import 'dayjs/locale/pt-br.js'
import mongoose from 'mongoose'
import { Expense, Income, Transfer } from '../models/Finance.js'
import { validateRequiredFields } from '../utils/validations.js'
import { getBalanceAtDate } from '../utils/functions.js'
import { statusFinance } from '../constants/Finance.js'

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
      return res.status(500).json({ message: 'Erro ao listar lançamentos' })
    }
  },

  async getDatasets(req, res) {
    try {
      const userId = req.user.id
      const { initial_date, final_date, status } = req.query

      const validation = validateRequiredFields({ initial_date, final_date })
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message })
      }

      const start = dayjs(initial_date).startOf('day')
      const end = dayjs(final_date).endOf('day')

      const monthLabels = []
      const balanceByMonth = []

      let current = start.startOf('month')
      const last = end.startOf('month')

      while (current.isBefore(last) || current.isSame(last, 'month')) {
        monthLabels.push(current.locale('pt-br').format('MMMM'))

        const lastDayOfMonth = current.endOf('month').format("YYYY-MM-DD")
        const balance = await getBalanceAtDate({ date: lastDayOfMonth, user: userId, status: statusFinance.PENDING })
        balanceByMonth.push(balance)

        current = current.add(1, 'month')
      }

      const firstMonth = start.startOf('month').month()

      const baseMatch = {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: start.toDate(), $lte: end.toDate() }
      }

      if (status !== undefined) {
        baseMatch.status = Number(status)
      }

      const [incomes, expenses] = await Promise.all([
        Income.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: { $month: '$date' },
              total: { $sum: '$value' }
            }
          }
        ]),
        Expense.aggregate([
          { $match: baseMatch },
          {
            $group: {
              _id: { $month: '$date' },
              total: { $sum: '$value' }
            }
          }
        ])
      ])

      const mapToPeriod = (data) => {
        const result = new Array(monthLabels.length).fill(0)
        data.forEach(item => {
          const relativeIndex = item._id - 1 - firstMonth
          if (relativeIndex >= 0 && relativeIndex < result.length) {
            result[relativeIndex] = Math.abs(item.total)
          }
        })
        return result
      }

      const datasets = [
        {
          label: 'Receitas',
          data: mapToPeriod(incomes),
          borderColor: 'green'
        },
        {
          label: 'Despesas',
          data: mapToPeriod(expenses),
          borderColor: 'red'
        }
      ]

      return res.json({ labels: monthLabels, datasets, balances: balanceByMonth })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao listar dados de montagem para dashboard' })
    }
  }
}

export { DashboardController }
