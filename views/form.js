const socket = io.connect()

socket.on('product', data => {
    renderProduct(data)
})

socket.on('new-msg-chat', data => {
    renderNewChat(data)
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
        <input id="spc-text" name="msg" placeholder="Ingrese un mensaje"></input>
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

function renderNewChat(data) {
    const user = data.mail
    const msg = data.data
    const now = new Date();
    $("#box-msg").append(`
        <span class="blue-text text">${user}</span>
        [<span class="brown-text text">${now}</span>] :
        <span class="green-text text">${msg}</span>
        </br>
    `)
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
})  

$("#myForm-msg").submit( e => {
    e.preventDefault()
    const isLogin = $("#spc-mail").val()
    if(isLogin.length === 0) {
        $("#box-msg").append(`
        <span class="brown-text text">Debe ingresar un mail antes<span></br>
        `)
    } else {
        const toSend = $("#spc-text").val()
        socket.emit('chat-text', toSend)
    }
}) 