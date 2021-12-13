const socket = io.connect()

socket.on('product', data => {
    render(data)
})

function render(data) {
    $("#new-line").append(`
        <td> ${data.title} </td>
        <td> ${data.price} </td>
        <td><img src="${data.thumbnail} " width="100px"></td>
    `)
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