const express = require("express")

const app = express()
const port = 5002

app.get('/', (req, res) => {
    res.send(`Olá mundo`)
})

app.get('/home', (req, res) => {
    res.send(`pagina home`)
})

app.get('/about', (req, res) => {
    res.send(`pagina about`)
})

app.listen(port, () => {
    console.log(`Servidor no ar: http://localhost:${port}/`)
})