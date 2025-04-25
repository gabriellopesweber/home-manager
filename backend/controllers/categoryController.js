import { Category } from '../models/Finance.js'
import { formatCategoryItem } from '../utils/format.js'

const CR = "receita"
const CD = "despesa"

const CategoryController = {
  // Criar uma nova categoria
  async create(req, res) {
    try {
      const { name, type } = req.body
      const user = req.user.id

      if (!name || !type) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const categories = await Category.find({ user })

      const categoryExists = categories.some(category =>
        category.name === name && category.type === type
      )

      if (categoryExists) {
        return res.status(409).json({
          message: 'Categoria já está cadastrada.'
        })
      }

      if (type !== CR && type !== CD) {
        return res.status(400).json({
          message: "Somente é aceito os seguintes tipos: receita ou despesa"
        })
      }

      const newCategory = await Category.create({ name, type, user })
      res.status(201).json(formatCategoryItem(newCategory))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar categoria', error })
    }
  },

  // Listar todas as categorias
  async getAll(req, res) {
    try {
      const { type } = req.query

      const filter = { user: req.user.id }

      if (type) {
        filter.type = type
      }

      const category = await Category.find(filter)
      res.status(200).json(category.map(category => formatCategoryItem(category)))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar categorias', error })
    }
  },

  // Buscar uma categoria por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const category = await Category.findById({ _id: id, user: req.user.id })

      if (!category) return res.status(404).json({ message: 'Categoria não encontrada!' })

      res.status(200).json(formatCategoryItem(category))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar categoria', error })
    }
  },

  // Atualizar uma categoria
  async update(req, res) {
    try {
      const { id } = req.params
      const { name, type } = req.body
      const user = req.user.id

      if (!name && !type) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      if (type !== CR && type !== CD) {
        return res.status(400).json({
          message: "Somente é aceito os seguintes tipos: receita ou despesa"
        })
      }

      const categories = await Category.find({ user })

      const categoryExists = categories.some(category =>
        category.name === name && category.type === type
      )

      if (categoryExists) {
        return res.status(409).json({
          message: 'Categoria já está cadastrada.'
        })
      }

      const updateCategory = await Category.findByIdAndUpdate(
        id,
        { name, type, user },
        { new: true }
      )

      if (!updateCategory) return res.status(404).json({ message: 'Categoria não encontrada!' })

      res.status(200).json(formatCategoryItem(updateCategory))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar categoria', error })
    }
  },

  // Deletar uma categoria
  async delete(req, res) {
    try {
      const { id } = req.params
      const deletedCategory = await Category.findByIdAndDelete({ _id: id, user: req.user.id })

      if (!deletedCategory) return res.status(404).json({ message: 'Categoria não encontrada!' })

      res.status(200).json({ message: 'Categoria removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover categoria', error })
    }
  }
}

export { CategoryController }