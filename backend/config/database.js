import mongoose from 'mongoose'
import dotenv from 'dotenv'

const env = process.env.NODE_ENV || 'development'

dotenv.config({ path: `.env.${env}` })

const MONGO_URL = process.env.MONGO_URL

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL)
    console.log(`🔥 Conectado ao MongoDB [${env}]!`)
  } catch (error) {
    console.error(`❌ Erro ao conectar ao MongoDB [${env}]:`, error)
    process.exit(1)
  }
}

export { connectDB }