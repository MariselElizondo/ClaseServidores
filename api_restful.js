const express = require('express')
const { Router } = express
const app = express()
const router = Router()
const PORT = 8080
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let allProducts

const getAllProducts = async () => {
    allProducts = await containerOne.getAll(); 
}
getAllProducts()

//RUTA BASE
app.use('/api/productos', router)

//RUTAS
router.get('', async(req, res) => {
    console.log("Devuelve todos los productos")
    res.send(JSON.parse(allProducts))
})

router.get('/:id', (req, res) => {
    res.send("Devuelve un producto")
})

router.post('', (req, res) => {
    res.send("Recibe y agrega un producto, y lo devuelve con su id asignado")
})

router.put('/:id', (req, res) => {
    res.send("Recibe y actualiza un producto segun su id")
})

router.delete('/:id', (req, res) => {
    res.send("Elimina producto segun su id")
})



/* //STATICS FILE
app.use(express.static(__dirname + '/public')) //Entre paréntesis la ruta
app.use('/static', express.static('datas')) */

app.listen(PORT)