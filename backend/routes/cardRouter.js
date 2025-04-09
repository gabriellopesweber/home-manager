import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { CardController } from '../controllers/CardController.js'

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, CardController.create)
router.get('/', authMiddleware, CardController.getAll)
router.get('/:id', authMiddleware, CardController.getById)
router.put('/:id', authMiddleware, CardController.update)
router.delete('/:id', authMiddleware, CardController.delete)

export default router