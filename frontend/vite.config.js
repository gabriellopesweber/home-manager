import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Checker from 'vite-plugin-checker';
import path from 'path';

export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify(),
    Checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,js,vue}"',
        useFlatConfig: true,
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
})