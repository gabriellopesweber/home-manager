import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { ExpenseController } from '../controllers/ExpenseController.js'

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, ExpenseController.create)
router.get('/', authMiddleware, ExpenseController.getAll)
router.get('/:id', authMiddleware, ExpenseController.getById)
router.put('/:id', authMiddleware, ExpenseController.update)
router.delete('/:id', authMiddleware, ExpenseController.delete)

export default router