import { Account, Category, Income } from '../models/Finance.js'
import { statusFinance } from '../constants/Finance.js'
import dayjs from 'dayjs'

const IncomeController = {
  // Criar uma nova receita
  async create(req, res) {
    let updateBalanceSuccessfully = false
    let roolbackValue = 0
    const user = req.user.id

    try {
      const { category, status, value, date: stringDate, description, account } = req.body

      if (!category || !value || !stringDate || !account) {
        return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser preenchidos!' })
      }

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (account) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
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

      const categoryById = await Category.findById({ _id: category, user, type: 'receita' })
      if (!categoryById) return res.status(404).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })

      const dateNow = dayjs()
      // Se a data passada, for a de hoje e status conciliado deve adicionar o valor a conta.
      if ((dateNow.isSame(stringDate, 'day') && status === statusFinance.CONCILIATED) || status === statusFinance.CONCILIATED) {
        roolbackValue = value
        const updateBalance = await Account.findByIdAndUpdate(
          { _id: account, user: req.user.id },
          { $inc: { balance: value } }
        )
        if (!updateBalance) return res.status(404).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        updateBalanceSuccessfully = true
      }

      const newIncome = await Income.create({
        category: categoryById.id,
        value,
        status,
        executionDate: updateBalanceSuccessfully ? dateNow : null,
        date: date.toDate(),
        description,
        account,
        user
      })

      res.status(201).json({
        id: newIncome.id,
        category: newIncome.category,
        value: newIncome.value,
        status: newIncome.status,
        executionDate: newIncome.executionDate,
        date: newIncome.date,
        description: newIncome.description,
        account: newIncome.account
      })
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        const { account } = req.body
        await Account.findOneAndUpdate(
          { _id: account, user: req.user.id },
          { $inc: { balance: -roolbackValue } }
        )
      }
      res.status(500).json({ message: 'Erro ao criar receita', error })
    }
  },

  // Listar todas as receitas
  async getAll(req, res) {
    try {
      const incomes = await Income.find({ user: req.user.id })

      res.status(200).json(incomes)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar receitas', error })
    }
  },

  // Buscar uma receita por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const income = await Income.findById({ _id: id, user: req.user.id })

      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      res.status(200).json(income)
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar receita', error })
    }
  },

  // Atualizar uma receita
  async update(req, res) {
    const user = req.user.id
    let updateBalanceSuccessfully = false
    let valueDifference = 0
    let rollbackType = null
    let roolbackValue = 0
    let status

    try {
      const { category, status: statusBody, value, date: stringDate, description, account } = req.body
      const { id } = req.params

      // Valida os tipos
      if (typeof category !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof value !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof stringDate !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof account !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description && typeof description !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      if (statusBody && typeof statusBody !== "number") return res.status(400).json({ message: 'O parametro `status` deve ser do tipo number!' })

      // Valida regras de negócio
      if (value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data inválida.' })

      const categoryByName = await Category.findById({ _id: category, type: 'receita', user })
      if (!categoryByName) return res.status(404).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })

      const accountByName = await Account.findById({ _id: account, user })
      if (!accountByName) return res.status(404).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })

      const income = await Income.findOne({ _id: id, user })
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

          accountByName.balance += value
          accountByName.updateDate = dateNow
          await accountByName.save()

          updateBalanceSuccessfully = true
          rollbackType = 'valueChangeConciliatedStatusDifferent'
        } else {
          roolbackValue = valueDifference

          accountByName.balance += valueDifference
          accountByName.updateDate = dateNow
          await accountByName.save()

          updateBalanceSuccessfully = true
          rollbackType = 'valueChangeConciliated'
        }
      }

      // 2. Se status mudou de CONCILIATED para outro (mesmo valor)
      if (valueDifference === 0 && currentyStatus !== status && !updateBalanceSuccessfully) {
        if ((status === statusFinance.CONCILIATED && dateNow.isSame(stringDate, 'day')) || status === statusFinance.CONCILIATED) {
          roolbackValue = value

          accountByName.balance += value
          accountByName.updateDate = dateNow
          await accountByName.save()

          updateBalanceSuccessfully = true
          rollbackType = 'onlyStatusAdded'
        }
      }

      // Situação: Desfez conciliação
      if (currentyStatus === statusFinance.CONCILIATED && status !== statusFinance.CONCILIATED && !updateBalanceSuccessfully) {
        roolbackValue = currentyValue

        accountByName.balance -= currentyValue
        accountByName.updateDate = dateNow
        await accountByName.save()

        updateBalanceSuccessfully = true
        rollbackType = 'onlyStatusRemoved'
      }

      const updatedIncome = await Income.findByIdAndUpdate(id, {
        category: categoryByName.id,
        value,
        status,
        executionDate: updateBalanceSuccessfully ? dateNow : null,
        date,
        description,
        account: accountByName.id,
        user
      }, { new: true })

      return res.status(200).json({
        id: updatedIncome.id,
        category: categoryByName.name,
        value: updatedIncome.value,
        status: updatedIncome.status,
        executionDate: updatedIncome.executionDate,
        date: updatedIncome.date,
        description: updatedIncome.description,
        account: accountByName.name
      })

    } catch (error) {
      const { account } = req.body

      if (updateBalanceSuccessfully) {
        switch (rollbackType) {
          case 'onlyStatusRemoved':
          case 'valueChangeConciliated':
          case 'valueChangeConciliatedStatusDifferent':
            await Account.findOneAndUpdate(
              { _id: account, user },
              { $inc: { balance: roolbackValue } }
            )
            break
          case 'onlyStatusAdded':
            await Account.findOneAndUpdate(
              { _id: account, user },
              { $inc: { balance: -roolbackValue } }
            )
            break
        }
      }

      return res.status(500).json({ message: 'Erro ao atualizar receita', error })
    }
  },

  // Deletar uma receita
  async delete(req, res) {
    let updateBalanceSuccessfully = false
    let roolbackValue, roolbackAccount
    try {
      const { id } = req.params

      const income = await Income.findOne({ _id: id, user: req.user.id })
      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      if (income.status === statusFinance.CONCILIATED) {
        roolbackAccount = income.account
        roolbackValue = income.value

        const updateBalance = await Account.findOneAndUpdate(
          { _id: income.account, user: req.user.id },
          { $inc: { balance: -income.value } }
        )
        if (!updateBalance) {
          return res.status(404).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        }
        updateBalanceSuccessfully = true
      }

      // Deleta a receita
      await Income.findByIdAndDelete({ _id: id, user: req.user.id })

      res.status(200).json({ message: 'Receita removida com sucesso!' })
    } catch (error) {
      if (updateBalanceSuccessfully) {
        await Account.findOneAndUpdate(
          { _id: roolbackAccount, user: req.user.id },
          { $inc: { balance: roolbackValue } }
        )
      }
      res.status(500).json({ message: 'Erro ao remover receita', error })
    }
  }
}

export { IncomeController }