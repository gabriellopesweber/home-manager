import dayjs from "dayjs"
import { Account, Expense, Income } from "../models/Finance.js"

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

  if (!accounts) {
    throw new AppError('Conta não encontrada!', 404)
  }

  let openingBalance = 0

  for (const account of accounts) {
    const updateDate = dayjs(date).toDate()
    const openingBalanceAccount = account.openingBalance || 0

    const matchBase = {
      account: account._id,
      date: { $lte: updateDate }
    }
    if (typeof status === 'number') matchBase.status = status

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

    console.log(totalIncome, totalExpense)

    openingBalance += openingBalanceAccount + totalIncome - Math.abs(totalExpense)
  }

  return openingBalance
}