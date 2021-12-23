const express = require('express')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')
const { Router } = express

const routerProductos = Router()
const routerCarrito = Router()
const app = express()
const httpServer = new HttpServer(app)
const ioServer = new IOServer(httpServer)
const Contenedor = require("./Contenedor.js")
let containerProductos = new Contenedor('productos.txt')
let containerCarritos = new Contenedor('carritos.txt')
let listOfProducts = []
let mail
let idCart;
let administrador = true

const fs = require('fs')

async function saveChat(data) {
    try {
        await fs.promises.appendFile('chat.txt', JSON.stringify(data))           
    }
    catch (error) {
        console.log('Error en al guardar el chat en el servidor: ', error)
    }
}

//CONFIGURACIONES
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set('views', './views')
app.set('view engine', 'ejs')

//STATICS FILE
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'))

//RUTA BASE
app.use('/api/productos', routerProductos)
app.use('/api/carrito', routerCarrito)

//MANEJO DE RUTAS DE ERROR
app.use(( req, res, next) => {
    let ruta = "x"
    let metodo = "y"
    let desc = "ruta " + ruta + " método " + metodo +" no implementada"  
    res.send({error: -2, descripcion: desc})
})

//SERVIDOR
httpServer.listen(process.env.PORT || 8080, () => {
    console.log("SERVER ON PORT 8080");
})

ioServer.on('connection', (socket) => {
    mail = null
    console.log("New user connected")
    socket.emit('lista-ingresando', listOfProducts)
    socket.on('new-product', data => {
        (JSON.parse(listOfProducts)).push(data)
        containerProductos.save(data)
        ioServer.sockets.emit('product', data)
    })
    socket.on('new-user-mail', data => {
        mail = data
        socket.emit('open-chat', data)
    })
    socket.on('chat-text', data => {
        let allData = {'mail': mail, 'data': data}
        saveChat(allData)
        ioServer.sockets.emit('new-msg-chat', allData)
    })
})

//MIDDLEWARES
const validateAdministrator = async(req, res, next) => { //Al que indiquemos
    if(administrador){
        next()
    }else {
        let ruta = "x"
        let metodo = "y"
        let desc = "ruta " + ruta + " método " + metodo +" no autorizada"  
        res.send({error: -1, descripcion: desc})
    }
}

const validateProductExists = async(req, res, next) => { //Al que indiquemos
    const myId = req.params.id
    const exist = await containerProductos.getById(+myId)
    if(exist){
        next()
    }else {
        res.send({error: 'producto no encontrado'})
    }
}

const refreshProducts = async(req, res, next) => { //Al que indiquemos
    listOfProducts = await containerProductos.getAll()
    if(listOfProducts){
        next()
    }else {
        res.send({error: 'Error al intentar objeter los productos'})
    }
}

//RUTAS

/*********************** PRODUCTOS ***********************/
routerProductos.get('/', refreshProducts, async(req, res) => {
    const allProducts = await containerProductos.getAll(); 
    res.send(JSON.parse(allProducts))
    /* return res.render('form', {
        list: JSON.parse(listOfProducts)
    }) */
})

routerProductos.get('/:id', validateProductExists, async (req, res) => {
    let myId = req.params.id
    const product = await containerProductos.getById(+myId)
    res.json(product)
})

routerProductos.post('/', validateAdministrator, async (req, res) => {
    await containerProductos.save(req.body)
    res.json(req.body)
})

routerProductos.put('/:id', validateAdministrator, validateProductExists, async(req, res) => {
    const myId = req.params.id
    console.log(req.body)
    await containerProductos.deleteById(+myId)
    const updatedProduct = await containerProductos.saveWithId(req.body, +myId)
    res.send(updatedProduct)
})

routerProductos.delete('/:id', validateAdministrator, validateProductExists, async(req, res) => {
    const myId = req.params.id
    await containerProductos.deleteById(+myId)
    res.send({"Response":"eliminado"})
})

/************************ CARRITO ************************/

routerCarrito.post('/', async (req, res) => {
    await containerCarritos.save(req.body)
    idCart = req.body.id
    res.json({"idNuevoCarrito": idCart})
})

routerCarrito.delete('/:id', validateProductExists, async(req, res) => {
    const myId = req.params.id
    await containerCarritos.deleteById(+myId)
    res.send({"Response":"eliminado"})
})

routerCarrito.get('/:id/productos', validateProductExists, async (req, res) => {
    let myId = req.params.id
    const cart = await containerCarritos.getById(+myId)
    res.json(cart.productos)
})

routerCarrito.post('/:id/productos', async (req, res) => {
    let myId = req.params.id
    const product = await containerProductos.getById(+myId)
    const cart = await containerCarritos.saveProductCart(+myId, product)
    
    //await containerCarritos.save(req.body)
    res.json(req.body)
})

routerCarrito.delete('/:id/productos/:id_prod', validateProductExists, async(req, res) => {
    const myId = req.params.id
    await containerCarritos.deleteById(+myId)
    res.send({"Response":"eliminado"})
})

routerCarrito.get('/', async (req, res) => {
    const myCart = await containerCarritos.getById(+idCart)
    res.send(myCart)
})
