const express = require('express')
const authMiddleware = require("@/middleware/authMiddleware")
const ExpenseController = require('@/controllers/expenseController')

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, ExpenseController.create)
router.get('/', authMiddleware, ExpenseController.getAll)
router.get('/:id', authMiddleware, ExpenseController.getById)
router.put('/:id', authMiddleware, ExpenseController.update)
router.delete('/:id', authMiddleware, ExpenseController.delete)

module.exports = router