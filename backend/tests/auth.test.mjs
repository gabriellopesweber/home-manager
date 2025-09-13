// @jest-environment node
import mongoose from 'mongoose'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../app.js'
import { v4 as uuidv4 } from 'uuid'
import User from '../models/User.js'

afterAll(async () => {
  await mongoose.disconnect()
})

describe('Auth Routes', () => {
  const testUser = {
    name: "Teste",
    email: "teste@exemplo.com",
    password: "123456",
    newPassword: "654321"
  }

  let token = null
  let userId = null

  it('Deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/authorization/register')
      .send(testUser)

    if (res.statusCode === 400) {
      expect(res.body.message || res.body.msg).toMatch(/E-mail já cadastrado!/i)
    } else {
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe("Usuário cadastrado com sucesso!")
      expect(res.body).toHaveProperty('user')
    }
  })

  it('Deve fazer login com o usuário criado', async () => {
    const res = await request(app)
      .post('/authorization/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('token')

    token = res.body.token
  })

  it('Deve atualizar o token corretamente', async () => {
    const oldToken = token
    const res = await request(app)
      .post('/authorization/refresh-token')
      .send({ token: oldToken })

    expect(res.body.message).toBe("Token atualizado com sucesso!")
    expect(res.statusCode).toBe(200)

    expect(res.body).toHaveProperty('token')

    expect(typeof res.body.token).toBe('string')
    expect(res.body.token).not.toBe(oldToken)

    // Verifica se o token tem formato JWT
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/
    expect(jwtRegex.test(res.body.token)).toBe(true)

    token = res.body.token
  })

  it('Deve redefinir a senha com um token válido', async () => {
    const user = await User.findOne({ email: testUser.email })
    expect(user).not.toBeNull()

    // Simula solicitação de recuperação de senha
    const forgotRes = await request(app)
      .post('/authorization/forgot-password')
      .send({ email: testUser.email })

    expect(forgotRes.statusCode).toBe(200)
    expect(forgotRes.body.message).toMatch(/E-mail de recuperação enviado!/i)

    // Gera um token válido simulando o link enviado por e-mail
    const resetToken = jwt.sign(
      { id: user._id, refreshNonce: uuidv4() },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const resetRes = await request(app)
      .post('/authorization/reset-password')
      .send({ token: resetToken, newPassword: testUser.newPassword })

    expect(resetRes.statusCode).toBe(200)
    expect(resetRes.body.message).toBe("Senha redefinida com sucesso!")

    const loginAntigo = await request(app)
      .post('/authorization/login')
      .send({ email: testUser.email, password: testUser.password })

    expect(loginAntigo.statusCode).toBe(401)
    expect(loginAntigo.body.message).toMatch(/Dados invalidos/i)

    const loginNovo = await request(app)
      .post('/authorization/login')
      .send({ email: testUser.email, password: testUser.newPassword })

    expect(loginNovo.statusCode).toBe(200)
    expect(loginNovo.body).toHaveProperty('token')

    token = loginNovo.body.token
  })

  it('Deve deletar o usuário logado', async () => {
    const res = await request(app).get('/users/')
      .set('Authorization', `Bearer ${token}`)

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)

    const usuario = res.body.find(user => user.email === testUser.email)

    expect(usuario).toBeDefined()
    userId = usuario._id

    const deleteRes = await request(app)
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteRes.statusCode).toBe(200)
    expect(deleteRes.body.message).toBe("Usuário deletado com sucesso")
  })
})
