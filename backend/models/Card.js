import mongoose from 'mongoose'

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