import { Income } from '../models/Finance.js'
import { categoryIsRegistered, formattedCategoryById } from '../utils/utilsCategory.js'
import { updateBalance } from '../utils/utilsAccount.js'
import dayjs from 'dayjs'

const IncomeController = {
  // Criar uma nova receita
  async create(req, res) {
    let updateBalanceSuccessfully = false
    let errorValue = 0
    try {
      const { category, value, date: stringDate, description, account: nameAccount } = req.body

      if (!category || !value || !stringDate || !nameAccount) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (nameAccount) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description) {
        if (typeof (description) !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      }

      // Valida as regras de negocio
      if (value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const idCategory = await categoryIsRegistered(category, 'receita')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })
      }

      errorValue = value
      const accountUpdated = await updateBalance(nameAccount, value)
      if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
      updateBalanceSuccessfully = true

      const newIncome = await Income.create({
        category: idCategory,
        value,
        date: date.toDate(),
        description,
        account: accountUpdated.id
      })

      const formattedIncome = await formattedCategoryById(newIncome)
      res.status(201).json(formattedIncome)
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        const { name: nameAccount } = req.body
        await updateBalance(nameAccount, -errorValue)
      }
      res.status(500).json({ message: 'Erro ao criar receita', error })
    }
  },

  // Listar todas as receitas
  async getAll(req, res) {
    try {
      const incomes = await Income.find()

      const updatedIncomes = await Promise.all(incomes.map(async (income) => {
        return formattedCategoryById(income)
      }))

      res.status(200).json(updatedIncomes)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar receitas', error })
    }
  },

  // Buscar uma receita por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const income = await Income.findById(id)

      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      const updatedIncome = await formattedCategoryById(income)

      res.status(200).json(updatedIncome)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar receita', error })
    }
  },

  // Atualizar uma receita
  async update(req, res) {
    let updateBalanceSuccessfully = false
    let valueDifference = 0
    const { category, value, date: stringDate, description, account: nameAccount } = req.body

    try {
      const { id } = req.params

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (nameAccount) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description) {
        if (typeof (description) !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      }

      // Valida as regras de negocio
      if (value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const idCategory = await categoryIsRegistered(category, 'receita')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })
      }

      // Obtem o valor já cadastrado
      const incomeById = await Income.findById(id)
      const oldValue = incomeById.value // 1000
      valueDifference = oldValue - value // Obtem a diferença de valores
      //800-1000 = -200

      const accountUpdated = await updateBalance(nameAccount, -valueDifference)
      // de 3502200 para 3502000
      if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
      updateBalanceSuccessfully = true

      const newIncome = await Income.findByIdAndUpdate(id, {
        categoria: idCategory,
        value,
        date,
        description,
        account: accountUpdated.id
      }, { new: true })

      if (!newIncome) return res.status(404).json({ message: 'Receita não encontrada!' })

      const updateIncome = await formattedCategoryById(newIncome)

      res.status(200).json(updateIncome)
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        await updateBalance(nameAccount, valueDifference)
      }
      res.status(500).json({ message: 'Erro ao atualizar receita', error })
    }
  },

  // Deletar uma receita
  async delete(req, res) {
    let updateBalanceSuccessfully = false
    let val, accont
    try {
      const { id } = req.params

      // Obtem a receita pelo ID
      const incomeById = await Income.findById(id)
      if (!incomeById) {
        return res.status(404).json({ message: 'Receita não encontrada!' })
      }

      const { value, account: accountId } = incomeById
      val = value
      accont = accountId

      // Atualiza o saldo da conta removendo o valor da receita
      const balanceUpdated = await updateBalance(null, -value, accountId)
      if (!balanceUpdated) {
        return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
      }
      updateBalanceSuccessfully = true

      // Deleta a receita
      await Income.findByIdAndDelete(id)

      res.status(200).json({ message: 'Receita removida com sucesso!' })
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Restaura o saldo se a remoção falhar
        await updateBalance(null, val, accont)
      }
      res.status(500).json({ message: 'Erro ao remover receita', error })
    }
  }
}

export { IncomeController }