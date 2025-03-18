const User = require("../models/User")
const bcrypt = require("bcryptjs")

// Criar um novo usuário
exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Verifica se o usuário já existe
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "Usuário já cadastrado" })
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria novo usuário
    user = new User({ name, email, password: hashedPassword })
    await user.save()

    res.status(201).json({ message: "Usuário criado com sucesso" })
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar usuário", error })
  }
}

// Listar todos os usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password") // Remove a senha da resposta
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuários", error })
  }
}

// Buscar usuário por ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error })
  }
}

// Atualizar usuário
exports.updateUser = async (req, res) => {
  try {
    const { name, email } = req.body
    const user = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true })
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }
    res.json({ message: "Usuário atualizado com sucesso", user })
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar usuário", error })
  }
}

// Deletar usuário
exports.deleteUser = async (req, res) => {
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
