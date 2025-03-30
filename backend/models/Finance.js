const mongoose = require('mongoose')

// Modelo de Categoria
const CategorySchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['receita', 'despesa'],
    required: true
  }
})

// Modelo de Receita
const IncomeSchema = new mongoose.Schema({
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  descricao: {
    type: String
  },
  conta: {
    type: String,
    required: true
  }
})

// Modelo de Despesa
const ExpenseSchema = new mongoose.Schema({
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  descricao: {
    type: String
  },
  conta: {
    type: String,
    required: true
  }
})

// Modelo de Transferência
const TransferSchema = new mongoose.Schema({
  contaOrigem: {
    type: String,
    required: true
  },
  contaDestino: {
    type: String,
    required: true
  },
  valor: {
    type: Number,
    required: true
  },
  data: {
    type: Date,
    required: true
  },
  descricao: {
    type: String
  }
})

const Category = mongoose.model('Category', CategorySchema)
const Income = mongoose.model('Income', IncomeSchema)
const Expense = mongoose.model('Expense', ExpenseSchema)
const Transfer = mongoose.model('Transfer', TransferSchema)

module.exports = { Category, Income, Expense, Transfer }