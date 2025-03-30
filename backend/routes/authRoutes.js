const express = require('express')
const router = express.Router()
const UserController = require('@/controllers/userController')

// Criar um novo usuário
router.post("/register", UserController.register)

// Rota de login
router.post("/login", UserController.login)

router.post("/forgot-password", UserController.forgotPassword) // Solicita a redefinição da senha do usuario
router.post("/reset-password", UserController.resetPassword) // Redefine a senha do usuario

module.exports = router