//Configuración de productos con stock y descuentos
const productos = {
    Balde13Luxe: {
        nombre: "Balde 13 Lts de Luxe VIRGEN",
        precio: 6000,
        stock: 10,
        descuento: 0.1
    },
    Balde13LuxeMopa: {
        nombre: "Balde 13 Lts de LUXE con ESTRUJAMOPA",
        precio: 8000,
        stock: 12,
        descuento: 0.05
    },
    Balde11Luxe: {
        nombre: "Balde 11 Lts de Luxe VIRGEN TRASLUCIDO",
        precio: 9500,
        stock: 10,
        descuento: 0
    },
    BankitoKendy: {
        nombre: "Bankito Escalera KENDY Reforzado 120 Kgs",
        precio: 25000,
        stock: 12,
        descuento: 0.1
    },
    BankitoNegro: {
        nombre: "Bankito NEGRO",
        precio: 14000,
        stock: 10,
        descuento: 0.05
    },
    CajaH11: {
        nombre: "Cajas de Herramientas 11",
        precio: 18000,
        stock: 15,
        descuento: 0.1
    },
    Basurero20L: {
        nombre: "Basurero Pedal Doble Ecologico 20 L",
        precio: 21000,
        stock: 14,
        descuento: 0
    },
    Basurero60L: {
        nombre: "Basurero Pedal 60 Litros",
        precio: 31000,
        stock: 10,
        descuento: 0.1
    },
    DecoBoxS: {
        nombre: "Deco Box Supreme",
        precio: 22000,
        stock: 6,
        descuento: 0.05
    }
}

const IVA = 0.21

//Inicializamos el carrito cuando se carga la pagina

document.addEventListener("DOMContentLoaded", cargarCarrito)

function agregarAlCarrito(nombre, precio, productoKey) {
    const producto = productos[productoKey]

    if(producto.stock <= 0)
    {
        alert("Sin stock")
        return
    }
    else
    {
        //Obtenemos la info del carrito de LocalStorage
        let carrito = JSON.parse(localStorage.getItem("carrito")) || []

        //Agregamos nuevo producto
        carrito.push({
            nombre: producto.nombre,
            precio: producto.precio,
            productoKey: productoKey
        })

        //Reducir el stock del producto
        producto.stock--

        document.getElementById(`stock-${productoKey}`).textContent = producto.stock

        //Guardar en LocalStorage el producto
        localStorage.setItem("carrito", JSON.stringify(carrito))

        //Actualizamos la vista del carrito
        renderizarCarrito()

    }
}


function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito')
    const subtotalCarrito = document.getElementById('subtotal-carrito')
    const descuentoCarrito = document.getElementById('descuento-carrito')
    const ivaCarrito = document.getElementById('iva-carrito')
    const totalCarrito = document.getElementById('total-carrito')

    const carrito = JSON.parse(localStorage.getItem("carrito")) || []

    //Limpiamos la lista
    listaCarrito.innerHTML = ""

    //Seteamos en 0 los datos
    let subtotal = 0
    let descuentoTotal = 0

    //Renderizar cada producto
    carrito.forEach((producto,index) => {
        //iteramos sobre cada producto y su indice se almacena en index
        const productoInfo = productos[producto.productoKey]
        const li = document.createElement("li")
        //Calculamos el descuento individual
        const descuentoProducto = productoInfo.descuento * producto.precio
        const precioConDescuento = producto.precio - descuentoProducto
        li.innerHTML = `
        ${producto.nombre} - ${producto.precio}
        ${productoInfo.descuento > 0 ? 
        `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}% :
        -$${descuentoProducto.toFixed(2)})</span>`
        : ""}`

        //Elimina el producto de la lista
        const botonEliminar = document.createElement("button")

        botonEliminar.textContent = "Eliminar"
        botonEliminar.onclick = () => eliminarCarrito(index)

        li.appendChild(botonEliminar)
        listaCarrito.appendChild(li)



        //Cuentas
        subtotal += producto.precio
        descuentoTotal += descuentoProducto
    });


    //Calcular IVA
    const ivaTotal = (subtotal - descuentoTotal) * IVA

    const total = subtotal - descuentoTotal + ivaTotal

    //Actualizamos los totales
    subtotalCarrito.textContent = subtotal.toFixed(2)
    descuentoCarrito.textContent = descuentoTotal.toFixed(2)
    ivaCarrito.textContent = ivaTotal.toFixed(2)
    totalCarrito.textContent = total.toFixed(2)

    // if (listaCarrito.innerHTML == "")
    // {
    //     document.getElementById("carrito-icn").style.display = "none";
    // }
    // else
    // {
    //     document.getElementById("carrito-icn").style.display = "inline";
    // }
}


function eliminarCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || []

    //Recuperamos el producto y devolvemos el stock
    const producto = productos[carrito[index].productoKey]
    producto.stock++

    //Renderizar
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock
    //Eliminamos el producto por indice
    carrito.splice(index, 1)
    //Actualizamos el LocalStorage
    localStorage.setItem("carrito",JSON.stringify(carrito))

    renderizarCarrito()
}


function vaciarCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || []

    carrito.forEach(item =>{
        const producto = productos[item.productoKey]
        producto.stock++
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock

        localStorage.removeItem("carrito")

        renderizarCarrito()
    })
}

function cargarCarrito() {
    // Cargar carrito al iniciar la página
    //renderizarCarrito();
    vaciarCarrito()
    renderizarCarrito()
}


// Funciones de Checkout
function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    // Validar que hay productos en el carrito
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    // Mostrar modal de checkout
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'flex';
    
    // Actualizar totales en el modal
    const subtotal = parseFloat(document.getElementById('subtotal-carrito').textContent);
    const descuento = parseFloat(document.getElementById('descuento-carrito').textContent);
    const iva = parseFloat(document.getElementById('iva-carrito').textContent);
    const total = parseFloat(document.getElementById('total-carrito').textContent);
    
    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function realizarCompra() {
    // Simular compra
    alert('¡Compra realizada con éxito!');
    
    // Vaciar carrito
    localStorage.removeItem('carrito');
    
    // Cerrar modal
    cerrarCheckout();
    
    // Renderizar carrito vacío
    renderizarCarrito();
}

function cerrarCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'none';
}
