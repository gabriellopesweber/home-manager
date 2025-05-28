import dayjs from 'dayjs'
import 'dayjs/locale/pt-br.js'
import mongoose from 'mongoose'
import { Account, Expense, Income, Transfer } from '../models/Finance.js'
import { validateRequiredFields } from '../utils/validations.js'

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

      // 1. Buscar contas do usuário e somar os saldos iniciais
      const accounts = await Account.find({ user: userId })
      const totalOpeningBalance = accounts.reduce((sum, acc) => sum + (acc.openingBalance || 0), 0)

      // 2. Construir filtro base
      const baseMatch = {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: start.toDate(), $lte: end.toDate() }
      }
      if (status !== undefined) {
        baseMatch.status = Number(status)
      }

      // 3. Função para agregação por mês
      const getMonthlyAggregates = async ({ model, match }) => {
        return model.aggregate([
          { $match: match },
          {
            $group: {
              _id: {
                year: { $year: "$date" },
                month: { $month: "$date" }
              },
              total: { $sum: "$value" }
            }
          }
        ])
      }

      const [incomesAgg, expensesAgg] = await Promise.all([
        getMonthlyAggregates({ model: Income, match: baseMatch }),
        getMonthlyAggregates({ model: Expense, match: baseMatch })
      ])

      // 4. Mapear dados mensais
      const monthlyData = {}
      incomesAgg.forEach(({ _id, total }) => {
        const key = `${_id.year}-${_id.month}`
        if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 }
        monthlyData[key].income = total
      })
      expensesAgg.forEach(({ _id, total }) => {
        const key = `${_id.year}-${_id.month}`
        if (!monthlyData[key]) monthlyData[key] = { income: 0, expense: 0 }
        monthlyData[key].expense = total
      })

      // 5. Construir arrays de saída
      const monthLabels = []
      const incomeData = []
      const expenseData = []
      const balanceData = []

      let current = start.startOf('month')
      const last = end.startOf('month')
      let accumulatedBalance = totalOpeningBalance

      while (current.isBefore(last) || current.isSame(last, 'month')) {
        const key = `${current.year()}-${current.month() + 1}`
        const label = current.locale('pt-br').format('MMMM')
        const data = monthlyData[key] || { income: 0, expense: 0 }

        const income = data.income
        const expense = data.expense

        accumulatedBalance += income - Math.abs(expense)

        monthLabels.push(label)
        incomeData.push(income)
        expenseData.push(-expense)
        balanceData.push(accumulatedBalance)

        current = current.add(1, 'month')
      }

      const datasets = [
        {
          label: 'Receitas',
          data: incomeData,
          borderColor: 'green'
        },
        {
          label: 'Despesas',
          data: expenseData,
          borderColor: 'red'
        },
        {
          label: 'Saldo',
          data: balanceData,
          borderColor: 'blue'
        }
      ]

      return res.json({ labels: monthLabels, datasets })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Erro ao listar dados de montagem para dashboard' })
    }
  }
}

export { DashboardController }
