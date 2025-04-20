import express from 'express'
import cors from 'cors'
import connectDB from './config/database.js'
import dotenv from 'dotenv'
dotenv.config()

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRouter.js'
import incomeRouter from './routes/incomeRouter.js'
import categoryRouter from './routes/categoryRouter.js'
import accountRouter from './routes/accountRouter.js'
import transferRouter from './routes/transferRouter.js'
import cardRouter from './routes/cardRouter.js'
import launchRouter from './routes/launchRouter.js'

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
app.use('/account', accountRouter)
app.use('/transfer', transferRouter)
app.use('/card', cardRouter)
app.use('/launch', launchRouter)

app.get("/", (req, res) => {
  res.send("🔥 API rodando com MongoDB!")
})

app.listen(port, () => {
  console.log(`🚀 Servidor no ar: http://localhost:${port}/`)
})