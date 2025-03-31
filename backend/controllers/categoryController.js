import { Category } from '../models/Finance.js'

const CR = "receita"
const CD = "despesa"

const CategoryController = {
  // Criar uma nova categoria
  async create(req, res) {
    try {
      const { name, type } = req.body

      if (!name || !type) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const categorys = await Category.find()
      if (categorys) {
        categorys.map((category) => {
          if (category.name === name && category.type === type) {
            return res.status(409).json({
              message: 'Categoria já esta cadastrada'
            })
          }
        })
      }

      if (type !== CR && type !== CD) {
        return res.status(400).json({
          message: "Somente é aceito os seguintes tipos: receita ou despesa"
        })
      }

      const newCategory = await Category.create({ name, type })
      res.status(201).json(newCategory)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar categoria', error })
    }
  },

  // Listar todas as categorias
  async getAll(req, res) {
    try {
      const category = await Category.find()
      res.status(200).json(category)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar categorias', error })
    }
  },

  // Buscar uma categoria por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const category = await Category.findById(id)

      if (!category) return res.status(404).json({ message: 'Categoria não encontrada!' })

      res.status(200).json(category)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar categoria', error })
    }
  },

  // Atualizar uma categoria
  async update(req, res) {
    try {
      const { id } = req.params
      const { name, type } = req.body

      if (!name && !type) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      if (type !== CR && type !== CD) {
        return res.status(400).json({
          message: "Somente é aceito os seguintes tipos: receita ou despesa"
        })
      }

      const updateCategory = await Category.findByIdAndUpdate(
        id,
        { name, type },
        { new: true }
      )

      if (!updateCategory) return res.status(404).json({ message: 'Categoria não encontrada!' })

      res.status(200).json(updateCategory)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar categoria', error })
    }
  },

  // Deletar uma categoria
  async delete(req, res) {
    try {
      const { id } = req.params
      const deletedCategory = await Category.findByIdAndDelete(id)

      if (!deletedCategory) return res.status(404).json({ message: 'Categoria não encontrada!' })

      res.status(200).json({ message: 'Categoria removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover categoria', error })
    }
  }
}

export { CategoryController }