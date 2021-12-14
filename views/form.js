const socket = io.connect()

socket.on('product', data => {
    render(data)
})

function render(data) {
    $("#new-line").append(`
    <tr>
        <td> ${data.title} </td>
        <td> ${data.price} </td>
        <td><img src="${data.thumbnail} " width="100px"></td>
    </tr>`)
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