const socket = io();

const currentUrl = window.location.href;
const cidMatch = currentUrl.match(/\/api\/carts\/cart\/([^\/]+)/);

if (cidMatch && cidMatch[1]) {
    const cid = cidMatch[1];

    socket.emit('getCartByIdResponse', { cid });

    socket.on('cartResponse', (response) => {
        updateTable(response);
    });
} else {
    console.log('No se encontró el cid en la URL.');
}
console.log(cidMatch);
socket.emit('getCartByIdResponse', cidMatch)

function updateTable(response) {
    console.log('Datos del carrito recibidos:', response);

    if (response && response.cartProducts && Array.isArray(response.cartProducts)) {
        const products = response.cartProducts;

        console.log(products); // Verifica que products tenga los datos esperados

        const tableContainer = document.getElementById('products-container');
        tableContainer.innerHTML = ''; 
        const productsContainer = document.querySelector('#products-container');
        
        if(products.length === 0){
                const row = document.createElement('tr');
                row.innerHTML = `
                    <h2>Empty cart</h2>
                `;
                tableContainer.appendChild(row); 
        }else{
            productsContainer.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Quantity</th>
            </tr>
        `;
            products.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product._id}</td>
                    <td>${product.quantity}</td>
                `;
                tableContainer.appendChild(row);
            });
        }
    } 
}