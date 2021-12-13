const socket = io.connect()

socket.on('product', data => {
    //render(data)
})

/* function render(data) {
    data.forEach(info => {
        $("#messages").append(`
        <div>
            <strong>${info.author}</strong>
            <em>${info.text}</em>
        </div>`)
    })
}
*/

$("#myForm").submit( e => {
    e.preventDefault()
    const newProduct = {
        title: $("#spc-title").val(),
        price: $("#spc-number").val(),
        thumbnail: $("#spc-thumbnail").val()
    }
    socket.emit('new-product', newProduct)
}) 