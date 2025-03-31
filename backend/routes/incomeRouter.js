import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { IncomeController } from '../controllers/IncomeController.js'

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, IncomeController.create)
router.get('/', authMiddleware, IncomeController.getAll)
router.get('/:id', authMiddleware, IncomeController.getById)
router.put('/:id', authMiddleware, IncomeController.update)
router.delete('/:id', authMiddleware, IncomeController.delete)

export default router