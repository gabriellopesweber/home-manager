import { Expense } from '../models/Finance.js'
import { categoryIsRegistered, formattedCategoryById } from '../utils/utilsCategory.js'

const ExpenseController = {
  // Criar uma nova despesa
  async create(req, res) {
    try {
      const { category, value, date: stringDate, description, account } = req.body

      if (!category || !value || !date || !account) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const idCategory = await categoryIsRegistered(category, 'despesa')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })
      }

      const date = new Date(stringDate)
      if (isNaN(validateDate.getTime())) {
        return res.status(400).json({ message: 'Data invalida.' })
      }

      const newExpense = await Expense.create({
        category: idCategory,
        value,
        date,
        description,
        account
      })

      const formattedExpense = await formattedCategoryById(newExpense)
      res.status(201).json(formattedExpense)
    } catch (error) {
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
    try {
      const { id } = req.params
      const { category, value, date: stringDate, description, account } = req.body

      if (!category || !value || !stringDate || !account) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const idCategory = await categoryIsRegistered(category, 'despesa')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })
      }

      const date = new Date(stringDate)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Data invalida.' })
      }

      const updatedExpense = await Expense.findByIdAndUpdate(id, {
        category: idCategory,
        value,
        date,
        description,
        account
      }, { new: true })

      if (!updatedExpense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      const formattedExpense = await formattedCategoryById(updatedExpense)

      res.status(200).json(formattedExpense)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar despesa', error })
    }
  },

  // Deletar uma despesa
  async delete(req, res) {
    try {
      const { id } = req.params
      const deleteExpense = await Expense.findByIdAndDelete(id)

      if (!deleteExpense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      res.status(200).json({ message: 'Despesa removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover despesa', error })
    }
  }
}

export { ExpenseController }