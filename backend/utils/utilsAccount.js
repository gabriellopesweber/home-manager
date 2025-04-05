import dayjs from 'dayjs'
import { Account } from '../models/Finance.js'

/**
 * Atualiza o saldo ao balance da conta
 * 
 * @param {Account} name
 * @param {Number} balance 
 * @param {Account} id
 * @returns String
 */
async function updateBalance(name, balance, id) {
  try {
    if (typeof (balance) !== "number") throw new Error("Balance deve ser um número")

    const query = id ? { _id: id } : { name }
    const account = await Account.findOne(query)

    if (!account) return false

    const balanceUpdated = account.balance + balance

    const updatedAccount = await Account.findByIdAndUpdate(
      account.id,
      { balance: balanceUpdated, updateDate: dayjs().toDate() },
      { new: true }
    )
    if (!updatedAccount) return false

    return true
  } catch (error) {
    console.error("Erro ao atualizar saldo:", error)
    return false
  }
}

async function getIdAccountByName(name) {
  try {

    const account = await Account.findOne({ name })
    if (!account) return false

    return account.id
  } catch (error) {
    console.error("Erro ao localizar conta:", error)
    return false
  }
}

export {
  updateBalance,
  getIdAccountByName
}