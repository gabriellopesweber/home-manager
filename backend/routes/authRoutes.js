import express from 'express'
import { AuthController } from '../controllers/AuthController.js'

const router = express.Router()

// Criar um novo usuário
router.post("/register", AuthController.register)

// Rota de login
router.post("/login", AuthController.login)

router.post("/forgot-password", AuthController.forgotPassword) // Solicita a redefinição da senha do usuario
router.post("/reset-password", AuthController.resetPassword) // Redefine a senha do usuario
router.post("/refresh-token", AuthController.refreshToken) // Redefine a senha do usuario

export default router