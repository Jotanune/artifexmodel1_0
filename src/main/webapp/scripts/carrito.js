let carrito = new Map();

function showNotification(message) {
    // Crear o reutilizar el contenedor de notificaciones
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Crear la notificación
    const notification = document.createElement('div');
    notification.className = 'cart-notification alert alert-success';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-cart-check me-2"></i>
            <span>${message}</span>
        </div>
    `;

    // Añadir la notificación al contenedor
    container.appendChild(notification);

    // Eliminar la notificación después de 3 segundos
    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.remove();
            // Eliminar el contenedor si no hay más notificaciones
            if (container.children.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}

async function anyadirProducto(codigo, descripcion, cantidad) {
    if (cantidad === undefined || cantidad <= 0) {
        alert("Debes asignar por lo menos un producto");
        return;
    }

    try {
        const codigoNum = parseInt(codigo);
        const response = await fetch('carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=add&codigo=${codigoNum}&cantidad=${cantidad}`
        });

        const data = await response.json();
        if (data.success) {
            const cantidadAnterior = carrito.get(codigoNum)?.cantidad || 0;
            carrito.set(codigoNum, {
                descripcion: descripcion,
                cantidad: cantidadAnterior + cantidad
            });
            actualizarDropdownCarrito();
            limpiarInput();
            
            // Mostrar notificación
            const mensaje = cantidadAnterior === 0 
                ? `Se ha añadido ${cantidad} unidad(es) de "${descripcion}" al carrito`
                : `Se ha actualizado la cantidad de "${descripcion}" a ${cantidadAnterior + cantidad} unidades`;
            showNotification(mensaje);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al añadir el producto al carrito');
    }
}

function limpiarInput() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.value = "0";
    });
}

async function eliminarProducto(codigo) {
    try {
        const codigoNum = parseInt(codigo);
        const response = await fetch('carrito', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `action=remove&codigo=${codigoNum}`
        });

        const data = await response.json();
        if (data.success) {
            carrito.delete(codigoNum);
            actualizarDropdownCarrito();
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto del carrito');
    }
}

async function disminuirCantidad(codigo) {
    try {
        const codigoNum = parseInt(codigo);
        const producto = carrito.get(codigoNum);
        
        if (producto && producto.cantidad > 1) {
            const response = await fetch('carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `action=decrease&codigo=${codigoNum}`
            });

            const data = await response.json();
            if (data.success) {
                producto.cantidad--;
                carrito.set(codigoNum, producto);
                actualizarDropdownCarrito();
            } else {
                alert(data.message);
            }
        } else if (producto && producto.cantidad === 1) {
            eliminarProducto(codigo);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al disminuir la cantidad del producto');
    }
}

function actualizarDropdownCarrito() {
    const dropdownMenu = document.querySelector("#carritoDropdown + .dropdown-menu");
    if (!dropdownMenu) return;

    dropdownMenu.innerHTML = "";
    
    if (carrito.size === 0) {
        dropdownMenu.innerHTML = '<a class="dropdown-item" href="#">Vacío</a>';
    } else {
        carrito.forEach((producto, codigo) => {
            const item = document.createElement("a");
            item.classList.add("dropdown-item");
            
            const productoInfo = document.createElement("span");
            productoInfo.textContent = `${producto.descripcion} (x${producto.cantidad})`;
            item.appendChild(productoInfo);
            
            const botonesContainer = document.createElement("div");
            botonesContainer.classList.add("botones-carrito");
            
            const btnDisminuir = document.createElement("button");
            btnDisminuir.textContent = "−";
            btnDisminuir.classList.add("btn", "btn-sm", "btn-decrease", "ms-2");
            btnDisminuir.onclick = (e) => {
                e.preventDefault();
                disminuirCantidad(codigo);
            };
            
            const btnEliminar = document.createElement("button");
            btnEliminar.textContent = "❌";
            btnEliminar.classList.add("btn", "btn-sm", "btn-danger", "ms-2");
            btnEliminar.onclick = (e) => {
                e.preventDefault();
                eliminarProducto(codigo);
            };
            
            botonesContainer.appendChild(btnDisminuir);
            botonesContainer.appendChild(btnEliminar);
            item.appendChild(botonesContainer);
            dropdownMenu.appendChild(item);
        });
    }

    // Emitir evento de actualización del carrito
    window.carrito = carrito;
    document.dispatchEvent(new Event('carritoActualizado'));
}

async function cargarCarrito() {
    try {
        const response = await fetch('carrito');
        const data = await response.json();
        
        carrito = new Map();
        
        // Para cada producto en el carrito, obtener su información completa
        for (const [codigo, cantidad] of Object.entries(data)) {
            const codigoNum = parseInt(codigo);
            // Obtener la información del producto
            const productoResponse = await fetch(`obtenerProducto?codigo=${codigoNum}`);
            const productoData = await productoResponse.json();
            
            carrito.set(codigoNum, {
                descripcion: productoData.descripcion,
                cantidad: cantidad
            });
        }
        
        actualizarDropdownCarrito();
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

document.addEventListener("DOMContentLoaded", cargarCarrito);
