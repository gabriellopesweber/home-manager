// @jest-environment node
import mongoose from 'mongoose'
import request from 'supertest'
import app from '../app.js'

afterAll(async () => {
  await mongoose.disconnect()
})

describe('Auth Routes', () => {
  const testUser = {
    name: "Teste",
    email: "teste@exemplo.com",
    password: "123456"
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
