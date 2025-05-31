import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import vue from '@vitejs/plugin-vue'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import Checker from 'vite-plugin-checker'
import path from 'path'

// Mapas de base para ambientes diferentes
const baseMap = {
  development: '/home-manager/develop/',
  release: '/home-manager/release/',
  production: '/home-manager/master/',
  code: '/'
}

export default defineConfig(({ mode }) => ({
  base: baseMap[mode] || '/',
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify(),
    Checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{ts,js,vue}"',
        useFlatConfig: true,
      }
    }),
    viteStaticCopy({
      targets: [{
        src: 'index.html',
        dest: '.',
        rename: '404.html',
      }],
    }),
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
  server: {
    host: true,
    port: 5173,
    strictPort: true
  }
}))