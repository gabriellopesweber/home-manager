const express = require('express')
const authMiddleware = require("@/middleware/authMiddleware")
const IncomeController = require('@/controllers/incomeController')

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, IncomeController.create)
router.get('/', authMiddleware, IncomeController.getAll)
router.get('/:id', authMiddleware, IncomeController.getById)
router.put('/:id', authMiddleware, IncomeController.update)
router.delete('/:id', authMiddleware, IncomeController.delete)

module.exports = router