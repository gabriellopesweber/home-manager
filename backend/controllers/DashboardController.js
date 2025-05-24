import dayjs from 'dayjs'
import 'dayjs/locale/pt-br.js'
import mongoose from 'mongoose'
import { Expense, Income, Transfer } from '../models/Finance.js'

dayjs.locale('pt-br')

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
      const { status } = req.query

      const start = dayjs().startOf('year').toDate()
      const end = dayjs().endOf('year').toDate()

      const monthLabels = Array.from({ length: 12 }, (_, i) =>
        dayjs().month(i).format('MMMM')
      )

      // Filtro base
      const baseMatch = {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: start, $lte: end }
      }

      if (status !== undefined) {
        baseMatch.status = Number(status)
      }

      // Aggregation de receitas
      const incomes = await Income.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$value' }
          }
        }
      ])

      // Aggregation de despesas
      const expenses = await Expense.aggregate([
        { $match: baseMatch },
        {
          $group: {
            _id: { $month: '$date' },
            total: { $sum: '$value' }
          }
        }
      ])

      const mapTo12Months = (data) => {
        const result = new Array(12).fill(0)
        data.forEach(item => {
          const monthIndex = item._id - 1
          result[monthIndex] = Math.abs(item.total)
        })
        return result
      }

      const datasets = [
        {
          label: 'Receitas',
          data: mapTo12Months(incomes),
          borderColor: 'green'
        },
        {
          label: 'Despesas',
          data: mapTo12Months(expenses),
          borderColor: 'red'
        }
      ]

      return res.json({ labels: monthLabels, datasets })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao listar dados de montagem para dashboard' })
    }
  }
}

export { DashboardController }
