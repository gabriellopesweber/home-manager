const { Expense } = require('@/models/Finance')
const { categoryIsRegistered } = require('@/utils/utilsCategory')

const ExpenseController = {
  // Criar uma nova despesa
  async create(req, res) {
    try {
      const { categoria, valor, data, descricao, conta } = req.body

      if (!categoria || !valor || !data || !conta) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const idCategory = await categoryIsRegistered(categoria, 'despesa')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })
      }

      const date = new Date(data)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Data invalida.' })
      }

      const novaDespesa = await Expense.create({
        categoria: idCategory,
        valor,
        data: date,
        descricao,
        conta
      })
      res.status(201).json(novaDespesa)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar despesa', error })
    }
  },

  // Listar todas as despesas
  async getAll(req, res) {
    try {
      const despesas = await Expense.find()
      res.status(200).json(despesas)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar despesas', error })
    }
  },

  // Buscar uma despesa por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const despesa = await Expense.findById(id)

      if (!despesa) return res.status(404).json({ message: 'Despesa não encontrada!' })

      res.status(200).json(despesa)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar despesa', error })
    }
  },

  // Atualizar uma despesa
  async update(req, res) {
    try {
      const { id } = req.params
      const { categoria, valor, data, descricao, conta } = req.body

      const idCategory = await categoryIsRegistered(categoria, 'despesa')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })
      }

      const date = new Date(data)
      if (isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Data invalida.' })
      }

      const despesaAtualizada = await Expense.findByIdAndUpdate(id, {
        categoria: idCategory,
        valor,
        data: date,
        descricao,
        conta
      }, { new: true })

      if (!despesaAtualizada) return res.status(404).json({ message: 'Despesa não encontrada!' })

      res.status(200).json(despesaAtualizada)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar despesa', error })
    }
  },

  // Deletar uma despesa
  async delete(req, res) {
    try {
      const { id } = req.params
      const despesaRemovida = await Expense.findByIdAndDelete(id)

      if (!despesaRemovida) return res.status(404).json({ message: 'Despesa não encontrada!' })

      res.status(200).json({ message: 'Despesa removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover despesa', error })
    }
  }
}

module.exports = ExpenseController