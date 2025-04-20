import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { LaunchController } from '../controllers/LaunchController.js'

const router = express.Router()

router.get('/', authMiddleware, LaunchController.getAll)

export default router