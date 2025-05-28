import { Card } from '../models/Card.js'
import { validateRequiredFields } from '../utils/validations.js'
import { formatCardItem } from '../utils/format.js'

const isInvalidType = (field, type) => typeof field !== type

const CardController = {
  async create(req, res) {
    try {
      const {
        account_id,
        name,
        card_limit,
        due_date,
        closing_date,
        is_active
      } = req.body
      const user = req.user.id

      const validation = validateRequiredFields({
        account_id,
        name,
        due_date,
        closing_date,
        is_active
      })

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message })
      }

      if (isInvalidType(card_limit, 'number')) {
        return res.status(400).json({ message: '`card_limit` deve ser um numero valido' })
      }
      if (isInvalidType(is_active, 'boolean')) {
        return res.status(400).json({ message: '`is_active` deve ser um booleano (true ou false).' })
      }

      const newCard = await Card.create({
        user,
        account: account_id,
        name,
        limit: card_limit,
        dueDate: due_date,
        closingDate: closing_date,
        isActive: is_active
      })
      res.status(201).json(formatCardItem(newCard))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar cartão', error })
    }
  },

  async getAll(req, res) {
    try {
      const { account_id } = req.query

      const filter = { user: req.user.id }

      if (account_id) {
        if (account_id === 'null' || account_id === 'undefined') {
          return res.status(400).json({
            message: "O account_id esta invalido"
          })
        }
        filter.account = account_id
      }

      const cards = await Card.find(filter).sort({ name: 1 })
      res.status(200).json(cards.map(card => formatCardItem(card)))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar cartão', error })
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params

      const card = await Card.findOne({ _id: id, user: req.user.id })

      if (!card) return res.status(404).json({ message: 'Cartão não encontrado!' })

      res.status(200).json(formatCardItem(card))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar cartão', error })
    }
  },

  async update(req, res) {
    try {
      const user = req.user.id
      const { id } = req.params
      const {
        account_id,
        name,
        brand,
        type,
        last_four_digits,
        card_limit,
        due_date,
        closing_date,
        is_active
      } = req.body

      if (card_limit !== undefined && isInvalidType(card_limit, 'number')) {
        return res.status(400).json({ message: '`card_limit` deve ser um numero valido' })
      }
      if (type !== undefined) {
        if (isInvalidType(type, 'number')) return res.status(400).json({ message: '`type` deve ser um numero valido' })
        if (type < 1 || type > 2) return res.status(400).json({ message: '`type` somente aceita 1 (credito) e 2 (debito)' })
      }
      if (is_active !== undefined && isInvalidType(is_active, 'boolean')) {
        return res.status(400).json({ message: '`is_active` deve ser um booleano (true ou false).' })
      }

      const updateData = {}

      if (account_id !== undefined) updateData.account = account_id
      if (name !== undefined) updateData.name = name
      if (brand !== undefined) updateData.brand = brand
      if (type !== undefined) updateData.type = type
      if (last_four_digits !== undefined) updateData.numberLast4 = last_four_digits
      if (card_limit !== undefined) updateData.limit = card_limit
      if (due_date !== undefined) updateData.dueDate = due_date
      if (closing_date !== undefined) updateData.closingDate = closing_date
      if (is_active !== undefined) updateData.isActive = is_active

      const updateCard = await Card.findOneAndUpdate(
        { _id: id, user },
        updateData,
        { new: true }
      )

      if (!updateCard) return res.status(404).json({ message: 'Cartão não encontrado!' })

      res.status(200).json(formatCardItem(updateCard))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar cartão', error })
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params

      const isDeleted = await Card.findOneAndDelete({ _id: id, user: req.user.id })

      if (!isDeleted) return res.status(404).json({ message: 'Cartão não encontrado!' })

      res.status(200).json({ message: 'Cartão removido com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover Cartão', error })
    }
  }
}

export { CardController }
