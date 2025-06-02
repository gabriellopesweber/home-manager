import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { UserController } from '../controllers/UserController.js'

const router = express.Router()

/**Rotas protegidas */
router.get("/", authMiddleware, UserController.getUsers)          // Obter todos os usuários
router.get("/:id", authMiddleware, UserController.getUserById)    // Obter um usuário pelo ID
router.put("/:id", authMiddleware, UserController.updateUser)     // Atualizar um usuário pelo ID
router.delete("/:id", authMiddleware, UserController.deleteUser)   // Deletar um usuário pelo ID

export default router