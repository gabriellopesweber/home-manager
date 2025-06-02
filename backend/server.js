import app from './app.js'

const port = process.env.PORT || 5002
app.listen(port, () => {
  console.log(`🚀 Servidor no ar: http://localhost:${port}/`)
})