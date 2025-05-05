import mongoose from 'mongoose'
import { statusFinance } from '../constants/Finance.js'

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
  },
  default: {
    type: Boolean,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
})

// Modelo de Receita
const IncomeSchema = new mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  status: {
    type: Number,
    enum: [
      statusFinance.PENDING,
      statusFinance.CONCILIATED,
      statusFinance.CANCEL
    ],
    default: statusFinance.PENDING,
  },
  value: {
    type: Number,
    required: true
  },
  executionDate: {
    type: Date,
    default: 'false',
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
  status: {
    type: Number,
    enum: [
      statusFinance.PENDING,
      statusFinance.CONCILIATED,
      statusFinance.CANCEL
    ],
    default: statusFinance.PENDING,
  },
  value: {
    type: Number,
    required: true
  },
  executionDate: {
    type: Date,
    default: '',
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

// Modelo de Conta
const AccountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true
  },
  openingBalance: {
    type: Number,
    required: false,
    default: 0
  },
  updateDate: {
    type: Date,
    default: ''
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

// Modelo de Transferência
const TransferSchema = new mongoose.Schema({
  originAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  destinationAccount: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  status: {
    type: Number,
    enum: [
      statusFinance.PENDING,
      statusFinance.CONCILIATED,
      statusFinance.CANCEL
    ],
    default: statusFinance.PENDING,
  },
  updateDate: {
    type: Date,
    default: ''
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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

AccountSchema.index({ name: 1, user: 1 }, { unique: true })

const Category = mongoose.model('Category', CategorySchema)
const Income = mongoose.model('Income', IncomeSchema)
const Expense = mongoose.model('Expense', ExpenseSchema)
const Transfer = mongoose.model('Transfer', TransferSchema)
const Account = mongoose.model('Account', AccountSchema)

export { Category, Income, Expense, Transfer, Account }