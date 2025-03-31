import { Category } from '../models/Finance.js'

async function categoryIsRegistered(name, type) {
  const category = await Category.findOne({ name, type })
  return category ? category.id : false
}

async function formattedCategoryById(expense) {
  const categoryById = await Category.findById(expense.category)
  return {
    ...expense.toObject(),
    category: categoryById ? categoryById.name : 'Categoria não encontrada'
  }
}

export {
  categoryIsRegistered,
  formattedCategoryById
}