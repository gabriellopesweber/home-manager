import { Account, Category, Income } from '../models/Finance.js'
import { statusFinance } from '../constants/Finance.js'
import { validateRequiredFields } from '../utils/validations.js'
import { formatIncomeItem } from '../utils/format.js'
import mongoose from 'mongoose'
import dayjs from 'dayjs'

const IncomeController = {
  // Criar uma nova receita
  async create(req, res) {
    let updateBalanceSuccessfully = false
    let roolbackValue = 0
    const user = req.user.id

    try {
      const {
        category,
        status,
        value,
        date: stringDate,
        description,
        account,
        is_recurring,
        recurrence_type,
        recurrence_end_date
      } = req.body

      const validation = validateRequiredFields({ category, value, stringDate, account })
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message })
      }

      // Valida o tipo dos parametros recebidos
      if (typeof (category) !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (typeof (value) !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (typeof (stringDate) !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (typeof (account) !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description && typeof (description) !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      if (status && typeof (status) !== "number") return res.status(400).json({ message: 'O parametro `status` deve ser do tipo number!' })
      if (is_recurring && typeof is_recurring !== "boolean") return res.status(400).json({ message: 'O parametro `is_recurring` deve ser do tipo boolean!' })
      if (recurrence_type && typeof recurrence_type !== "string") return res.status(400).json({ message: 'O parametro `recurrence_type` deve ser do tipo String!' })
      if (recurrence_end_date && typeof recurrence_end_date !== "string") return res.status(400).json({ message: 'O parametro `recurrence_end_date` deve ser do tipo String!' })

      if (value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      let date = dayjs(stringDate).startOf('day')
      if (!date.isValid()) return res.status(400).json({ message: 'Data invalida.' })
      const dateStr = date.format('YYYY-MM-DD')

      const categoryById = await Category.findById({ _id: category, user, type: 'receita' })
      if (!categoryById) return res.status(404).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })

      const dateNow = dayjs().startOf('day')
      // Se a data passada, for a de hoje e status conciliado deve adicionar o valor a conta.
      if ((dateNow.isSame(date, 'day') && status === statusFinance.CONCILIATED) || status === statusFinance.CONCILIATED) {
        roolbackValue = value
        const updateBalance = await Account.findByIdAndUpdate(
          { _id: account, user: req.user.id },
          { $inc: { balance: value } }
        )
        if (!updateBalance) return res.status(404).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })
        updateBalanceSuccessfully = true
      }

      let newIncomes = []

      if (is_recurring && recurrence_end_date) {
        let recurrenceGroupId = new mongoose.Types.ObjectId()
        let recurrenceEndDate = dayjs(recurrence_end_date).startOf('day')
        if (!recurrenceEndDate.isValid()) return res.status(400).json({ message: 'Data de término da recorrência inválida.' })

        let currentDate = date.clone()
        let incomes = []

        while (currentDate.isSameOrBefore(recurrenceEndDate, 'day')) {
          const newIncome = {
            category: categoryById.id,
            value,
            status,
            executionDate: updateBalanceSuccessfully ? currentDate.format('YYYY-MM-DD') : null,
            recurrenceGroupId,
            isRecurring: true,
            recurrenceType: recurrence_type,
            recurrenceEndDate: recurrenceEndDate.format('YYYY-MM-DD'),
            date: currentDate.format('YYYY-MM-DD'),
            description,
            account,
            user
          }
          incomes.push(newIncome)

          // Avança para o próximo período de recorrência
          if (recurrence_type === 'mensal') {
            currentDate = currentDate.add(1, 'month')
          } else if (recurrence_type === 'semanal') {
            currentDate = currentDate.add(1, 'week')
          } else if (recurrence_type === 'anual') {
            currentDate = currentDate.add(1, 'year')
          } else {
            break
          }
        }

        newIncomes.push(...await Income.insertMany(incomes))
      } else {
        newIncomes.push(await Income.create({
          category: categoryById.id,
          value,
          status,
          executionDate: updateBalanceSuccessfully ? dateStr : null,
          isRecurring: false,
          date: dateStr,
          description,
          account,
          user
        }))
      }

      res.status(201).json(newIncomes.map(income => formatIncomeItem(income)))
    } catch (error) {
      console.log(error)
      if (updateBalanceSuccessfully) {
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
      const { account_id } = req.query
      const filter = { user: req.user.id }

      if (account_id) {
        filter.account = account_id
      }

      const incomes = await Income.find(filter)

      res.status(200).json(incomes.map(income => formatIncomeItem(income)))
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: 'Erro ao listar receitas', error })
    }
  },

  // Buscar uma receita por ID
  async getById(req, res) {
    try {
      const { id } = req.params
      const income = await Income.findById({ _id: id, user: req.user.id })

      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      res.status(200).json(formatIncomeItem(income))
    } catch (error) {
      console.log(error)
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
      const {
        category,
        status: statusBody,
        value,
        date: stringDate,
        description,
        account,
        is_only_this_recurrence,
        recurrence_type,
        recurrence_end_date
      } = req.body
      const { id, recurrence_group_id } = req.params

      if (!id && !recurrence_group_id) {
        return res.status(400).json({ message: 'O parametro `id` ou `recurrence_group_id` deve ser informado!' })
      }

      // Valida os tipos
      if (category && typeof category !== "string") return res.status(400).json({ message: 'O parametro `category` deve ser do tipo String!' })
      if (value && typeof value !== "number") return res.status(400).json({ message: 'O parametro `value` deve ser do tipo Number!' })
      if (stringDate & typeof stringDate !== "string") return res.status(400).json({ message: 'O parametro `date` deve ser do tipo String!' })
      if (account & typeof account !== "string") return res.status(400).json({ message: 'O parametro `account` deve ser do tipo String!' })
      if (description && typeof description !== "string") return res.status(400).json({ message: 'O parametro `description` deve ser do tipo String!' })
      if (statusBody && typeof statusBody !== "number") return res.status(400).json({ message: 'O parametro `status` deve ser do tipo number!' })
      if (is_only_this_recurrence && typeof is_only_this_recurrence !== "boolean") return res.status(400).json({ message: 'O parametro `is_only_this_recurrence` deve ser do tipo boolean!' })
      if (recurrence_type && typeof recurrence_type !== "string") return res.status(400).json({ message: 'O parametro `recurrence_type` deve ser do tipo String!' })
      if (recurrence_end_date && typeof recurrence_end_date !== "string") return res.status(400).json({ message: 'O parametro `recurrence_end_date` deve ser do tipo String!' })

      if (value && value < 0) return res.status(400).json({ message: 'O parametro `value` deve ser um valor positivo.' })

      const date = dayjs(stringDate).startOf('day')
      if (!date.isValid()) return res.status(400).json({ message: 'Data inválida.' })
      const dateStr = date.format('YYYY-MM-DD')

      const categoryByName = await Category.findById({ _id: category, type: 'receita', user })
      if (!categoryByName) return res.status(404).json({ message: 'A categoria informada não esta cadastrada ou não pertence ao tipo receita!' })

      const accountByName = await Account.findById({ _id: account, user })
      if (!accountByName) return res.status(404).json({ message: 'Conta informada não existe. O saldo não foi alterado.' })

      const income = await Income.findOne({ _id: id, user })
      if (!income) return res.status(404).json({ message: 'Receita não encontrada!' })

      const currentyValue = income.value
      const currentyStatus = income.status
      const dateNow = dayjs().startOf('day')
      const dateNowStr = dateNow.format('YYYY-MM-DD')

      if (typeof statusBody !== "number") {
        status = currentyStatus
      } else {
        status = statusBody
      }

      valueDifference = value - currentyValue

      // 1. Se valor mudou E status é conciliado
      if ((dateNow.isSame(date, 'day') && status === statusFinance.CONCILIATED) || status === statusFinance.CONCILIATED) {
        if (currentyStatus !== statusFinance.CONCILIATED) {
          roolbackValue = value

          accountByName.balance += value
          accountByName.updateDate = dateNowStr
          await accountByName.save()

          updateBalanceSuccessfully = true
          rollbackType = 'valueChangeConciliatedStatusDifferent'
        } else {
          roolbackValue = valueDifference

          accountByName.balance += valueDifference
          accountByName.updateDate = dateNowStr
          await accountByName.save()

          updateBalanceSuccessfully = true
          rollbackType = 'valueChangeConciliated'
        }
      }

      // 2. Se status mudou de CONCILIATED para outro (mesmo valor)
      if (valueDifference === 0 && currentyStatus !== status && !updateBalanceSuccessfully) {
        if ((status === statusFinance.CONCILIATED && dateNow.isSame(date, 'day')) || status === statusFinance.CONCILIATED) {
          roolbackValue = value

          accountByName.balance += value
          accountByName.updateDate = dateNowStr
          await accountByName.save()

          updateBalanceSuccessfully = true
          rollbackType = 'onlyStatusAdded'
        }
      }

      // Situação: Desfez conciliação
      if (currentyStatus === statusFinance.CONCILIATED && status !== statusFinance.CONCILIATED && !updateBalanceSuccessfully) {
        roolbackValue = currentyValue

        accountByName.balance -= currentyValue
        accountByName.updateDate = dateNowStr
        await accountByName.save()

        updateBalanceSuccessfully = true
        rollbackType = 'onlyStatusRemoved'
      }

      const returnUpdateIncome = []
      if (recurrence_group_id) {
        const incomes = await Income.find({ recurrenceGroupId: recurrence_group_id, user })
        if (!incomes.length) return res.status(404).json({ message: 'Nenhuma receita recorrente encontrada.' })

        for (const [i, income] of incomes) {
          if (category) income.category = category
          if (value) income.value = value
          if (status) {
            if (i === 0) {
              income.status = status
            } else {
              income.status = statusFinance.PENDING
            }
          }
          if (description) income.description = description
          if (account) income.account = account
          if (recurrence_type) income.recurrenceType = recurrence_type
          if (recurrence_end_date) income.recurrenceEndDate = recurrence_end_date

          returnUpdateIncome.push(await income.save())
        }
      } else {
        const income = await Income.find({ id, user })
        if (!income.length) return res.status(404).json({ message: 'Nenhuma receita recorrente encontrada.' })

        if (category) income.category = category
        if (value) income.value = value
        if (status) income.status = status
        if (description) income.description = description
        if (account) income.account = account
        if (dateStr) income.date = dateStr
        if (updateBalanceSuccessfully) income.executionDate = dateNowStr

        returnUpdateIncome.push(await income.save())
      }

      return res.status(200).json(updatedIncomes.map(formatIncomeItem))
    } catch (error) {
      console.log(error)
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

        const account = await Account.findOne({
          _id: income.account,
          user: req.user.id
        })
        if (!account) {
          return res.status(404).json({ message: 'Conta associada não existe. O saldo não foi alterado.' })
        }

        if (income.value > 0)
          account.balance = account.balance - income.value
        else {
          account.balance = account.balance + Math.abs(income.value)
        }

        if (!await account.save()) {
          throw new Error()
        }

        updateBalanceSuccessfully = true
      }

      await Income.findByIdAndDelete({ _id: id, user: req.user.id })

      res.status(200).json({ message: 'Receita removida com sucesso!' })
    } catch (error) {
      console.log(error)
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
