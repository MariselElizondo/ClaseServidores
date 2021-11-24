const express = require('express')
const app = express()

//EJECUCIÓN
const Contenedor = require("./Contenedor.js")
let containerOne= new Contenedor('productos.txt')

const init = async () => {
    console.log('================= AGREGO ELEMENTOS INICIALES =================')
    await containerOne.save({"title":"Escuadra","price":123.45,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"})
    await containerOne.save({"title":"Calculadora","price":234.56,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"})
    await containerOne.save({"title":"Globo Terráqueo","price":345.67,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"})
}

init()

app.listen(process.env.PORT || 8080)

//RUTAS
app.get('/', (req,res) => {
    console.log("Get request")
    res.send("Saludos")
})

app.get('/productos', (req,res) => {
    res.send("Productos", products)
})

app.get('/productoRandom', (req,res) => {
    res.send("Producto Random")
})
