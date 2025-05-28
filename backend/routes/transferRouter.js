import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { TransferController } from '../controllers/TransferController.js'

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, TransferController.create)
router.get('/', authMiddleware, TransferController.getAll)
router.get('/:id', authMiddleware, TransferController.getById)
router.put('/:id', authMiddleware, TransferController.update)
router.delete('/:id', authMiddleware, TransferController.delete)

export default router