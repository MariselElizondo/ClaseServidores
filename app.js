const express = require('express')
const { Router } = express
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')

const app = express()
const router = Router()
const httpServer = new HttpServer(app)
const ioServer = new IOServer(httpServer)
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let listOfProducts
const messages = []

//CONFIGURACIONES
app.use('/api/productos', router)
app.use(express.json())
app.use(express.urlencoded({extend:true}))
app.use(express.static('./public'))
app.set('views', './views')
app.set('view engine', 'ejs')

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

const refreshProducts = async(req, res, next) => { //Al que indiquemos
    listOfProducts = await containerOne.getAll()
    if(listOfProducts){
        next()
    }else {
        res.send({error: 'Error al intentar objeter los productos'})
    }
}

//SERVIDOR
httpServer.listen(process.env.PORT || 3000, () => {
    console.log("SERVER ON");
})

ioServer.on('connection', (socket) => {
    console.log("New user")
    socket.emit('messages', messages)
    socket.on('new-message', data => {
        messages.push(data)
        ioServer.sockets.emit('messages', [data])
    })
})

//RUTAS
app.get('/', (req, res) => {
    return res.render('form')
})

app.get('/list', refreshProducts, (req, res) => {
    return res.render('list', {
        list: JSON.parse(listOfProducts)
    })
})

app.post("/", async (req, res) => {
    await containerOne.save(req.body)
    return res.redirect("/list")
}) 

//
app.use(express.static(__dirname + '/public'))
app.listen(process.env.PORT || 8080)
