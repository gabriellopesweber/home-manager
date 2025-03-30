const { Category } = require('@/models/Finance')

async function categoryIsRegistered(name, tipo) {
  const category = await Category.findOne({ nome: name, tipo: tipo })

  return category ? category.id : false
}

module.exports = { categoryIsRegistered }