const express = require('express')

const app = express()
app.listen(process.env.PORT || 8080)

app.get('/', (req,res) => {
    console.log("Get request")

    res.send("Saludos")
})