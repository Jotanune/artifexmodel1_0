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
            // Asegurarse de que cada producto tenga el campo 'codigo' (id real)
            pedido.productos.forEach((producto, idx) => {
                // Obtener el código del producto desde el backend (debe estar en la consulta SQL)
                // Si no existe, no se podrá editar correctamente
                if (!('codigo' in producto)) {
                    // Si el backend no lo envía, no se podrá editar correctamente
                    // ¡IMPORTANTE! El backend debe enviar el campo 'codigo' en cada producto
                    producto.codigo = producto.codigo_producto || producto.id || undefined;
                }
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

            let botonesAccion = '';
            if (pedido.estado === 'Pendiente') {
                if (pedido.productos.length > 1 || pedido.productos[0].unidades > 1) {
                    // Ambos botones
                    botonesAccion = `
                        <button class="btn btn-warning btn-sm me-2 btn-editar-pedido" data-codigopedido="${pedido.codigo}" data-productos='${JSON.stringify(pedido.productos).replace(/'/g, "&#39;")}' type="button">Editar Pedido</button>
                        <button class="btn btn-danger btn-sm" onclick="cancelarPedido(${pedido.codigo})" type="button">Cancelar Pedido</button>
                    `;
                } else {
                    botonesAccion = `<button class="btn btn-danger btn-sm" onclick="cancelarPedido(${pedido.codigo})" type="button">Cancelar Pedido</button>`;
                }
            } else if (pedido.estado === 'Enviado') {
                botonesAccion = `<button class="btn btn-danger btn-sm" onclick="cancelarPedido(${pedido.codigo})" type="button">Cancelar Pedido</button>`;
            }

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
                                ${botonesAccion}
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        document.getElementById('pedidosInfo').innerHTML = html;

        // Añadir listeners a los botones de editar pedido
        document.querySelectorAll('.btn-editar-pedido').forEach(btn => {
            btn.addEventListener('click', function() {
                const codigoPedido = this.getAttribute('data-codigopedido');
                const productos = JSON.parse(this.getAttribute('data-productos').replace(/&#39;/g, "'"));
                abrirEditarPedidoModal(codigoPedido, productos);
            });
        });
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
        document.getElementById('pedidosInfo').innerHTML = 
            '<div class="alert alert-danger mb-0">Error al cargar los pedidos.</div>';
    }
}

// Modal para editar pedido (cancelar productos individuales)
window.abrirEditarPedidoModal = function(codigoPedido, productos) {
    // Escapar el JSON para evitar problemas con caracteres especiales
    const productosEscapados = encodeURIComponent(JSON.stringify(productos)).replace(/'/g, "\\'");
    
    let modalHtml = `
    <div class="modal fade" id="editarPedidoModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar Pedido #${codigoPedido}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <form id="formEditarPedido">
              <p>Selecciona los productos y cantidades a cancelar:</p>
              <div id="productosEditarLista">
                ${productos.map((prod, idx) => `
                  <div class="mb-2">
                    <label>${prod.descripcion} (x${prod.unidades})</label>
                    <input type="number" min="0" max="${prod.unidades}" value="0" class="form-control form-control-sm" name="prod_${prod.codigo}" style="width:100px;display:inline-block;margin-left:10px;">
                  </div>
                `).join('')}
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-warning" onclick="enviarEdicionPedido(${codigoPedido}, '${productosEscapados}')">Confirmar Cambios</button>
          </div>
        </div>
      </div>
    </div>`;
    // Eliminar si ya existe
    const oldModal = document.getElementById('editarPedidoModal');
    if (oldModal) oldModal.remove();
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const modal = new bootstrap.Modal(document.getElementById('editarPedidoModal'));
    modal.show();
}

window.enviarEdicionPedido = async function(codigoPedido, productosJson) {
    try {
        const productos = JSON.parse(decodeURIComponent(productosJson));
        const form = document.getElementById('formEditarPedido');
        const formData = new FormData(form);
        const productosCancelar = [];

        productos.forEach(prod => {
            const cantidad = parseInt(formData.get(`prod_${prod.codigo}`)) || 0;
            if (cantidad > 0 && cantidad <= prod.unidades) {
                productosCancelar.push({
                    codigo: prod.codigo,
                    cantidad: cantidad
                });
            }
        });

        if (productosCancelar.length === 0) {
            mostrarAlerta('warning', 'Por favor, selecciona al menos un producto y una cantidad válida para cancelar.');
            return;
        }

        const response = await fetch('editarPedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                codigoPedido: codigoPedido,
                productosCancelar: productosCancelar
            })
        });

        const data = await response.json();
        
        // Cerrar el modal primero
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarPedidoModal'));
        if (modal) {
            modal.hide();
        }

        if (data.success) {
            // Mostrar mensaje de éxito
            mostrarAlerta('success', data.message || 'Pedido actualizado correctamente');
            
            // Recargar los pedidos para actualizar la vista
            await cargarPedidos();
        } else {
            mostrarAlerta('danger', data.message || 'No se pudo actualizar el pedido');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarAlerta('danger', 'Error al procesar la solicitud: ' + error.message);
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
        // Mostrar el modal de compra
        const modal = new bootstrap.Modal(document.getElementById('compraModal'));
        modal.show();

        // Manejar el cambio en el método de pago
        document.getElementById('metodoPago').addEventListener('change', function() {
            const datosTarjeta = document.getElementById('datosTarjeta');
            const datosTransferencia = document.getElementById('datosTransferencia');
            
            if (this.value === 'tarjeta') {
                datosTarjeta.style.display = 'block';
                datosTransferencia.style.display = 'none';
                // Hacer los campos de tarjeta requeridos
                document.getElementById('numeroTarjeta').required = true;
                document.getElementById('caducidadTarjeta').required = true;
                document.getElementById('cvvTarjeta').required = true;
                document.getElementById('comprobanteTransferencia').required = false;
            } else if (this.value === 'transferencia') {
                datosTarjeta.style.display = 'none';
                datosTransferencia.style.display = 'block';
                // Hacer el comprobante requerido y quitar required de los campos de tarjeta
                document.getElementById('numeroTarjeta').required = false;
                document.getElementById('caducidadTarjeta').required = false;
                document.getElementById('cvvTarjeta').required = false;
                document.getElementById('comprobanteTransferencia').required = true;
            } else {
                datosTarjeta.style.display = 'none';
                datosTransferencia.style.display = 'none';
            }
        });

        // Manejar el envío del formulario
        document.getElementById('btnFinalizarCompra').addEventListener('click', async function() {
            const form = document.getElementById('formCompra');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Recoger los datos de dirección
            const datosEnvio = {
                domicilio: document.getElementById('domicilioEnvio').value,
                poblacion: document.getElementById('poblacionEnvio').value,
                provincia: document.getElementById('provinciaEnvio').value,
                cp: document.getElementById('cpEnvio').value
            };

            // Realizar la compra
            const response = await fetch('compra', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    datosEnvio: datosEnvio,
                    metodoPago: document.getElementById('metodoPago').value
                })
            });

            const data = await response.json();
            
            if (data.success) {
                modal.hide();
                mostrarAlerta('success', data.message);
                // Limpiar el carrito
                localStorage.removeItem('carrito');
                // Recargar la página después de 2 segundos
                setTimeout(() => window.location.reload(), 2000);
            } else {
                mostrarAlerta('error', data.message);
            }
        });
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        mostrarAlerta('error', 'Error al procesar la compra. Por favor, inténtelo de nuevo.');
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

    // Separar nombre y apellidos
    const nombreParts = nombreCompleto.split(' ');
    const nombre = nombreParts[0];
    const apellidos = nombreParts.slice(1).join(' ');    const formulario = `
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
            </div>
            <div class="col-md-6">
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
    // Obtener el elemento de alerta correspondiente
    const alertaId = tipo === 'success' ? 'alertaExito' : 'alertaError';
    const alertaMensajeId = tipo === 'success' ? 'alertaExitoMensaje' : 'alertaErrorMensaje';
    
    const alerta = document.getElementById(alertaId);
    const alertaMensaje = document.getElementById(alertaMensajeId);
    
    if (alerta && alertaMensaje) {
        // Actualizar el mensaje
        alertaMensaje.textContent = mensaje;
        
        // Mostrar la alerta
        alerta.style.display = 'block';
        alerta.classList.add('show');
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            alerta.classList.remove('show');
            setTimeout(() => {
                alerta.style.display = 'none';
            }, 150);
        }, 5000);
    }
}