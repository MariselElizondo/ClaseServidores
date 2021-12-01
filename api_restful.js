const express = require('express')
const multer = require('multer')
const { Router } = express

const app = express()
const router = Router()
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let allProducts

app.use(express.json())
app.use(express.urlencoded({extend:true}))

const getAllProducts = async () => {
    allProducts = await containerOne.getAll(); 
}
getAllProducts()

//MIDDLEWARES
const validateProductExists = async(req, res, next) => { //Al que indiquemos
    const myId = req.params.id
    const exist = await containerOne.getById(+myId)
    if(exist){
        next()
    }else {
        res.send({error: 'producto no encontrado'})
    }
}

//RUTA BASE
app.use('/api/productos', router)

//RUTAS
router.get('', async(req, res) => {
    res.send(JSON.parse(allProducts))
})

router.get('/:id', validateProductExists, async (req, res) => {
    let myId = req.params.id
    const product = await containerOne.getById(+myId)
    res.json(product)
})

app.post('/api/productos', async (req, res) => {
    await containerOne.save(req.body)
    res.json(req.body)
})

router.put('/:id', validateProductExists, async(req, res) => {
    let myId = req.params.id
    res.send({"Response":"Recibe y actualiza un producto segun su id"})
})

router.delete('/:id', validateProductExists, async(req, res) => {
    const myId = req.params.id
    await containerOne.deleteById(+myId)
    res.send({"Response":"eliminado"})
})

//STATICS FILE
app.use(express.static(__dirname + '/public'))

app.listen(process.env.PORT || 8080)
