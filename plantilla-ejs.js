const express = require('express')
const { Router } = express

const app = express()
const router = Router()
const Contenedor = require("./Contenedor.js")
let containerOne = new Contenedor('productos.txt')
let listOfProducts

//CONFIGURACIONES
app.use('/api/productos', router)

app.set('views', './views')
app.set('view engine', 'ejs')

app.use(express.json())
app.use(express.urlencoded({extend:true}))

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

//STATICS FILE
app.use(express.static(__dirname + '/public'))

app.listen(process.env.PORT || 8080)
