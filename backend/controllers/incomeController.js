import { Income } from '../models/Finance.js'
import { categoryIsRegistered, formattedCategoryById } from '../utils/utilsCategory.js'
import { updateBalance, getIdAccountByName } from '../utils/utilsAccount.js'
import { statusFinance } from '../constants/Finance.js'
import dayjs from 'dayjs'

const IncomeController = {
  // Criar uma nova receita
  async create(req, res) {
    let updateBalanceSuccessfully = false
    let errorValue = 0
    try {
      const { category, status, value, date: stringDate, description, account: nameAccount } = req.body

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
      if (status) {
        if (typeof (status) !== "number") return res.status(400).json({ message: 'O parametro `status` deve ser do tipo number!' })
      }

      // Valida as regras de negocio
      if (value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const idCategory = await categoryIsRegistered(category, 'receita')
      if (!idCategory) {
        return res.status(400).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })
      }

      const accountId = await getIdAccountByName(nameAccount)
      if (!accountId) return res.status(400).json({ message: 'Conta informada não existe.' })

      const dateNow = dayjs()
      // Se a data passada, for a de hoje e status conciliado deve adicionar o valor a conta.
      if ((dateNow.isSame(stringDate) && status === statusFinance.CONCILIATED) || status === statusFinance.CONCILIATED) {
        errorValue = value
        const accountUpdated = await updateBalance(nameAccount, value)
        if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        updateBalanceSuccessfully = true
      }

      const newIncome = await Income.create({
        category: idCategory,
        value,
        status,
        executionDate: updateBalanceSuccessfully ? dateNow : null,
        date: date.toDate(),
        description,
        account: accountId
      })

      const formattedIncome = await formattedCategoryById(newIncome)
      res.status(201).json(formattedIncome)
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        const { account: nameAccount } = req.body
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
    let rollbackType = null
    let roolbackValue = 0
    let status

    const { category, status: statusBody, value, date: stringDate, description, account: nameAccount } = req.body

    try {
      const { id } = req.params

      // Valida os tipos
      if (typeof category !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof value !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof stringDate !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof nameAccount !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description && typeof description !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      if (statusBody && typeof statusBody !== "number") return res.status(400).json({ message: 'O parametro `status` deve ser do tipo number!' })

      // Valida regras de negócio
      if (value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data inválida.' })

      const idCategory = await categoryIsRegistered(category, 'receita')
      if (!idCategory) return res.status(400).json({ message: 'Categoria não encontrada ou inválida para receita.' })

      const accountId = await getIdAccountByName(nameAccount)
      if (!accountId) return res.status(400).json({ message: 'Conta informada não existe.' })

      const income = await Income.findById(id)
      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      const currentyValue = income.value
      const currentyStatus = income.status
      const dateNow = dayjs()

      if (typeof statusBody !== "number") {
        status = currentyStatus
      } else {
        status = statusBody
      }

      valueDifference = value - currentyValue

      // 1. Se valor mudou E status é conciliado
      if ((dateNow.isSame(stringDate, 'day') && status === statusFinance.CONCILIATED) || status === statusFinance.CONCILIATED) {
        if (currentyStatus !== statusFinance.CONCILIATED) {
          roolbackValue = value
          const accountUpdated = await updateBalance(nameAccount, value)
          if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
          updateBalanceSuccessfully = true
          rollbackType = 'valueChangeConciliatedStatusDifferent'
        } else {
          roolbackValue = valueDifference
          const accountUpdated = await updateBalance(nameAccount, valueDifference)
          if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
          updateBalanceSuccessfully = true
          rollbackType = 'valueChangeConciliated'
        }
      }

      // 2. Se status mudou de CONCILIATED para outro (mesmo valor)
      if (valueDifference === 0 && currentyStatus !== status) {
        if ((status === statusFinance.CONCILIATED && dateNow.isSame(stringDate, 'day')) || status === statusFinance.CONCILIATED) {
          roolbackValue = value
          const accountUpdated = await updateBalance(nameAccount, value)
          if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
          updateBalanceSuccessfully = true
          rollbackType = 'onlyStatusAdded'
        }
      }

      // Situação: Desfez conciliação
      if (currentyStatus === statusFinance.CONCILIATED && status !== statusFinance.CONCILIATED) {
        roolbackValue = currentyValue
        const accountUpdated = await updateBalance(nameAccount, -currentyValue)
        if (!accountUpdated) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        updateBalanceSuccessfully = true
        rollbackType = 'onlyStatusRemoved'
      }

      const newIncome = await Income.findByIdAndUpdate(id, {
        category: idCategory,
        value,
        status,
        executionDate: updateBalanceSuccessfully ? dateNow : null,
        date,
        description,
        account: accountId
      }, { new: true })

      const updateIncome = await formattedCategoryById(newIncome)
      return res.status(200).json(updateIncome)

    } catch (error) {
      if (updateBalanceSuccessfully) {
        switch (rollbackType) {
          case 'onlyStatusRemoved':
          case 'changeStatusAndValue':
          case 'valueChangeConciliated':
          case 'valueChangeConciliatedStatusDifferent':
            await updateBalance(nameAccount, roolbackValue)
            break
          case 'onlyStatusAdded':
            await updateBalance(nameAccount, -roolbackValue)
            break
        }
      }

      return res.status(500).json({ message: 'Erro ao atualizar receita', error })
    }
  },


  // Deletar uma receita
  async delete(req, res) {
    let updateBalanceSuccessfully = false
    let val, accont
    try {
      const { id } = req.params

      // Obtem a receita pelo ID
      const income = await Income.findById(id)
      if (!income) {
        return res.status(404).json({ message: 'Receita não encontrada!' })
      }

      const { value, account: accountId, status } = income
      val = value
      accont = accountId

      if (status === statusFinance.CONCILIATED) {
        // Atualiza o saldo da conta removendo o valor da receita
        const balanceUpdated = await updateBalance(null, -value, accountId)
        if (!balanceUpdated) {
          return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        }
        updateBalanceSuccessfully = true
      }

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