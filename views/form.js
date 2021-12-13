const socket = io.connect()

socket.on('product', data => {
    render(data)
})

function render(data) {
    data.forEach(info => {
        $("#spc").append(`
        <div>
            <strong>${info.title}</strong>
            <em>${info.price}</em>
        </div>`)
    })
}


$("#myForm").submit( e => {
    e.preventDefault()
    const newProduct = {
        title: $("#spc-title").val(),
        price: $("#spc-number").val(),
        thumbnail: $("#spc-thumbnail").val()
    }
    socket.emit('new-product', newProduct)
}) 