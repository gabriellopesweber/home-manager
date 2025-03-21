const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body

      // Verifica se já existe um usuário com esse e-mail
      const existingUser = await User.findOne({ email })
      if (existingUser) return res.status(400).json({ message: "E-mail já cadastrado!" })

      // Criptografa a senha antes de salvar
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const newUser = await User.create({ name, email, password: hashedPassword })

      res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser })
    } catch (error) {
      res.status(500).json({ message: "Erro ao cadastrar usuário", error })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body

      // Verifica se o usuário existe
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: "Usuário não encontrado!" })

      // Compara a senha fornecida com a senha criptografada no banco
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) return res.status(400).json({ message: "Senha incorreta!" })

      // Gera o token JWT
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" })

      res.json({ message: "Login realizado com sucesso!", token })
    } catch (error) {
      res.status(500).json({ message: "Erro ao fazer login", error })
    }
  },

  // Listar todos os usuários
  async getUsers(req, res) {
    try {
      const users = await User.find().select("-password") // Remove a senha da resposta
      res.json(users)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários", error })
    }
  },

  // Buscar usuário por ID
  async getUserById(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password")
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }
      res.json(user)
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuário", error })
    }
  },

  // Atualizar usuário
  async updateUser(req, res) {
    try {
      const { name, email } = req.body
      const newUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true })
      if (!newUser) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }
      res.json({
        message: "Usuário atualizado com sucesso",
        user: { id: newUser.id, name: newUser.name, createdAt: newUser.createdAt }
      })
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário", error })
    }
  },

  // Deletar usuário
  async deleteUser(req, res) {
    try {
      const user = await User.findByIdAndDelete(req.params.id)
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" })
      }
      res.json({ message: "Usuário deletado com sucesso" })
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar usuário", error })
    }
  }
}

module.exports = UserController
