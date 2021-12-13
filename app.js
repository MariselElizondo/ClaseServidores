const express = require('express')
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require('socket.io')

const app = express()
const httpServer = new HttpServer(app)
const ioServer = new IOServer(httpServer)
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let listOfProducts = []

//CONFIGURACIONES
/* app.use(express.json())
app.use(express.urlencoded({extend:true})) */
app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/views'))
app.set('views', './views')
app.set('view engine', 'ejs')

//SERVIDOR
httpServer.listen(process.env.PORT || 8080, () => {
    console.log("SERVER ON");
})

ioServer.on('connection', (socket) => {
    console.log("New user connected")
    socket.emit('product', [{author:"Marisel"}])
    socket.on('new-product', data => {
        let listaParseada = JSON.parse(listOfProducts)
        listaParseada.push(data)
        console.log(listaParseada)
        containerOne.save(data)
        ioServer.sockets.emit('product', [data])
    })
})

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

//RUTAS
app.get('/', refreshProducts,  (req, res) => {
    return res.render('form', {
        list: JSON.parse(listOfProducts)
    })
})

app.post("/", async (req, res) => {
    await containerOne.save(req.body)
    
}) 



