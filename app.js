const express = require('express')
const app = express()

//EJECUCIÓN
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let allProducts;

const init = async () => {
    console.log('================= AGREGO ELEMENTOS INICIALES =================')
    await containerOne.save({"title":"Escuadra","price":123.45,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png"})
    await containerOne.save({"title":"Calculadora","price":234.56,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png"})
    await containerOne.save({"title":"Globo Terráqueo","price":345.67,"thumbnail":"https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png"})
    allProducts = await containerOne.getAll()
}

init()

app.listen(process.env.PORT || 8080)

//RUTAS
app.get('/', (req,res) => {
    console.log("Get request")
    res.send("<h1>Esta es la página principal</h1>")
})

app.get('/productos', (req,res) => {
    try {
        res.send("<h2>Los productos disponibles son los siguientes:</h2>" + allProducts)
    } catch (error) {
        res.send("Error geting products")
    }
    
})

app.get('/productoRandom', async (req,res) => {
    try {
        const numberOfProducts = JSON.parse(allProducts).length
        const number = Math.floor(Math.random() * numberOfProducts)+1;
        const randomProduct = await containerOne.getById(number)
        res.send("<h2>Producto Random</h2>" + JSON.stringify(randomProduct))
    } catch (error) {
        res.send("Error geting random product")
    }
})
