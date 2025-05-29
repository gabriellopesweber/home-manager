import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  e2e: {
    baseUrl: process.env.BASE_URL || 'http://localhost:5173',
    env: {
      VITE_API_URL: process.env.VITE_API_URL
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
