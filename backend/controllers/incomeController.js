import { Income } from '../models/Finance.js'
import { categoryIsRegistered, formattedCategoryById } from '../utils/utilsCategory.js'

const IncomeController = {
  // Criar uma nova receita
  async create(req, res) {
    try {
      const { categoria, valor, data, descricao, conta } = req.body

      if (!categoria || !valor || !data || !conta) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const idCategory = await categoryIsRegistered(categoria, 'receita')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })
      }

      const date = new Date(data)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Data invalida.' })
      }

      const newIncome = await Income.create({
        categoria: idCategory,
        valor,
        data: date,
        descricao,
        conta
      })

      const formattedIncome = await formattedCategoryById(newIncome)
      res.status(201).json(formattedIncome)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar receita', error })
    }
  },

  // Listar todas as receitas
  async getAll(req, res) {
    try {
      const incomes = await Income.find()

      const updatedIncomes = await Promise.all(incomes.map(async (income) => {
        return formattedCategoryById(income)
      }))

      res.status(200).json(updatedIncomes)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar receitas', error })
    }
  },

  // Buscar uma receita por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const income = await Income.findById(id)

      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      const updateIncome = await formattedCategoryById(income)

      res.status(200).json(updateIncome)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar receita', error })
    }
  },

  // Atualizar uma receita
  async update(req, res) {
    try {
      const { id } = req.params
      const { categoria, valor, data, descricao, conta } = req.body

      const idCategory = await categoryIsRegistered(categoria, 'receita')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })
      }

      const date = new Date(data)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Data invalida.' })
      }

      const newIncome = await Income.findByIdAndUpdate(id, {
        categoria: idCategory,
        valor,
        data: date,
        descricao,
        conta
      }, { new: true })

      if (!newIncome) return res.status(404).json({ message: 'Receita não encontrada!' })

      const updateIncome = await formattedCategoryById(newIncome)

      res.status(200).json(updateIncome)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar receita', error })
    }
  },

  // Deletar uma receita
  async delete(req, res) {
    try {
      const { id } = req.params
      const deleteIncome = await Income.findByIdAndDelete(id)

      if (!deleteIncome) return res.status(404).json({ message: 'receita não encontrada!' })

      res.status(200).json({ message: 'Receita removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover receita', error })
    }
  }
}

export { IncomeController }