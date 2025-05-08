document.addEventListener("DOMContentLoaded", () => {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    mostrarPedidos(carrito);

    document.getElementById('comprarCarrito').addEventListener('click', comprarCarrito);
    document.getElementById('btnVerificarClave').addEventListener('click', verificarClave);
    document.getElementById('btnGuardarClave').addEventListener('click', guardarNuevaClave);

    cargarPedidos();
    actualizarContenidoCarrito();
});

function mostrarPedidos(carrito) {
    if (carrito.length > 0) {
        const pedidosHTML = carrito.map(producto => `
            <div class="card mb-3">
                <div class="card-body">
                    <h5 class="card-title">${producto.productoName}</h5>
                    <p class="card-text"><strong>Cantidad:</strong> ${producto.cantidad}</p>
                    <p class="card-text"><strong>Precio:</strong> €${(producto.cantidad * producto.precio).toFixed(2)}</p>
                </div>
            </div>
        `).join('');
        document.getElementById('pedidosInfo').innerHTML = pedidosHTML;
    } else {
        document.getElementById('pedidosInfo').innerHTML = '<div class="alert alert-info mb-0">No tienes pedidos.</div>';
    }
}

async function cargarPedidos() {
    try {
        const response = await fetch('obtenerPedidos');
        const pedidos = await response.json();
        
        if (pedidos.length === 0) {
            document.getElementById('pedidosInfo').innerHTML = 
                '<div class="alert alert-info mb-0">No tienes pedidos.</div>';
            return;
        }

        let html = '';
        pedidos.forEach(pedido => {
            let productosHtml = '';
            
            pedido.productos.forEach(producto => {
                const total = producto.precio * producto.unidades;
                productosHtml += `
                    <div class="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2">
                        <span>${producto.descripcion} (x${producto.unidades})</span>
                        <span>${total.toFixed(2)}€</span>
                    </div>`;
            });

            const estadoClass = pedido.estado === 'Pendiente' ? 'warning' : 
                              pedido.estado === 'Enviado' ? 'info' :
                              pedido.estado === 'Entregado' ? 'success' : 
                              pedido.estado === 'Cancelado' ? 'danger' : 'secondary';

            const botonCancelar = (pedido.estado === 'Pendiente' || pedido.estado === 'Enviado') ? 
                `<button class="btn btn-danger btn-sm" onclick="cancelarPedido(${pedido.codigo})">
                    Cancelar Pedido
                </button>` : '';

            html += `
                <div class="card mb-3">
                    <div class="card-header">
                        <div class="d-flex justify-content-between align-items-center">
                            <span>Pedido #${pedido.codigo}</span>
                            <span class="text-muted">${new Date(pedido.fecha).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div class="card-body">
                        ${productosHtml}
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>
                                <strong>Total:</strong> ${pedido.importe.toFixed(2)}€
                                <span class="badge bg-${estadoClass} ms-2">${pedido.estado}</span>
                            </div>
                            <div>
                                ${botonCancelar}
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        document.getElementById('pedidosInfo').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        document.getElementById('pedidosInfo').innerHTML = 
            '<div class="alert alert-danger mb-0">Error al cargar los pedidos.</div>';
    }
}

async function cancelarPedido(codigoPedido) {
    if (!confirm('¿Estás seguro de que deseas cancelar este pedido?')) {
        return;
    }

    try {
        const response = await fetch('cancelarPedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `codigoPedido=${codigoPedido}`
        });

        const data = await response.json();
        
        if (data.success) {
            mostrarAlerta('alertaExito', data.message);
            await cargarPedidos(); // Recargar la lista de pedidos
        } else {
            mostrarAlerta('alertaError', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('alertaError', 'Error al cancelar el pedido');
    }
}

async function comprarCarrito() {
    try {
        const response = await fetch('compra', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        const alertaCompra = document.getElementById('alertaCompra');
        const alertaCompraMensaje = document.getElementById('alertaCompraMensaje');

        alertaCompraMensaje.textContent = data.message;
        alertaCompra.classList.add('show');

        if (data.success) {
            alertaCompra.classList.remove('alert-danger');
            alertaCompra.classList.add('alert-success');
            
            // Limpiar el carrito en memoria
            window.carrito = new Map();
            
            // Actualizar la interfaz
            actualizarContenidoCarrito();
            
            // Disparar evento para actualizar el menú
            document.dispatchEvent(new CustomEvent('carritoActualizado'));
            
            // Recargar los pedidos
            await cargarPedidos();
        } else {
            alertaCompra.classList.remove('alert-success');
            alertaCompra.classList.add('alert-danger');
        }

        setTimeout(() => {
            alertaCompra.classList.remove('show');
        }, 5000);
    } catch (error) {
        console.error('Error:', error);
        const alertaCompra = document.getElementById('alertaCompra');
        const alertaCompraMensaje = document.getElementById('alertaCompraMensaje');
        alertaCompra.classList.remove('alert-success');
        alertaCompra.classList.add('alert-danger', 'show');
        alertaCompraMensaje.textContent = 'Error al procesar la compra';
        
        setTimeout(() => {
            alertaCompra.classList.remove('show');
        }, 5000);
    }
}

// Función para actualizar el contenido del carrito en la página
function actualizarContenidoCarrito() {
    const carritoContent = document.getElementById('carritoContent');
    if (!window.carrito || window.carrito.size === 0) {
        carritoContent.innerHTML = '<div class="alert alert-info mb-0">El carrito está vacío</div>';
        return;
    }

    let html = '<div class="list-group">';
    window.carrito.forEach((producto, codigo) => {
        html += `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <span>${producto.descripcion} (x${producto.cantidad})</span>
                <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${codigo})">
                    Eliminar
                </button>
            </div>
        `;
    });
    html += '</div>';
    carritoContent.innerHTML = html;
}

// Escuchar cambios en el carrito
document.addEventListener('carritoActualizado', function() {
    actualizarContenidoCarrito();
});

document.addEventListener('mi-menu-cargado', function() {
    cargarCarrito().then(() => {
        actualizarContenidoCarrito();
    });
});

function editarUsuario() {
    // Obtener todos los elementos p que contienen la información
    const infoElements = document.querySelectorAll('#usuarioInfo p');
    
    // Extraer los valores de los elementos
    const nombreCompleto = infoElements[0].querySelector('.text-muted').textContent.trim();
    const email = infoElements[1].querySelector('.text-muted').textContent.trim();
    const telefono = infoElements[3].querySelector('.text-muted').textContent.trim();
    const domicilio = infoElements[4].querySelector('.text-muted').textContent.trim();
    const poblacion = infoElements[5].querySelector('.text-muted').textContent.trim();
    const provincia = infoElements[6].querySelector('.text-muted').textContent.trim();
    const cp = infoElements[7].querySelector('.text-muted').textContent.trim();

    // Separar nombre y apellidos
    const nombreParts = nombreCompleto.split(' ');
    const nombre = nombreParts[0];
    const apellidos = nombreParts.slice(1).join(' ');

    const formulario = `
        <form id="formularioEditar" class="row">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" name="nombre" value="${nombre}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Apellidos</label>
                    <input type="text" class="form-control" name="apellidos" value="${apellidos}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value="${email}" readonly>
                </div>
                <div class="mb-3">
                    <label class="form-label">Teléfono</label>
                    <input type="tel" class="form-control" name="telefono" value="${telefono !== 'No especificado' ? telefono : ''}">
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label">Dirección</label>
                    <input type="text" class="form-control" name="domicilio" value="${domicilio !== 'No especificado' ? domicilio : ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Población</label>
                    <input type="text" class="form-control" name="poblacion" value="${poblacion !== 'No especificada' ? poblacion : ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Provincia</label>
                    <input type="text" class="form-control" name="provincia" value="${provincia !== 'No especificada' ? provincia : ''}">
                </div>
                <div class="mb-3">
                    <label class="form-label">Código Postal</label>
                    <input type="text" class="form-control" name="cp" value="${cp !== 'No especificado' ? cp : ''}">
                </div>
            </div>
            <div class="col-12 mt-3">
                <button type="submit" class="btn btn-success">Guardar Cambios</button>
                <button type="button" class="btn btn-secondary" onclick="window.location.reload()">Cancelar</button>
                <button type="button" class="btn btn-warning" onclick="abrirModalCambiarClave()">Cambiar Contraseña</button>
            </div>
        </form>
    `;

    document.getElementById('usuarioInfo').innerHTML = formulario;

    document.getElementById('formularioEditar').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const datos = {
            accion: 'actualizar',
            nombre: formData.get('nombre'),
            apellidos: formData.get('apellidos'),
            telefono: formData.get('telefono'),
            domicilio: formData.get('domicilio'),
            poblacion: formData.get('poblacion'),
            provincia: formData.get('provincia'),
            cp: formData.get('cp')
        };

        try {
            const response = await fetch('actualizarUsuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(datos)
            });
            const result = await response.json();
            
            if (result.success) {
                mostrarAlerta('alertaExito', result.message);
                setTimeout(() => window.location.reload(), 1500);
            } else {
                mostrarAlerta('alertaError', result.message);
            }
        } catch (error) {
            mostrarAlerta('alertaError', 'Error al actualizar los datos');
        }
    });
}

function abrirModalCambiarClave() {
    const modal = new bootstrap.Modal(document.getElementById('cambiarClaveModal'));
    document.getElementById('formCambiarClave').reset();
    document.getElementById('nuevaClaveFields').style.display = 'none';
    document.getElementById('btnVerificarClave').style.display = 'block';
    document.getElementById('btnGuardarClave').style.display = 'none';
    modal.show();
}

async function verificarClave() {
    const claveActual = document.getElementById('claveActual').value;
    try {
        const response = await fetch('actualizarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                accion: 'verificarClave',
                claveActual: claveActual
            })
        });
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('nuevaClaveFields').style.display = 'block';
            document.getElementById('btnVerificarClave').style.display = 'none';
            document.getElementById('btnGuardarClave').style.display = 'block';
            document.getElementById('claveActual').setAttribute('readonly', true);
        } else {
            mostrarAlerta('alertaError', 'Contraseña actual incorrecta');
        }
    } catch (error) {
        mostrarAlerta('alertaError', 'Error al verificar la contraseña');
    }
}

async function guardarNuevaClave() {
    const nuevaClave = document.getElementById('nuevaClave').value;
    const confirmarClave = document.getElementById('confirmarClave').value;

    if (nuevaClave !== confirmarClave) {
        mostrarAlerta('alertaError', 'Las contraseñas no coinciden');
        return;
    }

    try {
        const response = await fetch('actualizarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                accion: 'actualizar',
                nuevaClave: nuevaClave
            })
        });
        const result = await response.json();
        
        if (result.success) {
            mostrarAlerta('alertaExito', 'Contraseña actualizada correctamente');
            bootstrap.Modal.getInstance(document.getElementById('cambiarClaveModal')).hide();
            setTimeout(() => window.location.reload(), 1500);
        } else {
            mostrarAlerta('alertaError', result.message);
        }
    } catch (error) {
        mostrarAlerta('alertaError', 'Error al actualizar la contraseña');
    }
}

function mostrarAlerta(tipo, mensaje) {
    const alerta = document.getElementById(tipo);
    const mensajeElement = document.getElementById(tipo + 'Mensaje');
    mensajeElement.textContent = mensaje;
    alerta.style.display = 'block';
    alerta.classList.add('show');
    
    setTimeout(() => {
        alerta.classList.remove('show');
        setTimeout(() => {
            alerta.style.display = 'none';
        }, 150);
    }, 3000);
}