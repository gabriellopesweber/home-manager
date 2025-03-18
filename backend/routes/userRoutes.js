const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router()

// Criar um novo usuário
router.post("/users", userController.createUser)

// Obter todos os usuários
router.get("/users", userController.getAllUsers)

// Obter um usuário pelo ID
router.get("/users/:id", userController.getUserById)

// Atualizar um usuário pelo ID
router.put("/users/:id", userController.updateUser)

// Deletar um usuário pelo ID
router.delete("/users/:id", userController.deleteUser)

module.exports = router