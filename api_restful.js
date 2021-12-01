const express = require('express')
const { Router } = express
const app = express()
const router = Router()
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let allProducts

//app.use(express.urlencoded({extended:true}))
app.use(express.json())

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

router.get('/:id', async (req, res) => {
    let myId = req.params.id
    const product = await containerOne.getById(+myId)
    res.send(product)
})

router.post('', async (req, res) => {
    await containerOne.save(req.body)
    console.log("Recibe, agrega un producto, y lo devuelve con su id asignado")
    res.json(req.body)
})

router.put('/:id', (req, res) => {
    let myId = req.params.id
    res.send("Recibe y actualiza un producto segun su id")
})

router.delete('/:id', async(req, res) => {
    let myId = req.params.id
    await containerOne.deleteById(+myId)
    res.send("Elimina un producto segun su id")
})




/* //STATICS FILE
app.use(express.static(__dirname + '/public')) //Entre paréntesis la ruta
app.use('/static', express.static('datas')) */

app.listen(process.env.PORT || 8080)