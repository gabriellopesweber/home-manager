import dayjs from 'dayjs'
import { Account, Category, Expense, Income, Transfer } from '../models/Finance.js'
import { formatAccountItem } from '../utils/format.js'
import { getBalanceAtDate } from '../utils/functions.js'
import { statusFinance } from '../constants/Finance.js'

const AccountController = {
  // Criar uma nova conta
  async create(req, res) {
    try {
      const { name, balance } = req.body
      const user = req.user.id
      let openingBalance = 0

      if (balance !== 0) {
        openingBalance = balance
      }

      if (!name || typeof balance !== "number") {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const newAccount = await Account.create({ name, balance, openingBalance, user })
      res.status(201).json(formatAccountItem(newAccount))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar conta', error })
    }
  },

  // Listar todas as contas
  async getAll(req, res) {
    try {
      const accounts = await Account.find({ user: req.user.id })
      res.status(200).json(accounts.map(account => formatAccountItem(account)))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar conta', error })
    }
  },

  // Buscar uma conta por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const account = await Account.findById({ _id: id, user: req.user.id })

      if (!account) return res.status(404).json({ message: 'Conta não encontrada!' })

      res.status(200).json(formatAccountItem(account))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar conta', error })
    }
  },

  // Atualizar uma conta
  async update(req, res) {
    try {
      const { id } = req.params
      const { name, balance } = req.body
      const user = req.user.id
      const nameCategory = 'Outros'

      if (!name && typeof balance !== 'number') {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const balanceAtDate = await getBalanceAtDate({ date: dayjs().toISOString(), id, user, status: statusFinance.CONCILIATED })

      const isAdjustmentPositive = balance > balanceAtDate
      const adjustmentValue = balance - balanceAtDate

      const type = isAdjustmentPositive ? 'receita' : 'despesa'
      const Model = isAdjustmentPositive ? Income : Expense

      const category = await Category.findOneAndUpdate(
        { name: nameCategory },
        { $setOnInsert: { name: nameCategory, default: true, type } },
        { upsert: true, new: true }
      )
      const updateDate = dayjs().toDate()

      await Model.create({
        category: category.id,
        value: adjustmentValue,
        status: 0,
        executionDate: updateDate,
        date: updateDate,
        description: 'Ajuste de Saldo',
        account: id,
        user
      })

      const updatedAccount = await Account.findOneAndUpdate(
        { _id: id, user },
        { name, balance, updateDate },
        { new: true }
      )

      res.status(200).json(formatAccountItem(updatedAccount))
    } catch (error) {
      if (error.statusCode === 404) {
        return res.status(error.statusCode).json({ message: error.message })
      }

      res.status(500).json({ message: 'Erro ao atualizar conta', error })
    }
  },

  async getTotalAssociated(req, res) {
    try {
      const { id } = req.params
      if (!id) return res.status(400).json({ message: 'Não foi informado o ID da conta!' })

      let quantity = 0

      const dataIncome = await Income.find({ user: req.user.id, account: id })
      const dataExpense = await Expense.find({ user: req.user.id, account: id })
      const dataTransfer = await Transfer.find({ user: req.user.id, account: id })

      if (!dataIncome && !dataExpense && !dataTransfer) {
        return res.status(404).json({ message: 'Não há dados!' })
      }

      quantity = dataIncome.length + dataExpense.length + dataTransfer.length

      res.status(200).json({ quantity })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar total de contas bancarias associadas', error })
    }
  },

  // Deletar uma conta
  async delete(req, res) {
    try {
      const { id } = req.params

      const isDeletedIncome = await Income.deleteMany({ user: req.user.id, account: id })
      const isDeletedExpense = await Expense.deleteMany({ user: req.user.id, account: id })
      const isDeletedTransferO = await Transfer.deleteMany({ user: req.user.id, originAccount: id })
      const isDeletedTransferD = await Transfer.deleteMany({ user: req.user.id, destinationAccount: id })

      switch (false) {
        case isDeletedIncome:
        case isDeletedExpense:
        case isDeletedTransferO:
        case isDeletedTransferD:
          return res.status(400).json({ message: 'Falha ao excluir itens!' })
      }

      const deletedAccount = await Account.findByIdAndDelete({ _id: id, user: req.user.id })

      if (!deletedAccount) return res.status(404).json({ message: 'Conta não encontrada!' })

      res.status(200).json({ message: 'Conta removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover Conta', error })
    }
  }
}

export { AccountController }