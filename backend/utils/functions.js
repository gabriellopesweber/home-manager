import dayjs from "dayjs"
import { Account, Expense, Income, Transfer } from "../models/Finance.js"
import mongoose from "mongoose"

export async function getBalanceAtDate({ date, id, user, status = null }) {
  const accountQuery = { user }
  if (id) accountQuery._id = id

  const accounts = await Account.find(accountQuery)

  if (accounts.length === 0) return 0

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
  if (accounts.length === 0) return 0

  const accountIds = accounts.map(acc => acc._id)
  const updateDate = dayjs(date).endOf('day').toDate()

  let openingBalance = 0
  let totalIncome = 0
  let totalExpense = 0

  for (const account of accounts) {
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

    const income = incomeAgg[0]?.total || 0
    const expense = expenseAgg[0]?.total || 0

    totalIncome += income
    totalExpense += expense

    openingBalance += openingBalanceAccount + income - Math.abs(expense)
  }

  const baseMatch = {
    date: { $lte: updateDate },
    user: new mongoose.Types.ObjectId(user)
  }
  if (status != null) baseMatch.status = status

  const [transferOutAgg, transferInAgg] = await Promise.all([
    Transfer.aggregate([
      { $match: { ...baseMatch, originAccount: { $in: accountIds } } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ]),
    Transfer.aggregate([
      { $match: { ...baseMatch, destinationAccount: { $in: accountIds } } },
      { $group: { _id: null, total: { $sum: '$value' } } }
    ])
  ])

  const transferOut = transferOutAgg[0]?.total || 0
  const transferIn = transferInAgg[0]?.total || 0

  return {
    income: totalIncome,
    expense: totalExpense,
    transfer: {
      in: transferIn,
      out: transferOut,
    },
    balance: openingBalance
  }
}

