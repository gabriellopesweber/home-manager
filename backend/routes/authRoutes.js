const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userController')

// Criar um novo usuário
router.post("/", UserController.register)

// Rota de login
router.post("/login", UserController.login)

module.exports = router