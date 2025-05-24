import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { DashboardController } from '../controllers/DashboardController.js'

const router = express.Router()

/**Rotas protegidas */
router.get('/last-three-transactions', authMiddleware, DashboardController.lastThree)
router.get('/datasets', authMiddleware, DashboardController.getDatasets)

export default router