import User from '../models/User.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import { v4 as uuidv4 } from 'uuid'

import { Category } from '../models/Finance.js'
import { validateRequiredFields } from '../utils/validations.js'
import { incomes, expenses } from '../constants/Categorys.js'

async function createCategorys(name, type) {
  return await Category.findOneAndUpdate(
    { name },
    { $setOnInsert: { name, default: true, type } },
    { upsert: true, new: true }
  )
}

function executeCreateCateogry() {
  incomes.map(income => createCategorys(income, 'receita'))
  expenses.map(expense => createCategorys(expense, 'despesa'))
}

const AuthController = {
  async register(req, res) {
    try {
      const { name, email, password } = req.body

      // Verifica se já existe um usuário com esse e-mail
      const existingUser = await User.findOne({ email })
      if (existingUser) return res.status(400).json({ message: "E-mail já cadastrado!" })

      const newUser = await User.create({ name, email, password })

      executeCreateCateogry()

      res.status(201).json({ message: "Usuário cadastrado com sucesso!", user: newUser })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro ao cadastrar usuário", error })
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body

      const validation = validateRequiredFields({ email, password })
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message })
      }

      // Verifica se o usuário existe
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: "Usuário não encontrado!" })

      // Compara a senha fornecida com a senha criptografada no banco
      const isMatch = await bcryptjs.compare(password, user.password)
      if (!isMatch) return res.status(401).json({ message: "Dados invalidos!" })

      // Gera o token JWT
      const token = jwt.sign(
        { id: user._id, refreshNonce: uuidv4() },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      )

      res.status(200).json({ message: "Login realizado com sucesso!", token })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro ao fazer login", error })
    }
  },

  // Função para recuperação de senha via e-mail
  async forgotPassword(req, res) {
    try {
      const { email } = req.body

      // Verifica se o usuário existe
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ message: "Usuário não encontrado!" })

      // Gera um token de redefinição de senha
      const resetToken = jwt.sign(
        { id: user._id, refreshNonce: uuidv4() },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      )

      // Configuração do transporte de e-mail (Gmail, SMTP, etc.)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER, // Seu e-mail
          pass: process.env.EMAIL_PASS, // Sua senha ou App Password
        }
      })

      // Envia o e-mail com o link de redefinição
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Recuperação de Senha - HomeManager",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #4CAF50;">Olá, ${user.name || ''}!</h2>
            <p>Recebemos uma solicitação para redefinir a sua senha no <strong>HomeManager</strong>.</p>
            <p>Para redefinir, clique no botão abaixo:</p>
            <p style="text-align: center;">
              <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                Redefinir Senha
              </a>
            </p>
            <p>Se você não solicitou essa alteração, pode ignorar este e-mail.</p>
            <p style="font-size: 12px; color: #888;">Este link expira em 15 minutos por motivos de segurança.</p>
            <hr />
            <p style="font-size: 12px; color: #888;">HomeManager - Gerencie suas finanças com simplicidade</p>
          </div>
        `
      })

      res.json({ message: "E-mail de recuperação enviado!" })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro ao solicitar redefinição de senha", error })
    }
  },

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body

      if (!token) return res.status(400).json({ message: "Token não fornecido!" })

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) return res.status(400).json({ message: "Token inválido ou expirado!" })

      if (user.passwordChangedAt && user.passwordChangedAt.getTime() > decoded.iat * 1000) {
        return res.status(400).json({ message: "Token já foi usado ou expirado!" })
      }

      user.password = newPassword
      user.passwordChangedAt = new Date()

      await user.save()

      res.json({ message: "Senha redefinida com sucesso!" })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro ao redefinir senha", error })
    }
  },

  async refreshToken(req, res) {
    try {
      const { token } = req.body

      if (!token) return res.status(400).json({ message: "Token não fornecido!" })

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id)
      if (!user) return res.status(400).json({ message: "Token inválido ou expirado!" })

      const newToken = jwt.sign(
        { id: user._id, refreshNonce: uuidv4() },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      )

      return res.status(200).json({ message: "Token atualizado com sucesso!", token: newToken })
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro ao redefinir senha", error })
    }
  }
}

export { AuthController }