const express = require('express')
const { Router } = express
const app = express()
const router = Router()

const PORT = 8080

//MIDDLEWARES
app.use(( req, res, next) => { // A todos
    console.log("Time: ", Date.now())
    next()
})

router.use( (req, res, next) => {
    console.log("Solo se ejecuta en el router");
    next()
})

const validateTokenMid = (req, res, next) => { //Al que indiquemos
    req.dato1 = "Lo del dato 1"
    if(req.headers.token == 'secret'){
        next()
    }else {
        throw "Error TOKEN" 
        //O con err res.status(500).send("Estamos trabajando en sol.") err.stack y al final debe estar
    }
}

//ROUTER
router.get('/usuario', validateTokenMid, (req, res) => { //Podemos agregar cuantos middlewares querramos
    console.log(req.dato1)
    res.send("Devuelve usuarios")
})

router.get('/producto', (req, res) => {
    res.send("Devuelve productos")
})

app.use('/ruta-inicio', router)

router.get('/sin-ruta-inicio', (req, res) => {
    res.send("Sin prefix api")
})

//STATICS FILE
app.use(express.static(__dirname + '/public')) //Entre paréntesis la ruta
app.use('/static', express.static('datas'))

app.listen(PORT)