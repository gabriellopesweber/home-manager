const express = require("express")
const cors = require("cors");
const connectDB = require("./config/database")
const userRoutes = require('./routes/userRoutes')
require("dotenv").config()

const app = express()
const port = process.env.PORT || 5002

connectDB()

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes)

app.listen(port, () => {
  console.log(`🚀 Servidor no ar: http://localhost:${port}/`)
})