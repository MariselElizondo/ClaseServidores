const socket = io.connect()

socket.on('product', data => {
    renderProduct(data)
})

socket.on('lista-ingresando', data => {
    console.log('Lista de productos a representar en la vista: ', data)
})

function renderProduct(data) {
    $("#new-line").append(`
    <tr>
        <td> ${data.title} </td>
        <td> ${data.price} </td>
        <td><img src="${data.thumbnail} " width="100px"></td>
    </tr>`)
}

function renderMensaje(data) {
    $("#box-msg").append(`
    <tr>
        <td> ${data.mail} </td>
        <td> ${data.msg} </td>
        <td><img src="${data.thumbnail} " width="100px"></td>
    </tr>`)
}

$("#myForm1").submit( e => {
    e.preventDefault()
    alert('bsuyhvsdufty')
    const newProduct = {
        title: $("#spc-title").val(),
        price: $("#spc-number").val(),
        thumbnail: $("#spc-thumbnail").val()
    }
    socket.emit('new-product', newProduct)
}) 

$("#myForm-msg").submit( e => {
    e.preventDefault()
    const toSend = $("#spc-mail").val()
    socket.emit('new-user-mail', toSend)
})  