import { defineConfig } from "cypress"
import * as dotenv from "dotenv"
import fs from "fs"

const envFile = `.env.code`

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile })
} else {
  dotenv.config()
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    env: {
      VITE_API_URL: process.env.VITE_API_URL
    },
  },
})
