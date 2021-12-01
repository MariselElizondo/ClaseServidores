const express = require('express')
const multer = require('multer')
const app = express()
const PORT = 8080

app.use(express.urlencoded({extend:true}))
app.use(express.static('uploads'))

const storage =multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer({storage})

app.post('/upload', upload.single('myFile'), ( req, res) => {
    const file = req.file
    if(!file) {
        const error = new Error("Please upload file :(")
        error.httpStatuscODE = 400
        return next(error)
    }
    res.send(file)
})

app.listen(PORT)

//Un form-data, post