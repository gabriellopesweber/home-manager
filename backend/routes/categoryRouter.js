import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { CategoryController } from '../controllers/CategoryController.js'

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, CategoryController.create)
router.get('/', authMiddleware, CategoryController.getAll)
router.get('/:id', authMiddleware, CategoryController.getById)
router.put('/:id', authMiddleware, CategoryController.update)
router.delete('/:id', authMiddleware, CategoryController.delete)

export default router