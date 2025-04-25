import { statusFinance } from '../constants/Finance.js'
import { Transfer, Account } from '../models/Finance.js'
import { formatTransferItem } from '../utils/format.js'
import dayjs from 'dayjs'

const TransferController = {
  async create(req, res) {
    const { origin_account, destination_account, status, value, date, description } = req.body
    const userId = req.user.id
    let updatedBalanceOrigin = false
    let updatedBalanceDestination = false

    try {
      if (!origin_account || !destination_account || !value || !date || typeof status !== "number") {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' })
      }
      if (origin_account === destination_account) {
        return res.status(400).json({ message: 'Contas de origem e destino devem ser diferentes.' })
      }
      if (value <= 0) {
        return res.status(400).json({ message: 'O valor da transferência deve ser positivo.' })
      }

      if (status !== statusFinance.CANCEL && status !== statusFinance.CONCILIATED && status !== statusFinance.PENDING) {
        return res.status(400).json({ message: 'o `status` deve ser 0 para conciliado, 1 para pendente e 2 para cancelado' })
      }

      const origin = await Account.findOne({ _id: origin_account, user: userId })
      const destination = await Account.findOne({ _id: destination_account, user: userId })

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
        originAccount: origin_account,
        destinationAccount: destination_account,
        value,
        date: dayjs(date).toDate(),
        description,
        user: userId
      })

      return res.status(201).json(formatTransferItem(transfer))
    } catch (error) {
      // Roolback nos saldos se erro após alteração
      if (origin_account && destination_account && value) {
        if (updatedBalanceOrigin) await Account.findByIdAndUpdate(origin_account, { $inc: { balance: value } })
        if (updatedBalanceDestination) await Account.findByIdAndUpdate(destination_account, { $inc: { balance: -value } })
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

      return res.status(200).json(transfers.map(transfer => formatTransferItem(transfer)))
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

      return res.status(200).json(formatTransferItem(transfer))
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar transferência', error })
    }
  },

  async update(req, res) {
    const userId = req.user.id
    const { id } = req.params
    const { origin_account, destination_account, status: statusBody, value, date, description } = req.body

    let updatedBalanceOrigin = false
    let updatedBalanceDestination = false
    let rollbackType = null
    let roolbackValue = 0
    let valueDifference = 0
    let status

    try {
      if (!origin_account || !destination_account || !value || !date) {
        return res.status(400).json({ message: 'Campos obrigatórios ausentes.' })
      }

      if (typeof statusBody !== 'undefined') {
        if (typeof statusBody !== 'number') return res.status(400).json({ message: '`status` deve ser um number' })
        if (![statusFinance.CANCEL, statusFinance.CONCILIATED, statusFinance.PENDING].includes(statusBody)) {
          return res.status(400).json({ message: 'Status inválido. Use 0 (conciliado), 1 (pendente) ou 2 (cancelado).' })
        }
      }

      const origin = await Account.findOne({ _id: origin_account, user: userId })
      const destination = await Account.findOne({ _id: destination_account, user: userId })

      if (!origin || !destination) return res.status(404).json({ message: 'Conta de origem ou destino inválida.' })

      const oldTransfer = await Transfer.findOne({ _id: id, user: userId })
      if (!oldTransfer) return res.status(404).json({ message: 'Transferência não encontrada.' })

      const currentyValue = oldTransfer.value
      const currentyStatus = oldTransfer.status
      const dateNow = dayjs()
      const stringDate = dayjs(date)

      status = typeof statusBody === 'number' ? statusBody : currentyStatus
      valueDifference = value - currentyValue

      // Cenário 1: Ambos conciliados, mas valor mudou
      if (currentyStatus === statusFinance.CONCILIATED && status === statusFinance.CONCILIATED && valueDifference !== 0) {
        if (origin.balance < Math.abs(valueDifference)) return res.status(400).json({ message: 'Saldo insuficiente para atualizar.' })
        roolbackValue = valueDifference

        await Account.findByIdAndUpdate(origin_account, { $inc: { balance: valueDifference }, updateDate: dateNow.toDate() })
        await Account.findByIdAndUpdate(destination_account, { $inc: { balance: -valueDifference }, updateDate: dateNow.toDate() })

        updatedBalanceOrigin = true
        updatedBalanceDestination = true
        rollbackType = 'valueChangeConciliated'
      }

      // Cenário 2: Antes não conciliado, agora conciliado (novo ou mesmo valor)
      else if (currentyStatus !== statusFinance.CONCILIATED && status === statusFinance.CONCILIATED) {
        if (valueDifference !== 0) {
          if (origin.balance < Math.abs(valueDifference)) return res.status(400).json({ message: 'Saldo insuficiente para atualizar.' })
          roolbackValue = valueDifference

          await Account.findByIdAndUpdate(origin_account, { $inc: { balance: -valueDifference }, updateDate: dateNow.toDate() })
          await Account.findByIdAndUpdate(destination_account, { $inc: { balance: valueDifference }, updateDate: dateNow.toDate() })

          updatedBalanceOrigin = true
          updatedBalanceDestination = true
          rollbackType = 'StatusAddedAndValueDifference'
        } else {
          if (origin.balance < value) return res.status(400).json({ message: 'Saldo insuficiente para atualizar.' })
          roolbackValue = value

          await Account.findByIdAndUpdate(origin_account, { $inc: { balance: -value }, updateDate: dateNow.toDate() })
          await Account.findByIdAndUpdate(destination_account, { $inc: { balance: value }, updateDate: dateNow.toDate() })

          updatedBalanceOrigin = true
          updatedBalanceDestination = true
          rollbackType = 'onlyStatusAdded'
        }
      }

      // Cenário 3: Conciliação removida
      else if (currentyStatus === statusFinance.CONCILIATED && status !== statusFinance.CONCILIATED) {
        if (valueDifference !== 0) {
          // Conciliação removida, mas saldo alterado
          if (origin.balance < Math.abs(valueDifference)) return res.status(400).json({ message: 'Saldo insuficiente para atualizar.' })
          roolbackValue = valueDifference

          await Account.findByIdAndUpdate(origin_account, { $inc: { balance: valueDifference }, updateDate: dateNow.toDate() })
          await Account.findByIdAndUpdate(destination_account, { $inc: { balance: -valueDifference }, updateDate: dateNow.toDate() })

          updatedBalanceOrigin = true
          updatedBalanceDestination = true

          rollbackType = 'statusRemovedAndValueDifference'
        } else {
          // Cenário 4: Conciliação removida
          if (origin.balance < currentyValue) return res.status(400).json({ message: 'Saldo insuficiente para atualizar.' })
          roolbackValue = currentyValue

          await Account.findByIdAndUpdate(origin_account, { $inc: { balance: currentyValue }, updateDate: dateNow.toDate() })
          await Account.findByIdAndUpdate(destination_account, { $inc: { balance: -currentyValue }, updateDate: dateNow.toDate() })

          updatedBalanceOrigin = true
          updatedBalanceDestination = true

          rollbackType = 'onlyStatusRemoved'
        }
      }

      const updated = await Transfer.findByIdAndUpdate(
        id,
        {
          originAccount: origin_account,
          destinationAccount: destination_account,
          status,
          value,
          date: stringDate.toDate(),
          description
        },
        { new: true }
      )

      return res.status(200).json(formatTransferItem(updated))
    } catch (error) {
      console.error('Erro ao atualizar transferência:', error)

      // Reversão de saldo em caso de erro
      switch (rollbackType) {
        case 'onlyStatusRemoved':
        case 'statusRemovedAndValueDifference':
        case 'valueChangeConciliated':
          if (updatedBalanceOrigin) await Account.findByIdAndUpdate(origin_account, { $inc: { balance: -roolbackValue } })
          if (updatedBalanceDestination) await Account.findByIdAndUpdate(destination_account, { $inc: { balance: roolbackValue } })
          break
        case 'onlyStatusAdded':
        case 'StatusAddedAndValueDifference':
          if (updatedBalanceOrigin) await Account.findByIdAndUpdate(origin_account, { $inc: { balance: roolbackValue } })
          if (updatedBalanceDestination) await Account.findByIdAndUpdate(destination_account, { $inc: { balance: -roolbackValue } })
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