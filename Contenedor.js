const fs = require('fs')

class Contenedor {
    
    constructor(fileName){
        this.fileName = fileName
       /*  if(this.filename === "carritos.txt") {
            this.productosCart = []
        } */
    }

    //SAVE
    async save(object) {
        try {
            let theContent
            const response = await this.getAll()
            if(response && response.length > 2){
                theContent = JSON.parse(response),
                object.id = theContent[theContent.length - 1].id +1                   
            } else {
                theContent = JSON.parse('[]'),
                object.id=  1
            }
            object.timestamp = Date.now()
            theContent.push(object)
            await fs.promises.writeFile(this.fileName, JSON.stringify(theContent))
            console.log('El objeto ', JSON.stringify(object), ' se ha agregado satisfactoriamente sobre ', this.fileName)
            return object.id              
        }
        catch (error) {
            console.log('Error en save(): ', error)
            return 0
        }
    }

    async saveProductCart(idCart, product) {
        try {
            const responseCart = await this.getById(idCart)
            console.log(responseCart, "-----responseCart")
            console.log(idCart, "-----idCart")
            console.log(product, "-----product")

            let cartProducts = responseCart.productos
            console.log(cartProducts, "-----cartProducts")

            cartProducts.push(product)
            console.log(cartProducts, "-----2222cartProducts")
            /* if(responseCarts && responseCarts.length > 2){
                carts = JSON.parse(responseCarts),
                object.id = theContent[theContent.length - 1].id +1                   
            } else {
                theContent = JSON.parse('[]'),
                object.id=  1
            }
            object.timestamp = Date.now()
            theContent.push(object)
            await fs.promises.writeFile(this.fileName, JSON.stringify(theContent))
            console.log('El objeto ', JSON.stringify(object), ' se ha agregado satisfactoriamente sobre ', this.fileName)
            return object.id          */     
        }
        catch (error) {
            console.log('Error en save(): ', error)
            return 0
        }
    }

    //SAVE WITH ID
    async saveWithId(object, id) {
        try {
            let theContent
            const response = await this.getAll()
            if(response){
                theContent = JSON.parse(response)            
            } else {
                theContent = JSON.parse('[]')
            }
            object.id = id
            theContent.push(object)
            await fs.promises.writeFile(this.fileName, JSON.stringify(theContent))
            console.log('El objeto ', JSON.stringify(object), ' se ha agregado satisfactoriamente sobre ', this.fileName)
            return object              
        }
        catch (error) {
            console.log('Error en save(): ', error)
            return null
        }
    }

    //GET BY ID
    async getById(number) {
        try {
            const response = await this.getAll()
            let match
            response 
            ?  match = JSON.parse(response)?.find( index => index.id === number ) || null
            : match = null
            console.log(`Buscando match... ${JSON.stringify(match)}`)
            return match
        } catch (error) {
            console.log('Error en getById(): ', error)
        }
    }

    //GET ALL
    async getAll() {
        try {
            const response = await fs.promises.readFile(this.fileName,'utf-8')
            /* response.length === 0 
            ? console.log(this.fileName, ' está vacío')
            : console.log(JSON.parse(response)) */
            return response
        } catch (error) {
            console.log('Error en getAll(): ', error)
        }
    }

    //DELETE BY ID
    async deleteById(number) {
        try {
            let response = await this.getAll()
            response 
            && ( response = JSON.parse(response)?.filter(element => element.id !== number) )
            await fs.promises.writeFile(this.fileName, JSON.stringify(response))
            console.log('Elimino el producto con id ', JSON.stringify(number) )
        } catch (error) {
            console.log('Error en deleteById(): ', error)
        }
    }

    //DELETE ALL
    async deleteAll() {
        try {
            await fs.promises.writeFile(this.fileName, '')
            console.log('Se ha limpiado correctamente el archivo')
        } catch (error) {
            console.log('Error en deleteAll(): ', error)
        }
    }
    
}
module.exports = Contenedor