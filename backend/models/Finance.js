import mongoose from 'mongoose'

// Modelo de Categoria
const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['receita', 'despesa'],
    required: true
  }
})

// Modelo de Receita
const IncomeSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  account: {
    type: String,
    required: true
  }
})

// Modelo de Despesa
const ExpenseSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  account: {
    type: String,
    required: true
  }
})

// Modelo de Transferência
const TransferSchema = new mongoose.Schema({
  originAccount: {
    type: String,
    required: true
  },
  destinationAccount: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  }
})

const Category = mongoose.model('Category', CategorySchema)
const Income = mongoose.model('Income', IncomeSchema)
const Expense = mongoose.model('Expense', ExpenseSchema)
const Transfer = mongoose.model('Transfer', TransferSchema)

export { Category, Income, Expense, Transfer }