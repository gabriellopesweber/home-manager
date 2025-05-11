import dayjs from "dayjs"
import { Account, Expense, Income, Transfer } from "../models/Finance.js"

class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}

export async function getBalanceAtDate({ date, id, user, status = null }) {
  const accountQuery = { user }
  if (id) accountQuery._id = id

  const accounts = await Account.find(accountQuery)

  if (accounts.length === 0) throw new AppError('Conta não encontrada!', 404)

  let openingBalance = 0

  for (const account of accounts) {
    const updateDate = dayjs(date).endOf('day').toDate()
    const openingBalanceAccount = account.openingBalance || 0

    const matchBase = {
      account: account._id,
      date: { $lte: updateDate }
    }
    if (status != null) matchBase.status = status

    const [incomeAgg, expenseAgg] = await Promise.all([
      Income.aggregate([
        { $match: matchBase },
        { $group: { _id: null, total: { $sum: '$value' } } }
      ]),
      Expense.aggregate([
        { $match: matchBase },
        { $group: { _id: null, total: { $sum: '$value' } } }
      ])
    ])

    const totalIncome = incomeAgg[0]?.total || 0
    const totalExpense = expenseAgg[0]?.total || 0

    openingBalance += openingBalanceAccount + totalIncome - Math.abs(totalExpense)
  }

  return openingBalance
}

export async function getBalanceDetailedAtDate({ date, id, user, status = null }) {
  const accountQuery = { user }
  if (id) accountQuery._id = id

  const accounts = await Account.find(accountQuery)

  if (accounts.length === 0) throw new AppError('Conta não encontrada!', 404)

  const accountIds = accounts.map(acc => acc._id)
  const updateDate = dayjs(date).endOf('day').toDate()

  let totalIncome = 0
  let totalExpense = 0
  let totalTransfer = 0

  for (const account of accounts) {
    const matchBase = {
      account: account._id,
      date: { $lte: updateDate }
    }
    if (status != null) matchBase.status = status

    const [incomeAgg, expenseAgg] = await Promise.all([
      Income.aggregate([
        { $match: matchBase },
        { $group: { _id: null, total: { $sum: '$value' } } }
      ]),
      Expense.aggregate([
        { $match: matchBase },
        { $group: { _id: null, total: { $sum: '$value' } } }
      ])
    ])

    totalIncome += incomeAgg[0]?.total || 0
    totalExpense += expenseAgg[0]?.total || 0
  }

  // Match para transferências com base na conta de origem
  const matchTransfer = {
    originAccount: { $in: accountIds },
    date: { $lte: updateDate },
    user
  }
  if (status != null) matchTransfer.status = status

  const transferAgg = await Transfer.aggregate([
    { $match: matchTransfer },
    { $group: { _id: null, total: { $sum: '$value' } } }
  ])
  totalTransfer = transferAgg[0]?.total || 0

  return {
    income: totalIncome,
    expense: totalExpense,
    transfer: totalTransfer
  }
}
