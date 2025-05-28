import dayjs from 'dayjs'
import { Account, Category, Expense } from '../models/Finance.js'
import { statusFinance } from '../constants/Finance.js'
import { formatExpenseItem } from '../utils/format.js'

const ExpenseController = {
  // Criar uma nova despesa
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
      if (value > 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor negativo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const categoryById = await Category.findById({ _id: category, user, type: 'despesa' })
      if (!categoryById) return res.status(404).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })

      const dateNow = dayjs()
      // Se a data passada, for a de hoje e status conciliado deve adicionar o valor a conta.
      if ((dateNow.isSame(stringDate, 'day') && status === statusFinance.CONCILIATED) || status === statusFinance.CONCILIATED) {
        roolbackValue = value
        const updateBalance = await Account.findByIdAndUpdate(
          { _id: account, user },
          { $inc: { balance: value } }
        )
        if (!updateBalance) return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        updateBalanceSuccessfully = true
      }

      const newExpense = await Expense.create({
        category,
        value,
        status,
        executionDate: updateBalanceSuccessfully ? dateNow : null,
        date,
        description,
        account,
        user
      })

      res.status(201).json(formatExpenseItem(newExpense))
    } catch (error) {
      if (updateBalanceSuccessfully) {
        // Caso ocorra algum erro, mas o valor da conta foi atualizado, desfaz
        const { account } = req.body
        await Account.findOneAndUpdate(
          { _id: account, user },
          { $inc: { balance: -roolbackValue } }
        )
      }
      res.status(500).json({ message: 'Erro ao criar despesa', error })
    }
  },

  // Listar todas as despesas
  async getAll(req, res) {
    try {
      const { account_id } = req.query
      const filter = { user: req.user.id }

      if (account_id) {
        filter.account = account_id
      }

      const expenses = await Expense.find(filter)

      res.status(200).json(expenses.map(expense => formatExpenseItem(expense)))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao listar despesas', error })
    }
  },

  // Buscar uma despesa por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const expense = await Expense.findById({ _id: id, user: req.user.id })

      if (!expense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      res.status(200).json(formatExpenseItem(expense))
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar despesa', error })
    }
  },

  // Atualizar uma despesa
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

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (account) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description && typeof description !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      if (statusBody && typeof statusBody !== "number") return res.status(400).json({ message: 'O parametro `status` deve ser do tipo number!' })

      // Valida as regras de negocio
      if (value > 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor negativo.' })

      const date = dayjs(stringDate)
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })

      const categoryByName = await Category.findById({ _id: category, type: 'despesa', user })
      if (!categoryByName) return res.status(404).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo despesa!' })

      const accountByName = await Account.findById({ _id: account, user })
      if (!accountByName) return res.status(404).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })

      const expense = await Expense.findOne({ _id: id, user })
      if (!expense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      const currentyValue = expense.value
      const currentyStatus = expense.status
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

      const updatedExpense = await Expense.findByIdAndUpdate(id, {
        category: categoryByName.id,
        value,
        status,
        executionDate: updateBalanceSuccessfully ? dateNow : null,
        date,
        description,
        account: accountByName.id,
        user
      }, { new: true })

      return res.status(200).json(formatExpenseItem(updatedExpense))
    } catch (error) {
      const { account } = req.body

      if (updateBalanceSuccessfully) {
        switch (rollbackType) {
          case 'onlyStatusRemoved':
            await Account.findOneAndUpdate(
              { _id: account, user },
              { $inc: { balance: roolbackValue } }
            )
            break
          case 'valueChangeConciliatedStatusDifferent':
          case 'valueChangeConciliated':
          case 'onlyStatusAdded':
            await Account.findOneAndUpdate(
              { _id: account, user },
              { $inc: { balance: -roolbackValue } }
            )
            break
        }
      }
      res.status(500).json({ message: 'Erro ao atualizar despesa', error })
    }
  },

  // Deletar uma despesa
  async delete(req, res) {
    let updateBalanceSuccessfully = false
    let roolbackValue, roolbackAccount
    try {
      const { id } = req.params

      // Obtem a despesa pelo ID
      const expense = await Expense.findOne({ _id: id, user: req.user.id })
      if (!expense) return res.status(404).json({ message: 'Despesa não encontrada!' })

      if (expense.status === statusFinance.CONCILIATED) {
        roolbackAccount = expense.account
        roolbackValue = expense.value

        const updateBalance = await Account.findOneAndUpdate(
          { _id: expense.account, user: req.user.id },
          { $inc: { balance: expense.value } }
        )
        if (!updateBalance) {
          return res.status(400).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        }
        updateBalanceSuccessfully = true
      }

      await Expense.findByIdAndDelete({ _id: id, user: req.user.id })

      res.status(200).json({ message: 'Despesa removida com sucesso!' })
    } catch (error) {
      console.error(error)
      if (updateBalanceSuccessfully) {
        await Account.findOneAndUpdate(
          { _id: roolbackAccount, user: req.user.id },
          { $inc: { balance: -roolbackValue } }
        )
      }
      res.status(500).json({ message: 'Erro ao remover despesa', error })
    }
  }
}

export { ExpenseController }