import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { AccountController } from '../controllers/AccountController.js'

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, AccountController.create)
router.get('/', authMiddleware, AccountController.getAll)
router.get('/:id', authMiddleware, AccountController.getById)
router.put('/:id', authMiddleware, AccountController.update)
router.delete('/:id', authMiddleware, AccountController.delete)

export default router