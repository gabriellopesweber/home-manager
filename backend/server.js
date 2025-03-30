require('module-alias/register')
const express = require("express")
const cors = require("cors")
const connectDB = require("@/config/database")
require("dotenv").config()

const userRoutes = require('@/routes/userRoutes')
const authRoutes = require('@/routes/authRoutes')
const expenseRoutes = require('@/routes/expenseRouter')
const incomeRouter = require('@/routes/incomeRouter')
const categoryRouter = require('@/routes/categoryRouter')

const app = express()
const port = process.env.PORT || 5002

connectDB()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)
app.use('/authorization', authRoutes)
app.use('/expense', expenseRoutes)
app.use('/income', incomeRouter)
app.use('/category', categoryRouter)

app.get("/", (req, res) => {
  res.send("🔥 API rodando com MongoDB!")
})

app.listen(port, () => {
  console.log(`🚀 Servidor no ar: http://localhost:${port}/`)
})