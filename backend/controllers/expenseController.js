import dayjs from 'dayjs'
import { Expense } from '../models/Finance.js'
import { updateBalance } from '../utils/utilsAccount.js'
import { categoryIsRegistered, formattedCategoryById } from '../utils/utilsCategory.js'

const ExpenseController = {
  // Criar uma nova despesa
  async create(req, res) {
    let updateBalanceSuccessfully = false
    let errorValue = 0
    try {
      const { category, value, date: stringDate, description, account: nameAccount } = req.body

      if (!category || !value || !stringDate || !nameAccount) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (nameAccount) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description) {
        if (typeof (description) !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      }

      // Valida as regras de negocio
      if (value > 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor negativo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const idCategory = await categoryIsRegistered(category, 'despesa')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })
      }

      errorValue = value
      const accountUpdated = await updateBalance(nameAccount, value)
      if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
      updateBalanceSuccessfully = true

      const newExpense = await Expense.create({
        category: idCategory,
        value,
        date,
        description,
        account: accountUpdated.id
      })

      const formattedExpense = await formattedCategoryById(newExpense)
      res.status(201).json(formattedExpense)
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        const { account: nameAccount } = req.body
        await updateBalance(nameAccount, Math.abs(errorValue))
      }
      res.status(500).json({ message: 'Erro ao criar despesa', error })
    }
  },

  // Listar todas as despesas
  async getAll(req, res) {
    try {
      const expenses = await Expense.find()

      const updatedExpenses = await Promise.all(expenses.map(async (expense) => {
        return formattedCategoryById(expense)
      }))

      res.status(200).json(updatedExpenses)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar despesas', error })
    }
  },

  // Buscar uma despesa por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const expense = await Expense.findById(id)

      if (!expense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      const updatedExpense = await formattedCategoryById(expense)

      res.status(200).json(updatedExpense)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar despesa', error })
    }
  },

  // Atualizar uma despesa
  async update(req, res) {
    let updateBalanceSuccessfully = false
    let valueDifference = 0
    const { category, value, date: stringDate, description, account: nameAccount } = req.body

    try {
      const { id } = req.params

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (nameAccount) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description) {
        if (typeof (description) !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      }

      // Valida as regras de negocio
      if (value > 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor negativo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const idCategory = await categoryIsRegistered(category, 'despesa')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })
      }

      // Obtem o valor já cadastrado
      const incomeById = await Income.findById(id)
      const oldValue = incomeById.value
      valueDifference = oldValue - value // Obtem a diferença de valores

      const accountUpdated = await updateBalance(nameAccount, valueDifference)
      if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
      updateBalanceSuccessfully = true

      const updatedExpense = await Expense.findByIdAndUpdate(id, {
        category: idCategory,
        value,
        date,
        description,
        account: accountUpdated.id
      }, { new: true })

      if (!updatedExpense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      const formattedExpense = await formattedCategoryById(updatedExpense)

      res.status(200).json(formattedExpense)
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        await updateBalance(nameAccount, Math.abs(valueDifference))
      }
      res.status(500).json({ message: 'Erro ao atualizar despesa', error })
    }
  },

  // Deletar uma despesa
  async delete(req, res) {
    let updateBalanceSuccessfully = false
    let val, accont
    try {
      const { id } = req.params

      // Obtem a despesa pelo ID
      const expenseById = await Expense.findById(id)
      if (!expenseById) {
        return res.status(404).json({ message: 'Despesa não encontrada!' })
      }

      const { value, account: accountId } = expenseById
      val = value
      accont = accountId

      // Atualiza o saldo da conta removendo o valor da receita
      const balanceUpdated = await updateBalance(null, value, accountId)
      if (!balanceUpdated) {
        return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
      }
      updateBalanceSuccessfully = true

      const deleteExpense = await Expense.findByIdAndDelete(id)

      if (!deleteExpense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      res.status(200).json({ message: 'Despesa removida com sucesso!' })
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Restaura o saldo se a remoção falhar
        await updateBalance(null, Math.abs(val), accont)
      }
      res.status(500).json({ message: 'Erro ao remover despesa', error })
    }
  }
}

export { ExpenseController }