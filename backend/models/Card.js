import mongoose from 'mongoose'
import { typeCard } from '../constants/Finance.js'

const CardSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    enum: ['Visa', 'Mastercard', 'Elo', 'American Express', 'Outros'],
    default: 'Outros'
  },
  type: {
    type: Number,
    enum: [typeCard.CREDIT, typeCard.DEBIT],
    required: true
  },
  numberLast4: {
    type: String,
    minlength: 4,
    maxlength: 4,
    required: true
  },
  limit: {
    type: Number,
    default: 0
  },
  dueDate: {
    type: Number,
    min: 1,
    max: 31
  },
  closingDate: {
    type: Number,
    min: 1,
    max: 31
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const Card = mongoose.model('Card', CardSchema)

export { Card }