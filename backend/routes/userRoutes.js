const express = require('express')
const UserController = require('../controllers/userController')
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

/**Rotas protegidas */
router.get("/", authMiddleware, UserController.getUsers)          // Obter todos os usuários
router.get("/:id", authMiddleware, UserController.getUserById)    // Obter um usuário pelo ID
router.put("/:id", authMiddleware, UserController.updateUser)     // Atualizar um usuário pelo ID
router.delete("/id", authMiddleware, UserController.deleteUser)   // Deletar um usuário pelo ID
router.post("/forgot-password", UserController.forgotPassword) // Solicita a redefinição da senha do usuario
router.post("/reset-password", UserController.resetPassword) // Redefine a senha do usuario

module.exports = router