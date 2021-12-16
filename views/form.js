const socket = io.connect()

socket.on('product', data => {
    renderProduct(data)
})

socket.on('lista-ingresando', data => {
    console.log('Lista de productos a representar en la vista: ', data)
})

socket.on('open-chat', data => {
    renderChat(data)
})

function renderProduct(data) {
    $("#new-line").append(`
    <tr>
        <td> ${data.title} </td>
        <td> ${data.price} </td>
        <td><img src="${data.thumbnail} " width="100px"></td>
    </tr>`)
}

function renderChat(data) {
    $("#chat-msg").append(`
        <input id="spc-mail" name="msg" placeholder="Ingrese un mensaje"></input>
    `)
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
    const newProduct = {
        title: $("#spc-title").val(),
        price: $("#spc-number").val(),
        thumbnail: $("#spc-thumbnail").val()
    }
    socket.emit('new-product', newProduct)
}) 

$("#myForm-login").submit( e => {
    e.preventDefault()
    const toSend = $("#spc-mail").val()
    socket.emit('new-user-mail', toSend)
    console.log("login")
})  

$("#myForm-msg").submit( e => {
    e.preventDefault()
    console.log('asbdabdsgiu')
    const isLogin = $("#spc-mail").val()
    if(isLogin.length === 0) {
        $("#box-msg").append(`
        Debe ingresar un mail antes
        `)
    } else {
        console.log('ya puede')
    }
    /* const toSend = $("#spc-mail").val()
    socket.emit('new-user-mail', toSend) */
}) 