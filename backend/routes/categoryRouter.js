const express = require('express')
const authMiddleware = require("@/middleware/authMiddleware")
const CategoryController = require("@/controllers/categoryController")

const router = express.Router()

/**Rotas protegidas */
router.post('/', authMiddleware, CategoryController.create)
router.get('/', authMiddleware, CategoryController.getAll)
router.get('/:id', authMiddleware, CategoryController.getById)
router.put('/:id', authMiddleware, CategoryController.update)
router.delete('/:id', authMiddleware, CategoryController.delete)

module.exports = router