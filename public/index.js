const socket =io.connect()

let username = sessionStorage.getItem("username")
if (!username) {
    username = prompt("Ingrese su nombre de usuario")
}
$("#username").html(username)
socket.on('messages', data => {
    render(data)
})

function render(data) {
    data.forEach(info => {
        $("#messages").append(`
        <div>
            <strong>${info.author}</strong>
            <em>${info.text}</em>
        </div>`)
    })
}

$("#myForm").submit( e => {
    e.preventDefault()

    const message = {
        author: username,
        text: $("#text").val()
    }
    socket.emit('new-message', message)
})