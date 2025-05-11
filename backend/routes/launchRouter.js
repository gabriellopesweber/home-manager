import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { LaunchController } from '../controllers/LaunchController.js'

const router = express.Router()

router.get('/', authMiddleware, LaunchController.getAll)
router.get('/balance', authMiddleware, LaunchController.getBalanceAt)
router.get('/balance-detailed', authMiddleware, LaunchController.getDetailedBalanceAt)

export default router