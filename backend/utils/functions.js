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
  let totalTransfer = 0

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

    totalIncome += incomeAgg[0]?.total || 0
    totalExpense += expenseAgg[0]?.total || 0

    console.log(openingBalanceAccount, totalIncome, totalExpense)
    openingBalance += openingBalanceAccount + totalIncome - Math.abs(totalExpense)
    console.log(openingBalance)
  }

  console.log(openingBalance)

  const matchTransfer = {
    originAccount: { $in: accountIds },
    date: { $lte: updateDate },
    user: new mongoose.Types.ObjectId(user)
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
    transfer: totalTransfer,
    balance: openingBalance
  }
}
