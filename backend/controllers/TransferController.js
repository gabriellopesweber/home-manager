import { statusFinance } from '../constants/Finance.js'
import { Transfer, Account } from '../models/Finance.js'
import dayjs from 'dayjs'

const TransferController = {
  async create(req, res) {
    const { originAccount, destinationAccount, status, value, date, description } = req.body
    const userId = req.user.id
    let updatedBalanceOrigin = false
    let updatedBalanceDestination = false

    try {
      if (!originAccount || !destinationAccount || !value || !date || typeof status !== "number") {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' })
      }
      if (originAccount === destinationAccount) {
        return res.status(400).json({ message: 'Contas de origem e destino devem ser diferentes.' })
      }
      if (value <= 0) {
        return res.status(400).json({ message: 'O valor da transferência deve ser positivo.' })
      }

      if (status !== statusFinance.CANCEL && status !== statusFinance.CONCILIATED && status !== statusFinance.PENDING) {
        return res.status(400).json({ message: 'o `status` deve ser 0 para conciliado, 1 para pendente e 2 para cancelado' })
      }

      const origin = await Account.findOne({ _id: originAccount, user: userId })
      const destination = await Account.findOne({ _id: destinationAccount, user: userId })

      if (!origin || !destination) {
        return res.status(404).json({ message: 'Conta de origem ou destino não encontrada ou sem permissão.' })
      }

      if (origin.balance < value) {
        return res.status(400).json({ messsage: 'Saldo insuficiente na conta de origem.' })
      }

      if (status === statusFinance.CONCILIATED) {
        origin.balance -= value
        destination.balance += value

        await origin.save()
        updatedBalanceOrigin = true
        await destination.save()
        updatedBalanceDestination = true
      }

      const transfer = await Transfer.create({
        originAccount,
        destinationAccount,
        value,
        date: dayjs(date).toDate(),
        description,
        user: userId
      })

      return res.status(201).json({
        id: transfer.id,
        originAccount: transfer.originAccount,
        destinationAccount: transfer.destinationAccount,
        value: transfer.value,
        date: transfer.date,
        description: transfer.description,
        user: transfer.user,
      })
    } catch (error) {
      // Roolback nos saldos se erro após alteração
      if (originAccount && destinationAccount && value) {
        if (updatedBalanceOrigin) await Account.findByIdAndUpdate(originAccount, { $inc: { balance: value } })
        if (updatedBalanceDestination) await Account.findByIdAndUpdate(destinationAccount, { $inc: { balance: -value } })
      }
      console.error(error)
      return res.status(500).json({ message: 'Erro ao criar transferência', error })
    }
  },

  async getAll(req, res) {
    const userId = req.user.id
    try {
      const transfers = await Transfer.find({ user: userId })
        .populate('originAccount destinationAccount')
        .sort({ date: -1 })

      return res.status(200).json(transfers)
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar transferências', error })
    }
  },

  async getById(req, res) {
    const userId = req.user.id
    const { id } = req.params

    try {
      const transfer = await Transfer.findOne({ _id: id, user: userId })
        .populate('originAccount destinationAccount')

      if (!transfer) return res.status(404).json({ message: 'Transferência não encontrada' })

      return res.status(200).json(transfer)
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar transferência', error })
    }
  },

  async update(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const { originAccount, destinationAccount, status: statusBody, value, date, description } = req.body
    let updatedBalanceOrigin = false
    let updatedBalanceDestination = false
    let rollbackType = null
    let roolbackValue = 0
    let valueDifference = 0
    let status

    try {

      if (!originAccount || !destinationAccount || !value || !date) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' })
      }

      if (statusBody) {
        if (typeof statusBody !== 'number') return res.status(404).json({ message: '`status` deve ser um number' })
        if (statusBody !== statusFinance.CANCEL && statusBody !== statusFinance.CONCILIATED && statusBody !== statusFinance.PENDING) {
          return res.status(400).json({ message: 'o `status` deve ser 0 para conciliado, 1 para pendente e 2 para cancelado' })
        }
      }

      const origin = await Account.findById(originAccount)
      const destination = await Account.findById(destinationAccount)

      if (!origin || !destination) return res.status(404).json({ message: 'Conta de origem ou destino inválida' })
      if (status === statusFinance.CONCILIATED && origin.balance < value) {
        return res.status(400).json({ message: 'Saldo insuficiente para atualizar' })
      }

      const oldTransfer = await Transfer.findOne({ _id: id, user: userId })
      if (!oldTransfer) return res.status(404).json({ message: 'Transferência não encontrada' })

      const currentyValue = oldTransfer.value
      const currentyStatus = oldTransfer.status
      const dateNow = dayjs()

      if (typeof statusBody !== "number") {
        status = currentyStatus
      } else {
        status = statusBody
      }

      valueDifference = value - currentyValue

      // 1. Se status for igual ao conciliado
      if (status === statusFinance.CONCILIATED) {
        if (currentyStatus !== statusFinance.CONCILIATED) {
          roolbackValue = value

          await Account.findByIdAndUpdate(oldTransfer.originAccount, { $inc: { balance: oldTransfer.value }, updateDate: dateNow })
          updatedBalanceOrigin = true
          await Account.findByIdAndUpdate(oldTransfer.destinationAccount, { $inc: { balance: -oldTransfer.value }, updateDate: dateNow })
          updatedBalanceDestination = true

          rollbackType = 'valueChangeConciliatedStatusDifferent'
        } else {
          roolbackValue = valueDifference

          await Account.findByIdAndUpdate(oldTransfer.originAccount, { $inc: { balance: valueDifference }, updateDate: dateNow })
          updatedBalanceOrigin = true
          await Account.findByIdAndUpdate(oldTransfer.destinationAccount, { $inc: { balance: -valueDifference }, updateDate: dateNow })
          updatedBalanceDestination = true

          rollbackType = 'valueChangeConciliated'
        }
      }

      // 2. Se status mudou de CONCILIATED para outro (mesmo valor)
      if (valueDifference === 0 && currentyStatus !== status && !updatedBalanceOrigin && !updatedBalanceDestination) {
        if ((status === statusFinance.CONCILIATED && dateNow.isSame(stringDate, 'day')) || status === statusFinance.CONCILIATED) {
          roolbackValue = value

          await Account.findByIdAndUpdate(oldTransfer.originAccount, { $inc: { balance: value }, updateDate: dateNow })
          updatedBalanceOrigin = true
          await Account.findByIdAndUpdate(oldTransfer.destinationAccount, { $inc: { balance: -value }, updateDate: dateNow })
          updatedBalanceDestination = true

          rollbackType = 'onlyStatusAdded'
        }
      }

      // Situação: Desfez conciliação
      if (currentyStatus === statusFinance.CONCILIATED && status !== statusFinance.CONCILIATED && !updatedBalanceOrigin && !updatedBalanceDestination) {
        roolbackValue = currentyValue

        await Account.findByIdAndUpdate(oldTransfer.originAccount, { $inc: { balance: currentyValue }, updateDate: dateNow })
        updatedBalanceOrigin = true
        await Account.findByIdAndUpdate(oldTransfer.destinationAccount, { $inc: { balance: -currentyValue }, updateDate: dateNow })
        updatedBalanceDestination = true

        rollbackType = 'onlyStatusRemoved'
      }

      const updated = await Transfer.findByIdAndUpdate(
        id,
        {
          originAccount,
          destinationAccount,
          status,
          value,
          date: dayjs(date).toDate(),
          description
        },
        { new: true }
      )

      return res.status(200).json(updated)
    } catch (error) {
      console.log(error)
      switch (rollbackType) {
        case 'onlyStatusRemoved':
        case 'valueChangeConciliatedStatusDifferent':
        case 'valueChangeConciliated':
        case 'onlyStatusAdded':
          if (updatedBalanceOrigin) await Account.findByIdAndUpdate(originAccount, { $inc: { balance: -roolbackValue } })
          if (updatedBalanceDestination) await Account.findByIdAndUpdate(destinationAccount, { $inc: { balance: roolbackValue } })
          break
      }

      return res.status(500).json({ message: 'Erro ao atualizar transferência', error })
    }
  },

  async delete(req, res) {
    const userId = req.user.id
    const { id } = req.params

    try {
      const transfer = await Transfer.findOne({ _id: id, user: userId })
      if (!transfer) return res.status(404).json({ message: 'Transferência não encontrada' })

      // Desfaz os saldos
      await Account.findByIdAndUpdate(transfer.originAccount, { $inc: { balance: transfer.value } })
      await Account.findByIdAndUpdate(transfer.destinationAccount, { $inc: { balance: -transfer.value } })

      await Transfer.findByIdAndDelete(id)

      return res.status(200).json({ message: 'Transferência removida com sucesso' })
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao remover transferência', error })
    }
  }
}

export { TransferController }