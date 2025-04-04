import dayjs from 'dayjs'
import { Account } from '../models/Finance.js'

const AccountController = {
  // Criar uma nova conta
  async create(req, res) {
    try {
      const { name, balance } = req.body

      if (!name || !balance) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const newAccount = await Account.create({ name, balance })
      res.status(201).json(newAccount)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar conta', error })
    }
  },

  // Listar todas as contas
  async getAll(req, res) {
    try {
      const accounts = await Account.find()
      res.status(200).json(accounts)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar conta', error })
    }
  },

  // Buscar uma conta por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const account = await Account.findById(id)

      if (!account) return res.status(404).json({ message: 'Conta não encontrada!' })

      res.status(200).json(account)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar conta', error })
    }
  },

  // Atualizar uma conta
  async update(req, res) {
    try {
      const { id } = req.params
      const { name, balance } = req.body

      if (!name && !balance) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      const dateNow = dayjs()
      const updateDate = dateNow.toDate()

      const updateAccount = await Account.findByIdAndUpdate(
        id,
        { name, balance, updateDate },
        { new: true }
      )

      if (!updateAccount) return res.status(404).json({ message: 'Conta não encontrada!' })

      res.status(200).json(updateAccount)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar conta', error })
    }
  },

  // Deletar uma conta
  async delete(req, res) {
    try {
      const { id } = req.params
      const deletedAccount = await Account.findByIdAndDelete(id)

      if (!deletedAccount) return res.status(404).json({ message: 'Conta não encontrada!' })

      res.status(200).json({ message: 'Conta removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ message: 'Erro ao remover Conta', error })
    }
  }
}

export { AccountController }