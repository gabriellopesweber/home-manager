import express from 'express'
import { UserController } from '../controllers/UserController.js'

const router = express.Router()

// Criar um novo usuário
router.post("/register", UserController.register)

// Rota de login
router.post("/login", UserController.login)

router.post("/forgot-password", UserController.forgotPassword) // Solicita a redefinição da senha do usuario
router.post("/reset-password", UserController.resetPassword) // Redefine a senha do usuario

export default router