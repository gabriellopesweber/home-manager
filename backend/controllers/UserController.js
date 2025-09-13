import User from '../models/User.js'

const UserController = {
  // Listar todos os usuários
  async getUsers(req, res) {
    try {
      const { email } = req.body

      const filters = {}

      if (email) {
        filters.email = email
      }
      const users = await User.find(filters).select("-password") // Remove a senha da resposta
      res.json(users)
    } catch (error) {
      console.log(error)
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
      console.log(error)
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
      console.log(error)
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
      console.log(error)
      res.status(500).json({ message: "Erro ao deletar usuário", error })
    }
  }
}

export { UserController }
